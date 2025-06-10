import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const CallToActionSection = ({ onDiscoverClick }) => {
    return (
        <section className="py-16 px-6 bg-surface-900/50">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center border border-primary/20"
                >
                    <Text as="h3" className="text-2xl font-display font-bold text-white mb-4">
                        Ready to Find Your Next Favorite Movie?
                    </Text>
                    <Text className="text-gray-300 mb-6">
                        Start by telling us how you're feeling, and we'll find the perfect movies for your mood
                    </Text>
                    <Button
                        onClick={onDiscoverClick}
                        animate={true}
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90"
                    >
                        <ApperIcon name="Compass" className="w-5 h-5" />
                        <span>Discover Movies</span>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default CallToActionSection;