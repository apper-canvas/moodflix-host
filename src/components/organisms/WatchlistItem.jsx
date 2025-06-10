import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PosterImage from '@/components/atoms/PosterImage';
import Text from '@/components/atoms/Text';
import InfoDisplay from '@/components/molecules/InfoDisplay';
import Button from '@/components/atoms/Button';

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
                    className="w-16 h-24 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                    onClick={() => onShowDetails(movie)}
                >
                    <PosterImage
                        src={movie.poster}
                        alt={movie.title}
                        className="group-hover:scale-105"
                        containerClassName="w-full h-full"
                    />
                </div>

                {/* Movie Info */}
                <div className="flex-1 min-w-0">
                    <Text
                        as="h3"
                        className="font-semibold text-white text-lg mb-1 cursor-pointer hover:text-primary transition-colors truncate"
                        onClick={() => onShowDetails(movie)}
                    >
                        {movie.title}
                    </Text>
                    <div className="flex items-center space-x-3 text-sm text-gray-400 mb-2">
                        <Text as="span">{movie.year}</Text>
                        <InfoDisplay
                            iconName="Clock"
                            text={formatRuntime(movie.runtime)}
                            iconClassName="w-3 h-3"
                        />
                        <InfoDisplay
                            iconName="Star"
                            text={movie.rating}
                            className="text-yellow-400"
                            iconClassName="w-3 h-3 fill-current"
                        />
                    </div>
                    <Text className="text-sm text-gray-300 line-clamp-2 mb-3">
                        {movie.synopsis}
                    </Text>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1">
                        {movie.genres?.slice(0, 3).map((genre) => (
                            <Text
                                as="span"
                                key={genre}
                                className="px-2 py-1 bg-surface-600 text-xs text-gray-300 rounded-full"
                            >
                                {genre}
                            </Text>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-between items-end flex-shrink-0">
                    <Button
                        onClick={() => onRemove(movie.id)}
                        animate={true}
                        className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-lg"
                    >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>

                    <Button
                        animate={true}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                    >
                        <ApperIcon name="Users" className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default WatchlistItem;