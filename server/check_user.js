const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ username: 'demo' });
        if (user) {
            console.log(`User: ${user.username}`);
            console.log(`Watched Count: ${user.watched ? user.watched.length : 0}`);
            if (user.watched && user.watched.length > 0) {
                console.log(`First 5 Watched IDs: ${user.watched.slice(0, 5)}`);
            }
        } else {
            console.log('User demo not found');
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await mongoose.disconnect();
    }
}

checkUser();
