import { useEffect, useState } from 'react';
import { X, Play } from 'lucide-react';
import { useRegion } from '../context/RegionContext';
import api from '../api/axios';

const DetailsModal = ({ movie, onClose }) => {
    const { region } = useRegion();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/movies/${movie.id}?region=${region}`);
                setDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [movie.id, region]);

    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full hover:bg-white/20 transition"
                >
                    <X size={24} />
                </button>

                <div className="relative h-[400px]">
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-8">
                        <h2 className="text-4xl font-bold">{movie.title}</h2>
                        <p className="text-gray-300 mt-2">{movie.release_date?.split('-')[0]} • {movie.vote_average?.toFixed(1)}/10</p>
                    </div>
                </div>

                <div className="p-8">
                    <p className="text-lg text-gray-300 leading-relaxed mb-8">
                        {movie.overview}
                    </p>

                    <h3 className="text-xl font-bold mb-4">Where to Watch ({region})</h3>
                    {loading ? (
                        <div className="animate-pulse h-10 bg-gray-800 rounded w-1/3"></div>
                    ) : (
                        <div className="flex flex-wrap gap-4">
                            {details?.streaming_sources?.length > 0 ? (
                                details.streaming_sources.map((source, idx) => (
                                    <a
                                        key={idx}
                                        href={source.web_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition ${source.type === 'sub'
                                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                                : 'border border-gray-600 hover:bg-gray-800 text-gray-300'
                                            }`}
                                    >
                                        <Play size={18} fill="currentColor" />
                                        <span>Watch on {source.name}</span>
                                    </a>
                                ))
                            ) : (
                                <div className="text-gray-500 italic">
                                    Not currently streaming in {region}. Try checking other regions or rent/buy options.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsModal;
