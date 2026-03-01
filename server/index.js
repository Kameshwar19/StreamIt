const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

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
