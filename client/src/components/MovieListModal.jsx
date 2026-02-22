import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Loader2, Info } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const MovieListModal = ({ isOpen, onClose, title, movieIds, onRemove }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) return;

        const fetchMovies = async () => {
            setLoading(true);
            try {
                // Fetch basic details for every ID in the list
                const fetchedMovies = await Promise.all(
                    movieIds.map(async (id) => {
                        const res = await api.get(`/movies/${id}`);
                        return res.data;
                    })
                );
                // Filter out any errors/nulls
                setMovies(fetchedMovies.filter(Boolean));
            } catch (error) {
                console.error('Error fetching list movies', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [isOpen, movieIds]);

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
                    className="bg-gray-900 border border-gray-700 w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50">
                        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                            <span>{title}</span>
                            <span className="text-sm font-medium bg-gray-800 text-gray-400 px-3 py-1 rounded-full">{movieIds.length}</span>
                        </h2>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                <Loader2 className="animate-spin mb-4" size={32} />
                                <p>Loading titles...</p>
                            </div>
                        ) : movies.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                <Info size={48} className="mb-4 opacity-50" />
                                <p className="text-lg">This list is currently empty.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {movies.map((movie) => (
                                    <motion.div
                                        key={movie.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center justify-between bg-gray-800/50 border border-gray-700 hover:border-gray-500 p-3 rounded-2xl transition group cursor-pointer"
                                        onClick={() => navigate(`/movie/${movie.id}`)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            {movie.poster_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="w-14 h-20 object-cover rounded-xl shadow-md"
                                                />
                                            ) : (
                                                <div className="w-14 h-20 bg-gray-700 rounded-xl flex items-center justify-center text-xs text-gray-500 text-center p-1">No Image</div>
                                            )}

                                            <div>
                                                <h3 className="font-bold text-white text-lg group-hover:text-red-400 transition line-clamp-1">{movie.title}</h3>
                                                <p className="text-sm text-gray-400">{movie.release_date?.substring(0, 4)}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemove(movie.id);
                                            }}
                                            className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition cursor-pointer"
                                            title="Remove from list"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MovieListModal;
