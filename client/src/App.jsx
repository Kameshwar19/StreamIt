import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RegionProvider } from './context/RegionContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SelectionPage from './pages/SelectionPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider>
      <RegionProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gray-900 dark:bg-none text-gray-900 dark:text-white font-sans transition-colors duration-300">
            <Navbar />

            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/selection" element={<SelectionPage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </RegionProvider>
    </ThemeProvider>
  );
}

export default App;
