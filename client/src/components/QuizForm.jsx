import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const GENRES = [
    { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' }, { id: 18, name: 'Drama' }
];

const ERAS = [
    { id: 'any', name: 'Any Era' },
    { id: 'modern', name: 'Modern (2000-2015)' },
    { id: 'new_age', name: 'New Age (2016+)' },
    { id: 'classic', name: 'Classic (<1980)' },
    { id: 'retro', name: 'Retro (1980-1999)' }
];

const RUNTIMES = [
    { id: 'any', name: 'Any Time' },
    { id: 'short', name: '< 90 mins' },
    { id: 'medium', name: '90 - 120 mins' },
    { id: 'long', name: '> 2 hours' }
];

const QuizForm = ({ customSubmit }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [filters, setFilters] = useState({
        genres: [],
        runtime: [],
        era: [],
        talent: ''
    });

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleGenre = (id) => {
        setFilters(prev => {
            const genres = prev.genres.includes(id)
                ? prev.genres.filter(g => g !== id)
                : [...prev.genres, id];
            return { ...prev, genres };
        });
    };

    const handleSubmit = () => {
        if (customSubmit) {
            customSubmit(filters);
        } else {
            navigate('/results', { state: { filters } });
        }
    };

    return (
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors">
            {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Choose your vibe</h2>
                    <div className="flex flex-wrap gap-5 mb-10">
                        {GENRES.map(g => (
                            <button
                                key={g.id}
                                onClick={() => toggleGenre(g.id)}
                                className={`px-6 py-3 text-lg rounded-full border transition ${filters.genres.includes(g.id)
                                    ? 'bg-red-600 border-red-600 text-white shadow-md'
                                    : 'bg-gray-50 dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500'
                                    }`}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setStep(2)}
                        disabled={filters.genres.length === 0}
                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-4 text-xl rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                        Next
                    </button>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">How much time? (Select multiple)</h2>
                    <div className="flex flex-wrap gap-5 mb-10">
                        {RUNTIMES.map(r => (
                            <button
                                key={r.id}
                                onClick={() => {
                                    setFilters(prev => {
                                        const current = Array.isArray(prev.runtime) ? prev.runtime : [];
                                        let runtime;
                                        if (r.id === 'any') {
                                            runtime = ['any'];
                                        } else {
                                            runtime = current.includes(r.id)
                                                ? current.filter(item => item !== r.id)
                                                : [...current.filter(item => item !== 'any'), r.id];
                                        }
                                        return { ...prev, runtime };
                                    });
                                }}
                                className={`px-6 py-3 rounded-xl border text-lg transition ${(Array.isArray(filters.runtime) && filters.runtime.includes(r.id))
                                    ? 'bg-red-600 border-red-600 text-white shadow-md'
                                    : 'bg-gray-50 dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500'
                                    }`}
                            >
                                {r.name}
                            </button>
                        ))}
                    </div>

                    <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Which Era? (Select multiple)</h2>
                    <div className="flex flex-wrap gap-5 mb-10">
                        {ERAS.map(e => (
                            <button
                                key={e.id}
                                onClick={() => {
                                    setFilters(prev => {
                                        const current = Array.isArray(prev.era) ? prev.era : [];
                                        let era;
                                        if (e.id === 'any') {
                                            era = ['any'];
                                        } else {
                                            era = current.includes(e.id)
                                                ? current.filter(item => item !== e.id)
                                                : [...current.filter(item => item !== 'any'), e.id];
                                        }
                                        return { ...prev, era };
                                    });
                                }}
                                className={`px-6 py-3 rounded-xl border text-lg transition ${(Array.isArray(filters.era) && filters.era.includes(e.id))
                                    ? 'bg-red-600 border-red-600 text-white shadow-md'
                                    : 'bg-gray-50 dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500'
                                    }`}
                            >
                                {e.name}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setStep(3)}
                        disabled={
                            (!filters.runtime || filters.runtime.length === 0) ||
                            (!filters.era || filters.era.length === 0)
                        }
                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-4 text-xl rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                        Next
                    </button>
                    <button onClick={() => setStep(1)} className="w-full mt-4 text-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Back</button>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Any specific star? (Optional)</h2>
                    <input
                        type="text"
                        placeholder="e.g. Leonardo DiCaprio"
                        className="w-full p-6 text-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white mb-10 focus:outline-none focus:border-red-500 transition-colors"
                        onChange={(e) => updateFilter('talent', e.target.value)}
                    />

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-5 rounded-2xl font-bold text-2xl hover:opacity-90 shadow-lg shadow-red-500/30 transition-all transform hover:scale-[1.02]"
                    >
                        Find Movies
                    </button>
                    <button onClick={() => setStep(2)} className="w-full mt-6 text-xl text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Back</button>
                </motion.div>
            )}
        </div>
    );
};

export default QuizForm;
