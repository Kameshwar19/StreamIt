import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Loader2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TMDB_KEY = 'c50110df734c533de4401c213b5e4151';

const fetchMovieBasic = async (id) => {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=en-US`);
    if (!res.ok) return null;
    return res.json();
};

const MovieListModal = ({ isOpen, onClose, title, movieIds, onRemove }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen || !movieIds?.length) {
            setMovies([]);
            return;
        }
        let cancelled = false;
        const fetchMovies = async () => {
            setLoading(true);
            try {
                // Batch in chunks of 5 to avoid rate limits
                const results = [];
                const chunks = [];
                for (let i = 0; i < movieIds.length; i += 5) {
                    chunks.push(movieIds.slice(i, i + 5));
                }
                for (const chunk of chunks) {
                    const fetched = await Promise.all(chunk.map(id => fetchMovieBasic(id)));
                    results.push(...fetched.filter(Boolean));
                }
                if (!cancelled) setMovies(results);
            } catch (error) {
                console.error('Error fetching list movies', error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchMovies();
        return () => { cancelled = true; };
    }, [isOpen, movieIds]);

    // Keep movies in sync when IDs are removed
    useEffect(() => {
        if (movieIds) {
            const idSet = new Set(movieIds.map(String));
            setMovies(prev => prev.filter(m => idSet.has(String(m.id))));
        }
    }, [movieIds]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative transition-colors"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 transition-colors">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3 transition-colors">
                            <span>{title}</span>
                            <span className="text-sm font-medium bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 px-3 py-1 rounded-full transition-colors">{movieIds?.length || 0}</span>
                        </h2>
                        <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                <Loader2 className="animate-spin mb-4" size={32} />
                                <p>Loading titles...</p>
                            </div>
                        ) : !movieIds?.length || movies.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                <Info size={48} className="mb-4 opacity-50" />
                                <p className="text-lg">This list is currently empty.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {movies.map((movie) => (
                                        <motion.div
                                            key={movie.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 p-3 rounded-2xl transition group cursor-pointer shadow-sm dark:shadow-none"
                                            onClick={() => { onClose(); navigate(`/movie/${movie.id}`); }}
                                        >
                                            <div className="flex items-center space-x-4">
                                                {movie.poster_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                                        alt={movie.title}
                                                        className="w-14 h-20 object-cover rounded-xl shadow-md"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-xs text-gray-500 text-center p-1 transition-colors">No Image</div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-red-500 dark:group-hover:text-red-400 transition line-clamp-1">{movie.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{movie.release_date?.substring(0, 4)}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onRemove(movie.id); }}
                                                className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition cursor-pointer"
                                                title="Remove from list"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MovieListModal;
