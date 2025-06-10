import React from 'react';

const Spinner = ({ className = 'w-8 h-8' }) => {
    return (
        <div className={`animate-spin rounded-full border-4 border-t-4 border-primary border-t-transparent ${className}`}></div>
    );
};

export default Spinner;