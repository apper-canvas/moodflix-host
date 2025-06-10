import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import MovieNightCard from '@/components/organisms/MovieNightCard';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const MovieNightGrid = ({ movieNights, onShare, onEdit, onDelete, onCreateClick }) => {
    return (
        <>
            {movieNights.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="mb-6"
                    >
                        <ApperIcon name="Users" className="w-16 h-16 text-gray-400 mx-auto" />
                    </motion.div>
                    <Text as="h3" className="text-xl font-semibold text-white mb-2">
                        No movie nights planned yet
                    </Text>
                    <Text className="text-gray-400 mb-6">
                        Create your first movie night and invite friends to join the fun
                    </Text>
                    <Button
                        onClick={onCreateClick}
                        animate={true}
                        className="px-6 py-3 bg-primary text-white hover:bg-primary/90"
                    >
                        Create Your First Movie Night
                    </Button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movieNights.map((movieNight, index) => (
                        <motion.div
                            key={movieNight.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <MovieNightCard
                                movieNight={movieNight}
                                onShare={onShare}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MovieNightGrid;