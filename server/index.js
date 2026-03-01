const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
// Custom JSON Body Parser to bypass Vercel 'iconv-lite' encoding crash
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
            try {
                if (data) req.body = JSON.parse(data);
                else req.body = {};
                next();
            } catch (e) {
                console.error("Manual JSON Parse Error:", e);
                res.status(400).json({ error: "Invalid JSON body" });
            }
        });
    } else {
        next();
    }
});
// Database Connection
// Database Connection
console.log('Connecting to MongoDB at:', process.env.MONGO_URI ? process.env.MONGO_URI.replace(/\/\/.*@/, '//***@') : 'UNDEFINED');

if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.error('MongoDB Connection Error:', err));
} else {
    console.warn("MongoDB connection skipped due to missing MONGO_URI variable.");
}

// Routes
app.get('/', (req, res) => {
    res.send('StreamIt API is running');
});

// Import Routes (To be added)
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/user');
app.use('/api/movies', movieRoutes);
app.use('/api/user', userRoutes);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
