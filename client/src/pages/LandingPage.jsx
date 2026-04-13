import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';

// Verified, active list of iconic cult classic movie backdrops from TMDB
const TMDB_BASE = 'https://image.tmdb.org/t/p/w500';
const CULT_BACKDROPS = [
    '/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg', '/tSPT36ZKlP2WVHJLM4cQPLSzv3b.jpg',
    '/kGzFbGhp99zva6oZODW5atUtnqi.jpg', '/b6HWTOxn1xevvyHU2K9ICvaRU6g.jpg',
    '/gILte6Zd7m1YneIr6MVhh30S9pr.jpg', '/uvitbjFU4JqvMwIkMWHp69bmUzG.jpg',
    '/aYcnDyLMnpKce1FOYUpZrXtgUye.jpg', '/jRJrQ72VLyEnVsvwfep8Xjlvu8c.jpg',
    '/hy0Hx9fMPk2fmw26Li60z1S2giU.jpg', '/6WRrGYalXXveItfpnipYdayFkQB.jpg',
    '/1qM2BYNE11Viby8ImC9LC00DgDr.jpg', '/9uddYYTNcLWpzUkl5iw1RUYhLhY.jpg',
    '/hO7KbdvGOtDdeg0W4Y5nKEHeDDh.jpg', '/n1ItmvzsDV5yLgDodSCLZpFlsP6.jpg',
    '/bioYaOXZS2nXLiLVf5mDOgXpCd8.jpg', '/7Nwnmyzrtd0FkcRyPqmdzTPppQa.jpg',
    '/7tZt3PA948fvSTFx0699YF44Tdt.jpg', '/ggC3Brchf4RqPitEh7cROFoeAWn.jpg',
    '/wUc83y8kXNdRK66o0HU5X8eBri4.jpg', '/5JaR6UEoCJJLtLpqFOVMY4O4R7P.jpg',
    '/747dgDfL5d8esobk7h4odaOFhUq.jpg', '/y2DB71C4nyIdMrANijz8mzvQtk6.jpg',
    '/9IIBboV7MCT0bTxzXHmWK1Hq558.jpg', '/bdI6U1mT0kCdTJ6TWtiFxQ42GSn.jpg',
    '/iymDDg4upZWgpbSeiE1JCjsSPBs.jpg', '/alWtP7JwoanQyqXzg3PCbEFrfwS.jpg',
    '/IQyEvPTYvrzsa7qstRj6VLQupr.jpg'
].map(path => `${TMDB_BASE}${path}`);

const LandingPage = () => {
    const [wallImages, setWallImages] = useState([]);

    useEffect(() => {
        // Shuffle the array so images never repeat and layout feels fresh
        // Using exactly the length of unique backdrops we have (27)
        const shuffled = [...CULT_BACKDROPS].sort(() => 0.5 - Math.random());
        setWallImages(shuffled);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-white dark:bg-black transition-colors">
            {/* Background Collage Wall */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }} // Increased visibility
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
            >
                {/* 27 images grid fitting roughly what's visible */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3 lg:gap-4 transform -rotate-12 scale-150 -translate-y-[10%] opacity-100 pointer-events-none">
                    {wallImages.map((src, idx) => (
                        <div key={idx} className="relative aspect-video rounded-md flex-shrink-0 bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-xl overflow-hidden shadow-gray-200/50 dark:shadow-black/50 transition-colors">
                            <img src={src} alt="Cult Backdrop" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Gradient Overlay (Slightly lighter to let more image pop) */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95 dark:from-black/60 dark:via-black/40 dark:to-black/80 transition-colors"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-6 drop-shadow-lg"
                >
                    StreamIt
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl mb-10 font-light transition-colors"
                >
                    The ultimate decision killer. Find your perfect movie in seconds, not hours.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link
                        to="/selection"
                        className="group relative inline-flex items-center space-x-3 px-8 py-4 bg-red-600 rounded-full text-white text-lg font-bold overflow-hidden transition-transform hover:scale-105 shadow-red-600/50 shadow-lg"
                    >
                        <span className="relative z-10">Start Decision Engine</span>
                        <Play size={20} fill="currentColor" className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
