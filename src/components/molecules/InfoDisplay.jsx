import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const InfoDisplay = ({ iconName, text, className = '', iconClassName = 'w-3 h-3', textClassName = '' }) => {
    return (
        <div className={`flex items-center space-x-1 ${className}`}>
            {iconName && <ApperIcon name={iconName} className={iconClassName} />}
            <Text as="span" className={textClassName}>{text}</Text>
        </div>
    );
};

export default InfoDisplay;