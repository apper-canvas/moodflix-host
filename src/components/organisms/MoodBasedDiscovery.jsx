import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import MoodPill from '@/components/molecules/MoodPill';
import MovieListDisplay from '@/components/organisms/MovieListDisplay';
import MovieDetailModal from '@/components/organisms/MovieDetailModal';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import Text from '@/components/atoms/Text';

import { movieService } from '@/services';

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

const MoodBasedDiscovery = () => {
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

    const handleRetryLoad = () => {
        if (selectedMood) {
            handleMoodSelect(selectedMood);
        } else {
            // Reload the page or show a generic message if no mood was selected
            window.location.reload();
        }
    };

    if (loading) {
        return <LoadingState type="discover" />;
    }

    if (error) {
        return <ErrorState message="Something went wrong while loading movies" onRetry={handleRetryLoad} />;
    }

    return (
        <div className="max-w-full overflow-hidden">
            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <Text as="h2" className="text-3xl font-display font-bold text-white mb-2">
                        How are you feeling today?
                    </Text>
                    <Text className="text-gray-400">
                        Select your mood and discover movies that match your vibe
                    </Text>
                </div>

                {/* Mood Selector */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {MOODS.map((mood, index) => (
                        <MoodPill
                            key={mood.id}
                            mood={mood}
                            isSelected={selectedMood?.id === mood.id}
                            onClick={handleMoodSelect}
                            style={{ transitionDelay: `${index * 0.1}s` }} // Apply transition delay for staggered animation
                        />
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
                            <Text as="h3" className="text-xl font-semibold text-white mb-2">
                                Ready to discover your next favorite movie?
                            </Text>
                            <Text className="text-gray-400">
                                Select a mood above to get personalized movie recommendations
                            </Text>
                        </motion.div>
                    ) : (
                        <MovieListDisplay
                            movies={movies}
                            onShowDetails={setSelectedMovie}
                            onAddToWatchlist={handleAddToWatchlist}
                            selectedMood={selectedMood}
                            onTryAnotherMood={() => setSelectedMood(null)}
                        />
                    )}
                </AnimatePresence>
            </div>

            <MovieDetailModal
                movie={selectedMovie}
                isOpen={!!selectedMovie}
                onClose={() => setSelectedMovie(null)}
                onAddToWatchlist={handleAddToWatchlist}
            />
        </div>
    );
};

export default MoodBasedDiscovery;