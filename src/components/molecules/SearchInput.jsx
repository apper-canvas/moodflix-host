import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchInput = ({ searchQuery, setSearchQuery, placeholder = 'Search...', className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-4 text-lg"
            />
        </div>
    );
};

export default SearchInput;