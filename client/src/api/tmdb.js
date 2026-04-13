// Direct TMDB API client - bypasses backend server requirement
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = 'c50110df734c533de4401c213b5e4151';

const getEraDates = (era) => {
    switch (era) {
        case 'classic': return { 'primary_release_date.lte': '1980-12-31', 'primary_release_date.gte': '1900-01-01' };
        case 'retro': return { 'primary_release_date.gte': '1981-01-01', 'primary_release_date.lte': '1999-12-31' };
        case 'modern': return { 'primary_release_date.gte': '2000-01-01', 'primary_release_date.lte': '2015-12-31' };
        case 'new_age': return { 'primary_release_date.gte': '2016-01-01', 'primary_release_date.lte': new Date().toISOString().split('T')[0] };
        default: return {};
    }
};

const searchPerson = async (name) => {
    try {
        const url = new URL(`${TMDB_BASE_URL}/search/person`);
        url.searchParams.set('api_key', TMDB_API_KEY);
        url.searchParams.set('query', name);
        const res = await fetch(url.toString());
        const data = await res.json();
        return data.results?.[0]?.id || null;
    } catch {
        return null;
    }
};

export const discoverMovies = async (filters) => {
    const { genres, runtime, era, talent } = filters;

    const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        sort_by: 'popularity.desc',
        include_adult: 'false',
        include_video: 'false',
        page: '1',
        language: 'en-US',
    });

    // Genres
    if (genres && genres.length > 0) {
        params.set('with_genres', genres.join(','));
    }

    // Runtime
    if (runtime && Array.isArray(runtime) && !runtime.includes('any') && runtime.length > 0) {
        let minRuntime = Infinity;
        let maxRuntime = -Infinity;
        runtime.forEach(r => {
            if (r === 'short') { minRuntime = Math.min(minRuntime, 0); maxRuntime = Math.max(maxRuntime, 90); }
            if (r === 'medium') { minRuntime = Math.min(minRuntime, 90); maxRuntime = Math.max(maxRuntime, 120); }
            if (r === 'long') { minRuntime = Math.min(minRuntime, 120); maxRuntime = Math.max(maxRuntime, 300); }
        });
        if (minRuntime !== Infinity) {
            params.set('with_runtime.gte', minRuntime.toString());
            params.set('with_runtime.lte', maxRuntime.toString());
        }
    }

    // Era
    if (era && Array.isArray(era) && !era.includes('any') && era.length > 0) {
        let minDate = '9999-12-31';
        let maxDate = '0000-01-01';
        era.forEach(e => {
            const range = getEraDates(e);
            if (range['primary_release_date.gte'] && range['primary_release_date.gte'] < minDate) minDate = range['primary_release_date.gte'];
            if (range['primary_release_date.lte'] && range['primary_release_date.lte'] > maxDate) maxDate = range['primary_release_date.lte'];
        });
        if (minDate !== '9999-12-31') params.set('primary_release_date.gte', minDate);
        if (maxDate !== '0000-01-01') params.set('primary_release_date.lte', maxDate);
    }

    // Talent
    if (talent && talent.trim()) {
        if (isNaN(talent)) {
            const personId = await searchPerson(talent.trim());
            if (personId) params.set('with_cast', personId.toString());
        } else {
            params.set('with_cast', talent);
        }
    }

    try {
        const url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
        const data = await res.json();
        let results = data.results || [];

        // Fallback: drop era/runtime if empty
        if (results.length === 0 && (era?.length > 0 || runtime?.length > 0)) {
            return discoverMovies({ ...filters, era: [], runtime: [] });
        }
        // Fallback: drop talent if still empty
        if (results.length === 0 && talent) {
            return discoverMovies({ ...filters, talent: '', era: [], runtime: [] });
        }

        return results;
    } catch (err) {
        console.error('TMDB fetch error:', err);
        return [];
    }
};

export const getMovieDetails = async (movieId) => {
    const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB details error: ${res.status}`);
    return res.json();
};
