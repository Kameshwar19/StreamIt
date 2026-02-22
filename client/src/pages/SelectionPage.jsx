import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import QuizForm from '../components/QuizForm';
import MovieCard from '../components/MovieCard';
import { Loader2 } from 'lucide-react';

const SelectionPage = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState(() => JSON.parse(sessionStorage.getItem('streamit_movies')) || []);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(() => JSON.parse(sessionStorage.getItem('streamit_showResults')) || false);
    const [index, setIndex] = useState(() => parseInt(sessionStorage.getItem('streamit_index')) || 0);

    useEffect(() => {
        sessionStorage.setItem('streamit_movies', JSON.stringify(movies));
        sessionStorage.setItem('streamit_showResults', JSON.stringify(showResults));
        sessionStorage.setItem('streamit_index', index.toString());
    }, [movies, showResults, index]);

    const handleSearch = async (filters) => {
        setLoading(true);
        setShowResults(true);
        try {
            const userRes = await api.get('/user/demo');
            const watchedIds = userRes.data.watched || [];
            const response = await api.post('/movies/search', filters);
            const filteredMovies = response.data.filter(m => !watchedIds.includes(String(m.id)));
            setMovies(filteredMovies);
            setIndex(0);
        } catch (error) {
            console.error('Fetch error', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setIndex(prev => prev + 3);
    };

    const visibleMovies = movies.slice(index, index + 3);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen py-4 px-4 overflow-hidden">
            {!showResults ? (
                <div className="w-full max-w-2xl flex flex-col items-center justify-center flex-grow">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 drop-shadow-sm"
                    >
                        Define Your Vibe
                    </motion.h1>
                    <QuizForm customSubmit={handleSearch} />
                </div>
            ) : (
                <div className="w-full flex flex-col items-center max-w-7xl">
                    <button
                        onClick={() => setShowResults(false)}
                        className="self-start mb-8 text-gray-400 hover:text-white transition flex items-center space-x-2"
                    >
                        <span>← Change Preferences</span>
                    </button>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Loader2 size={48} className="animate-spin text-red-600 mb-4" />
                            <p className="text-xl text-gray-400 animate-pulse">Scanning the multiverse...</p>
                        </div>
                    ) : (
                        <>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl mx-auto px-4"
                            >
                                <AnimatePresence mode="popLayout">
                                    {visibleMovies.map(movie => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            onSelect={(m) => navigate(`/movie/${m.id}`)}
                                            onWatched={(id) => setMovies(prev => prev.filter(m => m.id !== id))}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            {visibleMovies.length === 0 && (
                                <div className="text-xl text-gray-400 mt-10 text-center">
                                    <p>No movies matched your specific vibe.</p>
                                    <button onClick={() => setShowResults(false)} className="mt-4 text-red-500 hover:underline">Try broader filters</button>
                                </div>
                            )}

                            {movies.length > index + 3 && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleNext}
                                    className="mt-6 px-10 py-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full border border-gray-600 hover:border-gray-500 text-white font-bold shadow-lg transition-all"
                                >
                                    Show Next 3 Suggestions
                                </motion.button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectionPage;
