import { useEffect, useState } from 'react';
import { toPng } from 'html-to-image';
import { Share2, Flame, Eye, Film, Heart, Clock, Edit2, Check } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import MovieListModal from '../components/MovieListModal';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalIds, setModalIds] = useState([]);
    const [modalType, setModalType] = useState(''); // 'watched', 'favorites', 'watchlist'
    const [displayName, setDisplayName] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);

    const username = 'Watcher';

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Initialize/login user
                await api.post('/user/login', { username });
                // Fetch full profile
                const res = await api.get(`/user/${username}`);
                setUser(res.data);
                // Initialize display name with full username or "Chris" if they prefer, defaults to their actual username
                setDisplayName(res.data.username);
            } catch (error) {
                console.error('Profile fetch error', error);
            }
        };
        fetchUser();
    }, []);

    const handleShare = async () => {
        const element = document.getElementById('share-card');
        if (!element) return;
        try {
            const dataUrl = await toPng(element, {
                backgroundColor: '#161a1f',
                pixelRatio: 2,
                width: 800,
                height: 1000
            });
            const link = document.createElement('a');
            link.download = `streamit-${username}-stats.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Share failed', error);
        }
    };

    const handleOpenModal = (title, type, ids) => {
        setModalTitle(title);
        setModalType(type);
        setModalIds(ids || []);
        setIsModalOpen(true);
    };

    const handleRemoveItem = async (movieId) => {
        try {
            // Optimistic update modal state
            setModalIds(prev => prev.filter(id => id !== movieId));

            // Optimistic update profile state so stats change instantly
            setUser(prev => {
                const newUser = { ...prev };
                if (newUser[modalType]) {
                    newUser[modalType] = [...newUser[modalType].filter(id => String(id) !== String(movieId))];
                }
                if (modalType === 'watched') {
                    newUser.stats.totalWatched = Math.max(0, newUser.stats.totalWatched - 1);
                }
                return newUser;
            });

            // API Call
            await api.post('/user/action', {
                username,
                movieId,
                type: modalType,
                action: 'remove'
            });

        } catch (error) {
            console.error('Failed to remove item', error);
            // On failure we should ideally revert, omitting for MVP speed.
        }
    };

    if (!user) return <div className="flex h-screen items-center justify-center text-xl text-gray-500">Loading profile...</div>;

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        Welcome back,
                        {isEditingName ? (
                            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-2 py-1">
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="bg-transparent text-white outline-none w-32 border-b border-gray-600 focus:border-red-500 transition-colors"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                                />
                                <button onClick={() => setIsEditingName(false)} className="text-green-400 hover:text-green-300 transition-colors cursor-pointer">
                                    <Check size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 group">
                                <span className="border-b border-transparent group-hover:border-gray-500 transition-colors cursor-pointer" onClick={() => setIsEditingName(true)}>
                                    {displayName}
                                </span>
                                <button onClick={() => setIsEditingName(true)} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white cursor-pointer" title="Edit Display Name">
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        )}
                    </h1>
                    <p className="text-gray-400">Here's your streaming breakdown.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 rounded-full text-white font-bold shadow-lg shadow-red-900/30 hover:shadow-red-900/50 transition-all"
                >
                    <Share2 size={18} />
                    <span>Share Stats</span>
                </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={() => handleOpenModal('Movies Watched', 'watched', user.watched)}
                    className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 flex items-center space-x-6 hover:bg-gray-800 hover:border-gray-500 transition-all cursor-pointer group"
                >
                    <div className="p-5 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                        <Eye size={40} />
                    </div>
                    <div>
                        <div className="text-5xl font-bold text-white mb-1">{user.stats?.totalWatched || 0}</div>
                        <div className="text-gray-400 font-medium group-hover:text-blue-300 transition-colors">Movies Watched</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 flex items-center space-x-6 hover:bg-gray-800 transition-colors"
                >
                    <div className="p-5 bg-orange-500/10 rounded-2xl text-orange-500">
                        <Flame size={40} />
                    </div>
                    <div>
                        <div className="text-5xl font-bold text-white mb-1">{user.stats?.streak?.current || 0}</div>
                        <div className="text-gray-400 font-medium">Day Streak</div>
                    </div>
                </motion.div>
            </div>

            {/* Hidden Share Card */}
            <div className="absolute -left-[9999px]">
                <div
                    id="share-card"
                    className="w-[800px] h-[1000px] bg-[#161a1f] p-12 flex flex-col items-center relative overflow-hidden"
                >
                    {/* Background Grid Lines (Removed complex gradients for html2canvas compatibility) */}
                    <div className="absolute inset-0 border border-gray-800/30 opacity-20 hidden"></div>

                    {/* Equalizer Waves Simulation */}
                    <div className="absolute top-10 left-0 right-0 flex justify-center space-x-3 opacity-90 h-64 items-end z-0">
                        {/* Left Side */}
                        <div className="w-2 h-40 bg-[#d17a3f] rounded-t-full"></div>
                        <div className="w-2 h-20 bg-[#549a37] rounded-t-full"></div>
                        <div className="w-2 h-56 bg-[#4c8dc6] rounded-t-full mb-10"></div>
                        <div className="w-2 h-32 bg-[#549a37] rounded-t-full"></div>
                        <div className="w-2 h-40 bg-[#4c8dc6] rounded-t-full"></div>
                        <div className="w-2 h-48 bg-[#d17a3f] rounded-t-full mb-4"></div>
                        <div className="w-2 h-32 bg-[#4c8dc6] rounded-t-full"></div>
                        {/* Center Gap for Text */}
                        <div className="w-64"></div>
                        {/* Right Side */}
                        <div className="w-2 h-40 bg-[#4c8dc6] rounded-t-full"></div>
                        <div className="w-2 h-56 bg-[#549a37] rounded-t-full mb-6"></div>
                        <div className="w-2 h-32 bg-[#d17a3f] rounded-t-full"></div>
                        <div className="w-2 h-64 bg-[#4c8dc6] rounded-t-full"></div>
                        <div className="w-2 h-20 bg-[#d17a3f] rounded-t-full mt-10"></div>
                        <div className="w-2 h-40 bg-[#549a37] rounded-t-full"></div>
                    </div>

                    {/* Header Section */}
                    <div className="relative z-10 text-center mt-20 mb-16">
                        <h1 className="text-white font-serif font-black leading-tight text-[110px] tracking-tight mb-8">
                            A Life<br />in Film
                        </h1>
                        <div className="flex items-center justify-center space-x-3">
                            <div className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-gray-600">
                                <span className="text-white font-bold">{displayName.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="text-gray-400 text-2xl font-sans tracking-wide">{displayName}&apos;s all-time stats</span>
                        </div>
                    </div>

                    {/* 2x3 Grid Section */}
                    <div className="relative z-10 w-full grid grid-cols-2 gap-y-16 mt-8">
                        {/* Row 1 */}
                        <div className="flex flex-col items-center border-r border-white/5">
                            <span className="text-white font-serif font-black text-6xl mb-3">{(user.stats?.totalWatched || 0).toLocaleString()}</span>
                            <span className="text-gray-400 font-sans text-sm uppercase tracking-[0.2em]">Films</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-white font-serif font-black text-6xl mb-3">{((user.stats?.totalWatched || 0) * 1.8).toFixed(0).toLocaleString()}</span>
                            <span className="text-gray-400 font-sans text-sm uppercase tracking-[0.2em]">Hours (Est.)</span>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col items-center border-r border-t border-white/5 pt-16">
                            <span className="text-white font-serif font-black text-6xl mb-3">{(user.favorites?.length || 0).toLocaleString()}</span>
                            <span className="text-gray-400 font-sans text-sm uppercase tracking-[0.2em]">Favorites</span>
                        </div>
                        <div className="flex flex-col items-center border-t border-white/5 pt-16">
                            <span className="text-white font-serif font-black text-6xl mb-3">{(user.watchlist?.length || 0).toLocaleString()}</span>
                            <span className="text-gray-400 font-sans text-sm uppercase tracking-[0.2em]">Watchlist</span>
                        </div>

                        {/* Row 3 */}
                        <div className="flex flex-col items-center border-r border-t border-white/5 pt-16">
                            <span className="text-white font-serif font-black text-6xl mb-3">{user.stats?.streak?.longest || 0}d</span>
                            <span className="text-gray-400 font-sans text-sm uppercase tracking-[0.2em]">Longest Streak</span>
                        </div>
                        <div className="flex flex-col items-center border-t border-white/5 pt-16">
                            <span className="text-white font-serif font-black text-6xl mb-3">{user.stats?.streak?.current || 0}d</span>
                            <span className="text-gray-400 font-sans text-sm uppercase tracking-[0.2em]">Current Streak</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Libraries */}
            <h2 className="text-2xl font-bold text-white mb-6">Your Libraries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    onClick={() => handleOpenModal('History', 'watched', user.watched)}
                    className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/60 transition group cursor-pointer"
                >
                    <div className="flex items-center space-x-3 mb-4 text-gray-300 group-hover:text-white transition-colors">
                        <Film size={20} />
                        <span className="font-bold">History</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{user.watched?.length || 0}</div>
                    <div className="text-sm text-gray-500 mt-1">Titles</div>
                </div>

                <div
                    onClick={() => handleOpenModal('Favorites', 'favorites', user.favorites)}
                    className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/60 transition group cursor-pointer"
                >
                    <div className="flex items-center space-x-3 mb-4 text-gray-300 group-hover:text-red-400 transition-colors">
                        <Heart size={20} />
                        <span className="font-bold">Favorites</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{user.favorites?.length || 0}</div>
                    <div className="text-sm text-gray-500 mt-1">Titles</div>
                </div>

                <div
                    onClick={() => handleOpenModal('Watchlist', 'watchlist', user.watchlist)}
                    className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/60 transition group cursor-pointer"
                >
                    <div className="flex items-center space-x-3 mb-4 text-gray-300 group-hover:text-blue-400 transition-colors">
                        <Clock size={20} />
                        <span className="font-bold">Watchlist</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{user.watchlist?.length || 0}</div>
                    <div className="text-sm text-gray-500 mt-1">Titles</div>
                </div>
            </div>

            <MovieListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
                movieIds={modalIds}
                listType={modalType}
                onRemove={handleRemoveItem}
            />
        </div>
    );
};

export default Profile;
