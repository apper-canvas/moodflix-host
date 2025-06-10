import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';

const MovieNightCard = ({ movieNight, onShare, onEdit, onDelete }) => {
  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-surface-800 rounded-xl p-6 hover:bg-surface-700 transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            {movieNight.theme}
          </h3>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span>{formatDate(movieNight.date)}</span>
            <span>•</span>
            <span>{movieNight.movieIds?.length || 0} movies</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onShare(movieNight)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Share2" className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(movieNight)}
            className="p-2 text-gray-400 hover:text-info hover:bg-info/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(movieNight.id)}
            className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Movie Count and Preview */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-300">
            Selected Movies
          </span>
          <span className="text-xs text-gray-400">
            {movieNight.movieIds?.length || 0} selected
          </span>
        </div>
        
        {/* Movie preview placeholder */}
        <div className="flex space-x-2">
          {[...Array(Math.min(4, movieNight.movieIds?.length || 0))].map((_, i) => (
            <div
              key={i}
              className="w-12 h-16 bg-surface-600 rounded-lg flex-shrink-0"
            />
          ))}
          {movieNight.movieIds?.length > 4 && (
            <div className="w-12 h-16 bg-surface-600 rounded-lg flex-shrink-0 flex items-center justify-center">
              <span className="text-xs text-gray-400">
                +{movieNight.movieIds.length - 4}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Share Link */}
      <div className="pt-4 border-t border-surface-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Link" className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 truncate">
              {movieNight.shareLink || 'No share link'}
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onShare(movieNight)}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
          >
            Share
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieNightCard;