import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const WatchlistItem = ({ movie, onRemove, onShowDetails }) => {
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-surface-800 rounded-xl p-4 hover:bg-surface-700 transition-all duration-200 group"
    >
      <div className="flex space-x-4">
        {/* Movie Poster */}
        <div
          className="w-16 h-24 bg-surface-700 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
          onClick={() => onShowDetails(movie)}
        >
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Movie Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-white text-lg mb-1 cursor-pointer hover:text-primary transition-colors truncate"
            onClick={() => onShowDetails(movie)}
          >
            {movie.title}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-gray-400 mb-2">
            <span>{movie.year}</span>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Clock" className="w-3 h-3" />
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-400">
              <ApperIcon name="Star" className="w-3 h-3 fill-current" />
              <span>{movie.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-300 line-clamp-2 mb-3">
            {movie.synopsis}
          </p>
          
          {/* Genres */}
          <div className="flex flex-wrap gap-1">
            {movie.genres?.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-surface-600 text-xs text-gray-300 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-between items-end flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(movie.id)}
            className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Users" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default WatchlistItem;