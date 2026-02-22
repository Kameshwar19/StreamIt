const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    // Adding password for completeness, though auth wasn't explicitly detailed in prompt, it's safer to have.
    // For MVP, we might skip full auth implementation if not requested, but schema should support users.
    // Given the prompt implies saving data for a user, an ID or simple auth is needed.
    // I'll add a simple 'deviceId' or 'userId' for now if auth is too complex for MVP step 1.
    // But standard is username/password.
    password: {
        type: String,
        required: true
    },
    region: {
        type: String,
        default: 'IN'
    },
    favorites: [{
        type: String // Storing Movie IDs
    }],
    watchlist: [{
        type: String // Storing Movie IDs
    }],
    watched: [{
        type: String // Storing Movie IDs
    }],
    stats: {
        totalWatched: {
            type: Number,
            default: 0
        },
        streak: {
            current: { type: Number, default: 0 },
            longest: { type: Number, default: 0 },
            lastWachedDate: { type: Date }
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
