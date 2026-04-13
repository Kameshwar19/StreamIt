import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import MovieCard from '../components/MovieCard';
import DetailsModal from '../components/DetailsModal';

const ResultsPage = () => {
    const location = useLocation();
    const filters = location.state?.filters;

    const [movies, setMovies] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!filters) return;
            setLoading(true);
            setError(null);
            try {
                const response = await api.post('/movies/search', filters);
                setMovies(response.data);
            } catch (err) {
                console.error('Fetch error', err);
                setError(`Failed to fetch movies: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, [filters]);

    const handleNext = () => {
        setIndex(prev => prev + 3);
    };

    const visibleMovies = movies.slice(index, index + 3);

    if (loading) return <div className="text-center mt-20 text-2xl animate-pulse">Scanning the multiverse...</div>;

    if (error) return (
        <div className="text-center mt-20">
            <div className="text-2xl text-red-500 font-bold mb-4">Error</div>
            <p className="text-gray-300">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-gray-700 rounded-full">Retry</button>
        </div>
    );

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8">Top Picks for You</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {visibleMovies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} onSelect={setSelectedMovie} />
                ))}
            </div>

            {visibleMovies.length === 0 && (
                <div className="text-gray-400 text-xl">No movies found. Try different filters.</div>
            )}

            {movies.length > index + 3 && (
                <button
                    onClick={handleNext}
                    className="mt-10 px-8 py-3 bg-gray-800 rounded-full border border-gray-600 hover:bg-gray-700 transition"
                >
                    Show Next 3
                </button>
            )}

            {selectedMovie && (
                <DetailsModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
};

export default ResultsPage;
