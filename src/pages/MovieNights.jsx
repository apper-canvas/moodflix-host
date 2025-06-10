import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import MovieNightCard from '../components/MovieNightCard';
import { movieNightService } from '../services';

const MovieNights = () => {
  const [movieNights, setMovieNights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMovieNight, setNewMovieNight] = useState({
    theme: '',
    date: '',
    movieIds: []
  });

  useEffect(() => {
    loadMovieNights();
  }, []);

  const loadMovieNights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await movieNightService.getAll();
      setMovieNights(result);
    } catch (err) {
      setError(err.message || 'Failed to load movie nights');
      toast.error('Failed to load movie nights');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovieNight = async (e) => {
    e.preventDefault();
    
    if (!newMovieNight.theme || !newMovieNight.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const movieNight = await movieNightService.create({
        ...newMovieNight,
        shareLink: `moodflix.app/night/${Date.now()}`
      });
      
      setMovieNights(prev => [movieNight, ...prev]);
      setNewMovieNight({ theme: '', date: '', movieIds: [] });
      setShowCreateModal(false);
      toast.success('Movie night created successfully!');
    } catch (err) {
      toast.error('Failed to create movie night');
    }
  };

  const handleShare = async (movieNight) => {
    try {
      await navigator.clipboard.writeText(movieNight.shareLink);
      toast.success('Share link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy share link');
    }
  };

  const handleDelete = async (movieNightId) => {
    try {
      await movieNightService.delete(movieNightId);
      setMovieNights(prev => prev.filter(mn => mn.id !== movieNightId));
      toast.success('Movie night deleted');
    } catch (err) {
      toast.error('Failed to delete movie night');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-surface-700 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-surface-700 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="h-12 bg-surface-700 rounded-lg w-40 mb-8 animate-pulse"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface-800 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-surface-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-surface-700 rounded w-1/2 mb-6"></div>
              <div className="flex space-x-2 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="w-12 h-16 bg-surface-700 rounded-lg"></div>
                ))}
              </div>
              <div className="h-4 bg-surface-700 rounded w-full"></div>
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
        <h3 className="text-xl font-semibold text-white mb-2">Failed to load movie nights</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={loadMovieNights}
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Movie Nights
            </h1>
            <p className="text-gray-400">
              Plan themed movie nights and share them with friends
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span className="font-medium">Create Movie Night</span>
          </motion.button>
        </div>

        {/* Movie Nights Grid */}
        {movieNights.length === 0 ? (
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
              <ApperIcon name="Users" className="w-16 h-16 text-gray-400 mx-auto" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No movie nights planned yet
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first movie night and invite friends to join the fun
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Your First Movie Night
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movieNights.map((movieNight, index) => (
              <motion.div
                key={movieNight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MovieNightCard
                  movieNight={movieNight}
                  onShare={handleShare}
                  onEdit={() => {}}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Movie Night Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface-900 rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-white">
                Create Movie Night
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-surface-700 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMovieNight} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme Name *
                </label>
                <input
                  type="text"
                  value={newMovieNight.theme}
                  onChange={(e) => setNewMovieNight(prev => ({ ...prev, theme: e.target.value }))}
                  placeholder="e.g., 80s Action Night, Rom-Com Marathon"
                  className="w-full px-4 py-3 bg-surface-800 text-white rounded-lg border border-surface-600 focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={newMovieNight.date}
                  onChange={(e) => setNewMovieNight(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-surface-800 text-white rounded-lg border border-surface-600 focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-surface-700 text-gray-300 rounded-lg hover:bg-surface-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Night
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MovieNights;