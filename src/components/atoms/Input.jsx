import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', required, ...props }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-surface-800 text-white rounded-lg border border-surface-600 focus:border-primary focus:outline-none transition-colors ${className}`}
            required={required}
            {...props}
        />
    );
};

export default Input;