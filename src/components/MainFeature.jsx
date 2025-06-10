import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import MovieCard from './MovieCard';
import MovieDetailModal from './MovieDetailModal';
import { movieService } from '../services';

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊', gradient: 'mood-gradient-happy' },
  { id: 'sad', label: 'Sad', emoji: '😢', gradient: 'mood-gradient-sad' },
  { id: 'thriller', label: 'Thriller', emoji: '😰', gradient: 'mood-gradient-thriller' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', gradient: 'mood-gradient-romantic' },
  { id: 'adventurous', label: 'Adventurous', emoji: '🏔️', gradient: 'mood-gradient-adventurous' },
  { id: 'nostalgic', label: 'Nostalgic', emoji: '🕰️', gradient: 'mood-gradient-nostalgic' },
  { id: 'scary', label: 'Scary', emoji: '👻', gradient: 'mood-gradient-scary' },
  { id: 'funny', label: 'Funny', emoji: '😂', gradient: 'mood-gradient-funny' }
];

const MainFeature = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    setError(null);
    
    try {
      const result = await movieService.getByMood(mood.id);
      setMovies(result);
      if (result.length === 0) {
        toast.info(`No movies found for ${mood.label} mood. Try another mood!`);
      }
    } catch (err) {
      setError(err.message || 'Failed to load movies');
      toast.error('Failed to load movie recommendations');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-surface-700 rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-surface-700 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-surface-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
        
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
        <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
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
          <h2 className="text-3xl font-display font-bold text-white mb-2">
            How are you feeling today?
          </h2>
          <p className="text-gray-400">
            Select your mood and discover movies that match your vibe
          </p>
        </div>

        {/* Mood Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {MOODS.map((mood, index) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(mood)}
              className={`${mood.gradient} rounded-xl p-4 h-24 flex flex-col items-center justify-center text-white font-semibold transition-all duration-200 ${
                selectedMood?.id === mood.id ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''
              }`}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-sm">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Movie Results */}
        <AnimatePresence mode="wait">
          {!selectedMood ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="mb-6"
              >
                <ApperIcon name="Film" className="w-16 h-16 text-gray-400 mx-auto" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Ready to discover your next favorite movie?
              </h3>
              <p className="text-gray-400">
                Select a mood above to get personalized movie recommendations
              </p>
            </motion.div>
          ) : movies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <ApperIcon name="Search" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No movies found for {selectedMood.label} mood
              </h3>
              <p className="text-gray-400 mb-6">
                Try selecting a different mood or check back later for new recommendations
              </p>
              <button
                onClick={() => setSelectedMood(null)}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Another Mood
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Perfect for your <span className="text-primary">{selectedMood.label}</span> mood
                </h3>
                <span className="text-gray-400 text-sm">
                  {movies.length} movie{movies.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
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
            </motion.div>
          )}
        </AnimatePresence>
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

export default MainFeature;