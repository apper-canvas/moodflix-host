import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import MovieCard from '../components/MovieCard';
import MovieDetailModal from '../components/MovieDetailModal';
import { movieService } from '../services';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: ''
  });

  useEffect(() => {
    loadAllMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [searchQuery, filters, allMovies]);

  const loadAllMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await movieService.getAll();
      setAllMovies(result);
      setMovies(result);
    } catch (err) {
      setError(err.message || 'Failed to load movies');
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = [...allMovies];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genres?.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Genre filter
    if (filters.genre) {
      filtered = filtered.filter(movie =>
        movie.genres?.includes(filters.genre)
      );
    }

    // Year filter
    if (filters.year) {
      const selectedYear = parseInt(filters.year);
      filtered = filtered.filter(movie => movie.year === selectedYear);
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(movie => movie.rating >= minRating);
    }

    setMovies(filtered);
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      await movieService.addToWatchlist(movie.id);
      toast.success(`${movie.title} added to watchlist!`);
    } catch (err) {
      toast.error('Failed to add to watchlist');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({ genre: '', year: '', rating: '' });
  };

  // Get unique values for filters
  const genres = [...new Set(allMovies.flatMap(movie => movie.genres || []))].sort();
  const years = [...new Set(allMovies.map(movie => movie.year))].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-surface-700 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-surface-700 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="h-12 bg-surface-700 rounded-lg mb-8 animate-pulse"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-surface-800 rounded-xl p-4 animate-pulse">
              <div className="aspect-[2/3] bg-surface-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-surface-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-surface-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Failed to load movies</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={loadAllMovies}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Search Movies
          </h1>
          <p className="text-gray-400">
            Find movies by title, genre, or description
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            className="w-full pl-12 pr-4 py-4 bg-surface-800 text-white rounded-xl border border-surface-600 focus:border-primary focus:outline-none transition-colors text-lg"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={filters.genre}
            onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
            className="px-4 py-2 bg-surface-800 text-white rounded-lg border border-surface-600 focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            className="px-4 py-2 bg-surface-800 text-white rounded-lg border border-surface-600 focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={filters.rating}
            onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
            className="px-4 py-2 bg-surface-800 text-white rounded-lg border border-surface-600 focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">All Ratings</option>
            <option value="8">8.0+ Stars</option>
            <option value="7">7.0+ Stars</option>
            <option value="6">6.0+ Stars</option>
            <option value="5">5.0+ Stars</option>
          </select>

          {(searchQuery || filters.genre || filters.year || filters.rating) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearFilters}
              className="px-4 py-2 bg-surface-700 text-gray-300 rounded-lg hover:bg-surface-600 transition-colors"
            >
              Clear Filters
            </motion.button>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-400 text-sm">
            {movies.length} movie{movies.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </span>
        </div>

        {movies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ApperIcon name="Search" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No movies found' : 'Start searching'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms or filters'
                : 'Type in the search box above to find your favorite movies'
              }
            </p>
            {searchQuery && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearFilters}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Clear Search
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MovieCard
                  movie={movie}
                  onShowDetails={setSelectedMovie}
                  onAddToWatchlist={handleAddToWatchlist}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Movie Detail Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onAddToWatchlist={handleAddToWatchlist}
      />
    </div>
  );
};

export default Search;