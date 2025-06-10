import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const FeatureSection = ({ features }) => {
    return (
        <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mb-16"
                >
                    <Text as="h2" className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                        Everything You Need for Movie Discovery
                    </Text>
                    <Text className="text-lg text-gray-400 max-w-2xl mx-auto">
                        From mood-based recommendations to social movie planning, we've got your entertainment covered
                    </Text>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="bg-surface-800 rounded-2xl p-8 text-center cursor-pointer group hover:bg-surface-700 transition-all duration-300"
                            onClick={feature.action}
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                                <ApperIcon name={feature.icon} className="w-8 h-8 text-white" />
                            </div>
                            <Text as="h3" className="text-xl font-semibold text-white mb-4 group-hover:text-primary transition-colors">
                                {feature.title}
                            </Text>
                            <Text className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </Text>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;