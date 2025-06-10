import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from './ApperIcon';

const MovieCard = ({ movie, onShowDetails, onAddToWatchlist }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToWatchlist = (e) => {
    e.stopPropagation();
    onAddToWatchlist(movie);
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-surface-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onShowDetails(movie)}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-surface-700 animate-pulse"></div>
            )}
            <img
              src={movie.poster}
              alt={movie.title}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-surface-700 flex items-center justify-center">
            <ApperIcon name="Image" className="w-12 h-12 text-gray-500" />
          </div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-yellow-400">
                  <ApperIcon name="Star" className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium ml-1">{movie.rating}</span>
                </div>
                <span className="text-xs text-gray-300">{formatRuntime(movie.runtime)}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToWatchlist}
                className="p-2 bg-primary/90 rounded-full text-white hover:bg-primary transition-colors"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Watchlist indicator (top right) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-1 bg-black/50 rounded-full">
            <ApperIcon name="Bookmark" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>{movie.year}</span>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" className="w-3 h-3" />
            <span>{formatRuntime(movie.runtime)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
          {movie.synopsis}
        </p>
        
        {/* Genres */}
        <div className="flex flex-wrap gap-1 mt-3">
          {movie.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-surface-700 text-xs text-gray-300 rounded-full"
            >
              {genre}
            </span>
          ))}
          {movie.genres?.length > 2 && (
            <span className="px-2 py-1 bg-surface-700 text-xs text-gray-300 rounded-full">
              +{movie.genres.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;