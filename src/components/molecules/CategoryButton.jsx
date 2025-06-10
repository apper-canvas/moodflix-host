import React from 'react';
import Button from '@/components/atoms/Button';

const CategoryButton = ({ label, count, isActive, onClick }) => {
    return (
        <Button
            onClick={onClick}
            animate={true}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                    ? 'bg-primary text-white'
                    : 'bg-surface-800 text-gray-300 hover:bg-surface-700'
            }`}
        >
            {label}
            {count > 0 && (
                <span className="ml-2 px-2 py-1 bg-black/20 rounded-full text-xs">
                    {count}
                </span>
            )}
        </Button>
    );
};

export default CategoryButton;