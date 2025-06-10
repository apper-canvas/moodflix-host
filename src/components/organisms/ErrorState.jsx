import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message = 'Something went wrong', onRetry, className = '' }) => {
    return (
        <div className={`p-6 text-center ${className}`}>
            <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
            <Text as="h3" className="text-xl font-semibold text-white mb-2">{message}</Text>
            <Text className="text-gray-400 mb-4">Please try again.</Text>
            {onRetry && (
                <Button onClick={onRetry} className="bg-primary text-white hover:bg-primary/90">
                    Try Again
                </Button>
            )}
        </div>
    );
};

export default ErrorState;