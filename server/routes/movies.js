const express = require('express');
const router = express.Router();
const tmdbService = require('../services/tmdb');
const watchmodeService = require('../services/watchmode');
const fs = require('fs');

// POST /api/movies/search - Filter Funnel
router.post('/search', async (req, res) => {
    try {
        const filters = req.body; // { genres, runtime, era, talent }
        console.log('Search Filters:', filters);

        try {
            fs.appendFileSync('server_debug.log', `${new Date().toISOString()} - Route /search hit with: ${JSON.stringify(filters)}\n`);
        } catch (e) {
            console.error("Route logging failed", e);
        }

        // Fetch from TMDB
        const results = await tmdbService.getDiscoverMovies(filters);

        // We return the raw results. Client handles the "Top 3" slicing and "Show Next 3" pagination.
        // This avoids complex server-side session caching for the MVP.
        res.json(results);
    } catch (error) {
        console.error('Search Route Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// GET /api/movies/:id - Details & Streaming
router.get('/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const region = req.query.region || 'IN';

        // Parallel fetch for speed
        const [details, streaming] = await Promise.all([
            tmdbService.getMovieDetails(movieId),
            watchmodeService.getStreamingSources(movieId, region)
        ]);

        res.json({
            ...details,
            streaming_sources: streaming
        });
    } catch (error) {
        console.error('Details Route Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
});

module.exports = router;
