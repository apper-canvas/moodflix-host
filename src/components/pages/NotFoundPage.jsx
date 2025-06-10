import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="mb-8"
        >
          <ApperIcon name="Film" className="w-24 h-24 text-gray-400 mx-auto" />
        </motion.div>

        <Text as="h1" className="text-6xl font-display font-bold text-white mb-4">404</Text>
        <Text as="h2" className="text-2xl font-semibold text-white mb-4">Page Not Found</Text>
        <Text className="text-gray-400 mb-8 leading-relaxed">
          Looks like this page got lost in the cinema. Let's get you back to the main show!
        </Text>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            animate={true}
            className="px-6 py-3 bg-primary text-white hover:bg-primary/90"
          >
            Go Home
          </Button>
          <Button
            onClick={() => navigate('/discover')}
            animate={true}
            className="px-6 py-3 bg-surface-800 text-gray-300 hover:bg-surface-700"
          >
            Discover Movies
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;