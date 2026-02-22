const axios = require('axios');
require('dotenv').config();

const WATCHMODE_BASE_URL = 'https://api.watchmode.com/v1';
const WATCHMODE_API_KEY = process.env.WATCHMODE_API_KEY;

const getStreamingSources = async (tmdbId, region = 'IN') => {
    try {
        // Watchmode uses its own ID or can query by TMDB ID
        // Endpoint: /title/{title_id}/sources/
        // First we might need to get the watchmode ID using search or use the tmdb_id param if supported in a search endpoint.
        // Actually, Watchmode has a search endpoint: /search/?search_field=tmdb_id&search_value={id}

        const searchRes = await axios.get(`${WATCHMODE_BASE_URL}/search/`, {
            params: {
                apiKey: WATCHMODE_API_KEY,
                search_field: 'tmdb_movie_id',
                search_value: tmdbId
            }
        });

        if (!searchRes.data.title_results || searchRes.data.title_results.length === 0) {
            return [];
        }

        const titleId = searchRes.data.title_results[0].id;

        const sourcesRes = await axios.get(`${WATCHMODE_BASE_URL}/title/${titleId}/sources/`, {
            params: {
                apiKey: WATCHMODE_API_KEY
            }
        });

        // Deduplicate sources by name because global brings in many
        const uniqueSources = [];
        const seenNames = new Set();

        for (const source of sourcesRes.data) {
            if (!seenNames.has(source.name)) {
                seenNames.add(source.name);
                uniqueSources.push(source);
            }
        }

        return uniqueSources;

    } catch (error) {
        console.error('Watchmode Error:', error.message);
        // Returning empty array so UI handles "Not Available" gracefullly
        return [];
    }
};

module.exports = { getStreamingSources };
