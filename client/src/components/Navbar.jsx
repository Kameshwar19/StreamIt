import { Link } from 'react-router-dom';
import { useRegion } from '../context/RegionContext';
import { useTheme } from '../context/ThemeContext';
import { Globe, Sun, Moon, Search, UserCircle } from 'lucide-react';

const Navbar = () => {
    const { region, toggleRegion } = useRegion();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md transition-colors duration-300 sticky top-0 z-50">
            <Link to="/" className="text-2xl font-bold text-red-600 tracking-wider">StreamIt</Link>

            <div className="flex items-center space-x-6">


                <div className="flex items-center space-x-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button
                        onClick={toggleRegion}
                        className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        <Globe size={18} />
                        <span className="font-medium">{region}</span>
                    </button>

                    <Link
                        to="/profile"
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-red-500 transition"
                        title="Profile"
                    >
                        <UserCircle size={24} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
