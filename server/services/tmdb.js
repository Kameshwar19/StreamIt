const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
    }
});

// Helper to map era to dates
const getEraDates = (era) => {
    const currentYear = new Date().getFullYear();
    switch (era) {
        case 'classic': return { 'primary_release_date.lte': '1980-12-31' };
        case 'retro': return { 'primary_release_date.gte': '1981-01-01', 'primary_release_date.lte': '1999-12-31' };
        case 'modern': return { 'primary_release_date.gte': '2000-01-01', 'primary_release_date.lte': '2015-12-31' };
        case 'new_age': return { 'primary_release_date.gte': '2016-01-01' };
        default: return {};
    }
};

// Helper to search person ID by name (for Talent input)
const searchPerson = async (name) => {
    try {
        const response = await tmdbClient.get('/search/person', { params: { query: name } });
        return response.data.results[0]?.id;
    } catch (error) {
        console.error('Error searching person:', error.message);
        return null;
    }
};

const getDiscoverMovies = async (filters) => {
    try {
        fs.appendFileSync('server_debug.log', `${new Date().toISOString()} - Request Received: ${JSON.stringify(filters)}\n`);
    } catch (e) {
        console.error("Logging failed", e);
    }

    const { genres, runtime, era, talent } = filters;

    let params = {
        sort_by: 'popularity.desc',
        include_adult: false,
        include_video: false,
        page: 1
    };

    console.log('Received Filters:', filters);

    if (genres && genres.length > 0) {
        params.with_genres = genres.join(','); // Use AND logic for stricter matching of multiple vibes
    }

    if (runtime) {
        // Ensure runtime is an array
        const runtimes = Array.isArray(runtime) ? runtime : [runtime];
        let minRuntime = Infinity;
        let maxRuntime = -Infinity;
        let hasRuntimeFilter = false;

        runtimes.forEach(r => {
            if (r === 'short') {
                minRuntime = Math.min(minRuntime, 0);
                maxRuntime = Math.max(maxRuntime, 90);
                hasRuntimeFilter = true;
            }
            if (r === 'medium') {
                minRuntime = Math.min(minRuntime, 90);
                maxRuntime = Math.max(maxRuntime, 120);
                hasRuntimeFilter = true;
            }
            if (r === 'long') {
                minRuntime = Math.min(minRuntime, 120);
                maxRuntime = Math.max(maxRuntime, 300); // Cap at 5 hours effectively
                hasRuntimeFilter = true;
            }
        });

        if (hasRuntimeFilter) {
            params['with_runtime.gte'] = minRuntime;
            params['with_runtime.lte'] = maxRuntime;
        }
    }

    if (era) {
        // Ensure era is an array
        const eras = Array.isArray(era) ? era : [era];
        let minDate = '9999-12-31';
        let maxDate = '0000-01-01';
        let hasEraFilter = false;

        eras.forEach(e => {
            if (e === 'any') return;
            const range = getEraDates(e);
            if (range['primary_release_date.gte'] && range['primary_release_date.gte'] < minDate) {
                minDate = range['primary_release_date.gte'];
            }
            if (range['primary_release_date.lte'] && range['primary_release_date.lte'] > maxDate) {
                maxDate = range['primary_release_date.lte'];
            }
            // Handle edge cases where only one bound exists
            if (!range['primary_release_date.gte'] && range['primary_release_date.lte']) {
                // Open start, e.g. classic < 1980. Min date remains "start of time" which TMDB handles or we can set strict
                minDate = '1900-01-01';
            }
            if (!range['primary_release_date.lte'] && range['primary_release_date.gte']) {
                // Open end, e.g. New Age 2016+. Max date remains "end of time"
                const today = new Date().toISOString().split('T')[0];
                maxDate = today;
            }
            hasEraFilter = true;
        });

        if (hasEraFilter) {
            params['primary_release_date.gte'] = minDate;
            params['primary_release_date.lte'] = maxDate;
        }
    }

    if (talent) {
        // Assuming talent is passed as name or ID. If name, we'd need to resolve it first.
        // For MVP, let's assume the frontend sends the ID or we resolve it here.
        // If it's a string name:
        if (isNaN(talent)) {
            const personId = await searchPerson(talent);
            if (personId) params.with_cast = personId;
        } else {
            params.with_cast = talent;
        }
    }

    try {
        console.log('TMDB Params:', JSON.stringify(params, null, 2));
        const response = await tmdbClient.get('/discover/movie', { params });
        console.log('TMDB Results Count:', response.data.results.length);

        fs.appendFileSync('server_debug.log', `${new Date().toISOString()} - Filters: ${JSON.stringify(filters)}\n`);
        fs.appendFileSync('server_debug.log', `${new Date().toISOString()} - Params: ${JSON.stringify(params)}\n`);
        fs.appendFileSync('server_debug.log', `${new Date().toISOString()} - Results: ${response.data.results.length}\n\n`);

        if (response.data.results.length === 0) {
            console.log('Zero results found. Attempting fallback...');

            // Level 1 Fallback: Drop Era and Runtime, keep Genre and Talent
            if ((filters.era && filters.era.length > 0) || (filters.runtime && filters.runtime.length > 0)) {
                console.log('Fallback: Dropping strict filters (Era/Runtime)');
                const relaxedFilters = { ...filters, era: [], runtime: [] };
                return getDiscoverMovies(relaxedFilters);
            }

            // Level 2 Fallback: Drop Talent, keep Genre
            if (filters.talent) {
                console.log('Fallback: Dropping Talent');
                const genreOnlyFilters = { ...filters, talent: '', era: [], runtime: [] };
                return getDiscoverMovies(genreOnlyFilters);
            }

            // Level 3 Fallback: Just Popular (Empty Filters)
            if (filters.genres && filters.genres.length > 0) {
                console.log('Fallback: Dropping Genre (Show Popular)');
                return getDiscoverMovies({ genres: [], runtime: [], era: [], talent: '' });
            }
        }

        return response.data.results;
    } catch (error) {
        console.error("Caught error in getDiscoverMovies:", error.message);
        try {
            fs.appendFileSync('server_debug.log', `${new Date().toISOString()} - ERROR: ${error.message}\n\n`);
        } catch (logError) {
            console.error("Failed to write error log:", logError);
        }
        throw error;
    }
};

const getMovieDetails = async (movieId) => {
    try {
        const response = await tmdbClient.get(`/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('TMDB Details Error:', error.message);
        throw error;
    }
};

module.exports = { getDiscoverMovies, getMovieDetails, searchPerson };
