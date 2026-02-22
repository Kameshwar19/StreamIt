const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const tmdbService = require('./tmdb');

async function test() {
    console.log("Starting TMDB Logic Tests...\n");
    console.log("API Key present:", !!process.env.TMDB_API_KEY);
    if (process.env.TMDB_API_KEY) {
        console.log("API Key start:", process.env.TMDB_API_KEY.substring(0, 4));
    }

    const scenarios = [
        {
            name: "Scenario 1: Action Genre (Classic)",
            filters: { genres: [28], runtime: [], era: ['classic'], talent: '' }
        },
        {
            name: "Scenario 2: Classic + Modern (Overlap Test)",
            filters: { genres: [28], runtime: [], era: ['classic', 'modern'], talent: '' }
        },
        {
            name: "Scenario 3: Short + Long Runtime",
            filters: { genres: [35], runtime: ['short', 'long'], era: [], talent: '' }
        },
        {
            name: "Scenario 4: Specific Talent (Brad Pitt)",
            filters: { genres: [], runtime: [], era: [], talent: 'Brad Pitt' }
        },
        {
            name: "Scenario 5: Empty Filters (Should use defaults)",
            filters: { genres: [], runtime: [], era: [], talent: '' }
        }
    ];

    for (const s of scenarios) {
        console.log(`--- ${s.name} ---`);
        try {
            const results = await tmdbService.getDiscoverMovies(s.filters);
            console.log(`Results: ${results.length}`);
            if (results.length > 0) {
                console.log(`First Movie: ${results[0].title} (${results[0].release_date})`);
            }
        } catch (e) {
            console.error("FAILED:", e.message);
        }
        console.log("\n");
    }
}

test();
