const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const tmdbService = require('./tmdb');

async function testLogging() {
    console.log("Testing logging...");
    try {
        await tmdbService.getDiscoverMovies({ genres: [], runtime: [], era: [], talent: '' });
        console.log("Service call complete. Check server_debug.log");
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testLogging();
