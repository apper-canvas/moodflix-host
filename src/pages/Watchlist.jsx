import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import WatchlistItem from '../components/WatchlistItem';
import MovieDetailModal from '../components/MovieDetailModal';
import { watchlistService, movieService } from '../services';

const Watchlist = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadWatchlistData();
  }, []);

  const loadWatchlistData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [watchlistData, movieData] = await Promise.all([
        watchlistService.getAll(),
        movieService.getAll()
      ]);
      
      setWatchlists(watchlistData);
      
      // Get movies that are in watchlists
      const watchlistMovieIds = watchlistData.flatMap(w => w.movieIds || []);
      const watchlistMovies = movieData.filter(movie => 
        watchlistMovieIds.includes(movie.id)
      );
      
      setMovies(watchlistMovies);
    } catch (err) {
      setError(err.message || 'Failed to load watchlist');
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await watchlistService.removeMovie(movieId);
      setMovies(prev => prev.filter(movie => movie.id !== movieId));
      toast.success('Movie removed from watchlist');
    } catch (err) {
      toast.error('Failed to remove movie from watchlist');
    }
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      await movieService.addToWatchlist(movie.id);
      toast.success(`${movie.title} added to watchlist!`);
    } catch (err) {
      toast.error('Failed to add to watchlist');
    }
  };

  const categories = [
    { id: 'all', label: 'All Movies', count: movies.length },
    { id: 'action', label: 'Action', count: movies.filter(m => m.genres?.includes('Action')).length },
    { id: 'comedy', label: 'Comedy', count: movies.filter(m => m.genres?.includes('Comedy')).length },
    { id: 'drama', label: 'Drama', count: movies.filter(m => m.genres?.includes('Drama')).length },
  ];

  const filteredMovies = activeCategory === 'all' 
    ? movies 
    : movies.filter(movie => 
        movie.genres?.some(genre => genre.toLowerCase() === activeCategory)
      );

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-surface-700 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-surface-700 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="flex space-x-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-surface-700 rounded-lg w-24 animate-pulse"></div>
          ))}
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface-800 rounded-xl p-4 animate-pulse">
              <div className="flex space-x-4">
                <div className="w-16 h-24 bg-surface-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-surface-700 rounded w-3/4"></div>
                  <div className="h-4 bg-surface-700 rounded w-1/2"></div>
                  <div className="h-4 bg-surface-700 rounded w-full"></div>
                </div>
              </div>
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
        <h3 className="text-xl font-semibold text-white mb-2">Failed to load watchlist</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={loadWatchlistData}
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
            My Watchlist
          </h1>
          <p className="text-gray-400">
            Keep track of movies you want to watch
          </p>
        </div>

        {/* Categories */}
        <div className="flex space-x-4 mb-8 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-surface-800 text-gray-300 hover:bg-surface-700'
              }`}
            >
              {category.label}
              {category.count > 0 && (
                <span className="ml-2 px-2 py-1 bg-black/20 rounded-full text-xs">
                  {category.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Movie List */}
        {filteredMovies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="mb-6"
            >
              <ApperIcon name="Bookmark" className="w-16 h-16 text-gray-400 mx-auto" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeCategory === 'all' ? 'Your watchlist is empty' : `No ${activeCategory} movies in your watchlist`}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeCategory === 'all' 
                ? 'Start adding movies you want to watch to build your personal collection'
                : `Add some ${activeCategory} movies to see them here`
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/discover'}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Discover Movies
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">
                {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} 
                {activeCategory !== 'all' && ` in ${activeCategory}`}
              </span>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-surface-700 rounded-lg transition-colors">
                  <ApperIcon name="Grid" className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-surface-700 rounded-lg transition-colors">
                  <ApperIcon name="List" className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <WatchlistItem
                  movie={movie}
                  onRemove={handleRemoveFromWatchlist}
                  onShowDetails={setSelectedMovie}
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

export default Watchlist;