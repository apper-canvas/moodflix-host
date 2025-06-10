import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PosterImage from '@/components/atoms/PosterImage';
import Text from '@/components/atoms/Text';
import InfoDisplay from '@/components/molecules/InfoDisplay';
import Button from '@/components/atoms/Button';
import { ratingService } from '@/services';

const MovieCard = ({ movie, onShowDetails, onAddToWatchlist }) => {
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);

    useEffect(() => {
        const loadRating = async () => {
            try {
                const stats = await ratingService.getAverageRating(movie.id);
                setAverageRating(stats.average);
                setRatingCount(stats.count);
            } catch (error) {
                console.error('Error loading rating:', error);
            }
        };
        loadRating();
    }, [movie.id]);

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
            <PosterImage
                src={movie.poster}
                alt={movie.title}
                className="group-hover:scale-105"
            />

            {/* Overlay with actions */}
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                            <InfoDisplay
                                iconName="Star"
                                text={averageRating > 0 ? averageRating : movie.rating}
                                className="text-yellow-400"
                                iconClassName="w-4 h-4 fill-current"
                                textClassName="text-sm font-medium ml-1"
                            />
                            {ratingCount > 0 && (
                                <Text className="text-xs text-gray-400">
                                    ({ratingCount})
                                </Text>
                            )}
                        </div>
                        <Text as="span" className="text-xs text-gray-300">
                            {formatRuntime(movie.runtime)}
                        </Text>
                        <Button
                            onClick={handleAddToWatchlist}
                            animate={true}
                            className="p-2 bg-primary/90 rounded-full text-white hover:bg-primary"
                        >
                            <ApperIcon name="Plus" className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
            {/* Watchlist indicator (top right) */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-1 bg-black/50 rounded-full">
                    <ApperIcon name="Bookmark" className="w-4 h-4 text-white" />
                </div>
            </div>

            {/* Movie Info */}
            <div className="p-4">
                <Text as="h3" className="font-semibold text-white text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {movie.title}
                </Text>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <Text as="span">{movie.year}</Text>
                    <InfoDisplay
                        iconName="Clock"
                        text={formatRuntime(movie.runtime)}
                        className="text-gray-400"
                        iconClassName="w-3 h-3"
                    />
                </div>
                <Text className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                    {movie.synopsis}
                </Text>

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