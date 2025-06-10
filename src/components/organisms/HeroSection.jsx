import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const HeroSection = ({ onDiscoverClick, onSearchClick }) => {
    return (
        <section className="relative overflow-hidden py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Text as="h1" className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
                        Find Your Perfect
                        <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Movie Match
                        </span>
                    </Text>
                    <Text className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Discover movies that match your mood, create watchlists, and plan amazing movie nights with friends
                    </Text>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button
                        onClick={onDiscoverClick}
                        animate={true}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl"
                    >
                        Start Discovering
                    </Button>
                    <Button
                        onClick={onSearchClick}
                        animate={true}
                        className="px-8 py-4 bg-surface-800 text-white font-semibold rounded-xl hover:bg-surface-700"
                    >
                        Search Movies
                    </Button>
                </motion.div>
            </div>

            {/* Background gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
            </div>
        </section>
    );
};

export default HeroSection;