import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import CategoryButton from '@/components/molecules/CategoryButton';
import WatchlistItem from '@/components/organisms/WatchlistItem';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const WatchlistContent = ({ movies, activeCategory, categories, onCategoryChange, onRemove, onShowDetails }) => {
    const filteredMovies = activeCategory === 'all'
        ? movies
        : movies.filter(movie =>
            movie.genres?.some(genre => genre.toLowerCase() === activeCategory)
        );

    return (
        <>
            {/* Categories */}
            <div className="flex space-x-4 mb-8 overflow-x-auto scrollbar-hide">
                {categories.map((category) => (
                    <CategoryButton
                        key={category.id}
                        label={category.label}
                        count={category.count}
                        isActive={activeCategory === category.id}
                        onClick={() => onCategoryChange(category.id)}
                    />
                ))}
            </div>

            {/* Movie List */}
            {filteredMovies.length === 0 ? (
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
                        <ApperIcon name="Bookmark" className="w-16 h-16 text-gray-400 mx-auto" />
                    </motion.div>
                    <Text as="h3" className="text-xl font-semibold text-white mb-2">
                        {activeCategory === 'all' ? 'Your watchlist is empty' : `No ${activeCategory} movies in your watchlist`}
                    </Text>
                    <Text className="text-gray-400 mb-6">
                        {activeCategory === 'all'
                            ? 'Start adding movies you want to watch to build your personal collection'
                            : `Add some ${activeCategory} movies to see them here`}
                    </Text>
                    <Button
                        onClick={() => window.location.href = '/discover'}
                        animate={true}
                        className="px-6 py-3 bg-primary text-white hover:bg-primary/90"
                    >
                        Discover Movies
                    </Button>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <Text as="span" className="text-gray-400 text-sm">
                            {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
                            {activeCategory !== 'all' && ` in ${activeCategory}`}
                        </Text>

                        <div className="flex items-center space-x-2">
                            <Button className="p-2 text-gray-400 hover:text-white hover:bg-surface-700 rounded-lg">
                                <ApperIcon name="Grid" className="w-4 h-4" />
                            </Button>
                            <Button className="p-2 text-gray-400 hover:text-white hover:bg-surface-700 rounded-lg">
                                <ApperIcon name="List" className="w-4 h-4" />
                            </Button>
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
                                onRemove={onRemove}
                                onShowDetails={onShowDetails}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
};

export default WatchlistContent;