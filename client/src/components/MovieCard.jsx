import { useState } from 'react';
import { Eye, Heart, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const MovieCard = ({ movie, onSelect, onWatched }) => {
    const [clickedActions, setClickedActions] = useState({
        watched: false,
        favorites: false,
        watchlist: false
    });

    const handleAction = async (e, type) => {
        e.stopPropagation();

        // Optimistic UI update
        setClickedActions(prev => ({ ...prev, [type]: true }));

        try {
            await api.post('/user/action', {
                username: 'Watcher', // Updated from demo
                movieId: movie.id,
                type: type,
                action: 'add'
            });

            if (type === 'watched') {
                // Short delay to show the green button before the card animates away
                setTimeout(() => {
                    if (onWatched) onWatched(movie.id);
                }, 300);
            }
        } catch (error) {
            console.error('Action failed', error);
            // Revert on failure
            setClickedActions(prev => ({ ...prev, [type]: false }));
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
            whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
            className="relative group bg-gray-800 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-red-900/40 transition-shadow duration-300 w-full aspect-[2/3] mx-auto"
            onClick={() => onSelect(movie)}
        >
            <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{movie.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{movie.overview}</p>

                <div className="flex justify-around pt-4 border-t border-gray-700/50 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        animate={clickedActions.watched ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => handleAction(e, 'watched')}
                        className={`p-3 bg-gray-700/80 backdrop-blur-sm rounded-full transition-colors ${clickedActions.watched ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`}
                        title="Watched"
                    >
                        <Eye size={20} />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        animate={clickedActions.favorites ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => handleAction(e, 'favorites')}
                        className={`p-3 bg-gray-700/80 backdrop-blur-sm rounded-full transition-colors ${clickedActions.favorites ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
                        title="Like"
                    >
                        <Heart size={20} fill={clickedActions.favorites ? "currentColor" : "none"} />
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        animate={clickedActions.watchlist ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => handleAction(e, 'watchlist')}
                        className={`p-3 bg-gray-700/80 backdrop-blur-sm rounded-full transition-colors ${clickedActions.watchlist ? 'text-blue-500' : 'text-gray-300 hover:text-blue-400'}`}
                        title="Watch Later"
                    >
                        <Clock size={20} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
