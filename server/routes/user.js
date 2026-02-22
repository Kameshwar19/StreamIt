const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Simple Login/Register for MVP (No Auth Middleware, just username lookup)
router.post('/login', async (req, res) => {
    try {
        const { username } = req.body;
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username, password: 'password' }); // Default password for MVP
            await user.save();
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /api/user/:username
router.get('/:username', async (req, res) => {
    try {
        let user = await User.findOne({ username: req.params.username });
        if (!user) {
            if (req.params.username === 'Watcher') {
                user = new User({ username: 'Watcher', password: 'password' });
                await user.save();
                return res.json(user);
            }
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Fetch failed' });
    }
});

// POST /api/user/action
router.post('/action', async (req, res) => {
    try {
        const { username, movieId, type, action } = req.body;
        // type: 'favorites', 'watchlist', 'watched'
        // action: 'add', 'remove'

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (action === 'add') {
            if (!user[type].includes(movieId)) {
                user[type].push(movieId);
                // If adding to 'watched', update stats
                if (type === 'watched') {
                    user.stats.totalWatched += 1;
                    // Streak logic (simplified for MVP)
                    const today = new Date();
                    user.stats.streak.lastWachedDate = today;
                    // TODO: Calculate actual steak based on dates
                }
            }
        } else if (action === 'remove') {
            user[type] = user[type].filter(id => String(id) !== String(movieId));
        }

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('User Action Error:', error);
        res.status(500).json({ error: 'Action failed' });
    }
});

module.exports = router;
