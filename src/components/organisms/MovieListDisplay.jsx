import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import MovieCard from '@/components/organisms/MovieCard';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const MovieListDisplay = ({ movies, onShowDetails, onAddToWatchlist, selectedMood, onTryAnotherMood, searchQuery, handleClearFilters }) => {
    const isSearchContext = !!searchQuery;
    const isEmpty = movies.length === 0;

    const renderEmptyState = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
        >
            <ApperIcon name={isSearchContext ? "Search" : "Film"} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Text as="h3" className="text-xl font-semibold text-white mb-2">
                {isSearchContext ? (searchQuery ? 'No movies found' : 'Start searching') : (selectedMood ? `No movies found for ${selectedMood.label} mood` : 'Ready to discover your next favorite movie?')}
            </Text>
            <Text className="text-gray-400 mb-6">
                {isSearchContext
                    ? (searchQuery ? 'Try adjusting your search terms or filters' : 'Type in the search box above to find your favorite movies')
                    : (selectedMood ? 'Try selecting a different mood or check back later for new recommendations' : 'Select a mood above to get personalized movie recommendations')}
            </Text>
            {isSearchContext && searchQuery && (
                <Button
                    onClick={handleClearFilters}
                    animate={true}
                    className="px-6 py-3 bg-primary text-white hover:bg-primary/90"
                >
                    Clear Search
                </Button>
            )}
            {!isSearchContext && selectedMood && (
                <Button
                    onClick={onTryAnotherMood}
                    animate={true}
                    className="px-6 py-3 bg-primary text-white hover:bg-primary/90"
                >
                    Try Another Mood
                </Button>
            )}
        </motion.div>
    );

    if (isEmpty) {
        return renderEmptyState();
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="flex items-center justify-between mb-6">
                {isSearchContext ? (
                    <Text as="span" className="text-gray-400 text-sm">
                        {movies.length} movie{movies.length !== 1 ? 's' : ''} found
                        {searchQuery && ` for "${searchQuery}"`}
                    </Text>
                ) : (
                    <Text as="h3" className="text-xl font-semibold text-white">
                        Perfect for your <span className="text-primary">{selectedMood.label}</span> mood
                    </Text>
                )}
                {!isSearchContext && (
                    <Text as="span" className="text-gray-400 text-sm">
                        {movies.length} movie{movies.length !== 1 ? 's' : ''} found
                    </Text>
                )}
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
                            onShowDetails={onShowDetails}
                            onAddToWatchlist={onAddToWatchlist}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default MovieListDisplay;