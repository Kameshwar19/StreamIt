import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Star, Calendar, Eye } from 'lucide-react';
import { useRegion } from '../context/RegionContext';
import { getMovieDetails } from '../api/tmdb';
import { addToList } from './Profile';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { region } = useRegion();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWatched, setIsWatched] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getMovieDetails(id);
                setMovie(data);
            } catch (error) {
                console.error('Failed to fetch details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="flex h-screen items-center justify-center text-2xl">Loading...</div>;
    if (!movie) return <div className="flex h-screen items-center justify-center text-2xl">Movie not found</div>;

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">
            {/* Hero Backdrop */}
            <div className="relative h-[60vh] w-full">
                {backdropUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${backdropUrl})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-gray-50/40 dark:via-gray-900/40 to-transparent transition-colors"></div>
                    </div>
                )}

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-20 flex items-center space-x-2 bg-black/50 px-4 py-2 rounded-full hover:bg-white/20 transition backdrop-blur-sm text-white"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-5xl">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-xl">{movie.title}</h1>
                    <div className="flex items-center space-x-6 text-gray-200 text-lg">
                        <span className="flex items-center space-x-1">
                            <Calendar size={18} />
                            <span>{movie.release_date?.split('-')[0]}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-yellow-400">
                            <Star size={18} fill="currentColor" />
                            <span>{movie.vote_average?.toFixed(1)}</span>
                        </span>
                        {movie.runtime && <span>{movie.runtime} min</span>}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">

                    {/* Synopsis & Info */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">Synopsis</h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-10 transition-colors">
                            {movie.overview}
                        </p>

                        {movie.genres && (
                            <div className="flex flex-wrap gap-2 mb-10">
                                {movie.genres.map(g => (
                                    <span key={g.id} className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 transition-colors">
                                        {g.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Streaming Options */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl h-fit border border-gray-200 dark:border-gray-700 shadow-xl flex flex-col space-y-6 transition-colors">
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors">
                                Available On
                            </h3>

                            <div className="flex flex-col space-y-3">
                                {movie.streaming_sources?.length > 0 ? (
                                    movie.streaming_sources.map((source, idx) => (
                                        <a
                                            key={idx}
                                            href={source.web_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center justify-center space-x-3 px-4 py-4 rounded-xl font-bold transition ${source.type === 'sub'
                                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20'
                                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200'
                                                }`}
                                        >
                                            <Play size={20} fill="currentColor" />
                                            <span>{source.name}</span>
                                        </a>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="mb-2">No streaming options found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Already Watched Button */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
                            <button
                                onClick={() => {
                                    if (isWatched) return;
                                    addToList('watched', movie.id);
                                    setIsWatched(true);
                                }}
                                className={`w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-xl font-bold transition-all ${isWatched
                                    ? 'bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-500 border border-green-500'
                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-green-500 dark:hover:bg-green-600 hover:text-white text-gray-900 dark:text-gray-200'
                                    }`}
                            >
                                <span>{isWatched ? 'Watched' : 'Mark as Watched'}</span>
                                <Eye size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
