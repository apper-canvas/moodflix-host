import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from './ApperIcon';

const MovieDetailModal = ({ movie, isOpen, onClose, onAddToWatchlist }) => {
  const [showTrailer, setShowTrailer] = useState(false);

  if (!movie) return null;

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative">
                <div className="aspect-video bg-surface-800 rounded-t-2xl overflow-hidden">
                  {showTrailer && movie.trailerUrl ? (
                    <iframe
                      src={getYouTubeEmbedUrl(movie.trailerUrl)}
                      title={`${movie.title} Trailer`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      className="w-full h-full bg-cover bg-center relative"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${movie.poster})`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        {movie.trailerUrl && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowTrailer(true)}
                            className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                          >
                            <ApperIcon name="Play" className="w-8 h-8 text-white ml-1" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>

                {/* Trailer Toggle */}
                {movie.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(!showTrailer)}
                    className="absolute top-4 left-4 px-3 py-2 bg-black/50 rounded-full text-white text-sm hover:bg-black/70 transition-colors z-10"
                  >
                    {showTrailer ? 'Show Poster' : 'Watch Trailer'}
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column - Movie Info */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                      {movie.title}
                    </h1>
                    
                    <div className="flex items-center space-x-4 text-gray-400 mb-4">
                      <span className="text-lg">{movie.year}</span>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Clock" className="w-4 h-4" />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <ApperIcon name="Star" className="w-4 h-4 fill-current" />
                        <span className="font-medium">{movie.rating}</span>
                      </div>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {movie.genres?.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-surface-700 text-gray-300 rounded-full text-sm"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    {/* Synopsis */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Synopsis</h3>
                      <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
                    </div>

                    {/* Moods */}
                    {movie.moods && movie.moods.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Perfect for</h3>
                        <div className="flex flex-wrap gap-2">
                          {movie.moods.map((mood) => (
                            <span
                              key={mood}
                              className="px-3 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-sm font-medium"
                            >
                              {mood} mood
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Actions */}
                  <div className="lg:w-64">
                    <div className="bg-surface-800 rounded-xl p-4 space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAddToWatchlist(movie)}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <ApperIcon name="Plus" className="w-5 h-5" />
                        <span className="font-medium">Add to Watchlist</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-surface-700 text-gray-300 rounded-lg hover:bg-surface-600 transition-colors"
                      >
                        <ApperIcon name="Users" className="w-5 h-5" />
                        <span className="font-medium">Add to Movie Night</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-surface-700 text-gray-300 rounded-lg hover:bg-surface-600 transition-colors"
                      >
                        <ApperIcon name="Share2" className="w-5 h-5" />
                        <span className="font-medium">Share</span>
                      </motion.button>
                    </div>

                    {/* Movie Poster */}
                    <div className="mt-6 hidden lg:block">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MovieDetailModal;