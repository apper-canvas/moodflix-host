import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Modal from '@/components/molecules/Modal';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import InfoDisplay from '@/components/molecules/InfoDisplay';

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
        <Modal isOpen={isOpen} onClose={onClose} modalClassName="max-w-4xl w-full">
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
                                    <Button
                                        onClick={() => setShowTrailer(true)}
                                        animate={true}
                                        className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center hover:bg-primary p-0"
                                    >
                                        <ApperIcon name="Play" className="w-8 h-8 text-white ml-1" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <Button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 z-10"
                >
                    <ApperIcon name="X" className="w-5 h-5" />
                </Button>

                {/* Trailer Toggle */}
                {movie.trailerUrl && (
                    <Button
                        onClick={() => setShowTrailer(!showTrailer)}
                        className="absolute top-4 left-4 px-3 py-2 bg-black/50 rounded-full text-white text-sm hover:bg-black/70 z-10"
                    >
                        {showTrailer ? 'Show Poster' : 'Watch Trailer'}
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column - Movie Info */}
                    <div className="flex-1">
                        <Text as="h1" className="text-3xl font-display font-bold text-white mb-2">
                            {movie.title}
                        </Text>

                        <div className="flex items-center space-x-4 text-gray-400 mb-4">
                            <Text as="span" className="text-lg">{movie.year}</Text>
                            <InfoDisplay
                                iconName="Clock"
                                text={formatRuntime(movie.runtime)}
                                iconClassName="w-4 h-4"
                            />
                            <InfoDisplay
                                iconName="Star"
                                text={movie.rating}
                                className="text-yellow-400"
                                iconClassName="w-4 h-4 fill-current"
                                textClassName="font-medium"
                            />
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres?.map((genre) => (
                                <Text
                                    as="span"
                                    key={genre}
                                    className="px-3 py-1 bg-surface-700 text-gray-300 rounded-full text-sm"
                                >
                                    {genre}
                                </Text>
                            ))}
                        </div>

                        {/* Synopsis */}
                        <div className="mb-6">
                            <Text as="h3" className="text-lg font-semibold text-white mb-3">Synopsis</Text>
                            <Text className="text-gray-300 leading-relaxed">{movie.synopsis}</Text>
                        </div>

                        {/* Moods */}
                        {movie.moods && movie.moods.length > 0 && (
                            <div className="mb-6">
                                <Text as="h3" className="text-lg font-semibold text-white mb-3">Perfect for</Text>
                                <div className="flex flex-wrap gap-2">
                                    {movie.moods.map((mood) => (
                                        <Text
                                            as="span"
                                            key={mood}
                                            className="px-3 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-sm font-medium"
                                        >
                                            {mood} mood
                                        </Text>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Actions */}
                    <div className="lg:w-64">
                        <div className="bg-surface-800 rounded-xl p-4 space-y-3">
                            <Button
                                onClick={() => onAddToWatchlist(movie)}
                                animate={true}
                                className="w-full flex items-center justify-center space-x-2 py-3 bg-primary text-white hover:bg-primary/90"
                            >
                                <ApperIcon name="Plus" className="w-5 h-5" />
                                <Text as="span" className="font-medium">Add to Watchlist</Text>
                            </Button>

                            <Button
                                animate={true}
                                className="w-full flex items-center justify-center space-x-2 py-3 bg-surface-700 text-gray-300 hover:bg-surface-600"
                            >
                                <ApperIcon name="Users" className="w-5 h-5" />
                                <Text as="span" className="font-medium">Add to Movie Night</Text>
                            </Button>

                            <Button
                                animate={true}
                                className="w-full flex items-center justify-center space-x-2 py-3 bg-surface-700 text-gray-300 hover:bg-surface-600"
                            >
                                <ApperIcon name="Share2" className="w-5 h-5" />
                                <Text as="span" className="font-medium">Share</Text>
                            </Button>
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
        </Modal>
    );
};

export default MovieDetailModal;