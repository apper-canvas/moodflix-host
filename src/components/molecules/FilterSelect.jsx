import React from 'react';

const FilterSelect = ({ value, onChange, options, defaultValue, className = '', ...props }) => {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`px-4 py-2 bg-surface-800 text-white rounded-lg border border-surface-600 focus:border-primary focus:outline-none transition-colors ${className}`}
            {...props}
        >
            <option value="">{defaultValue}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default FilterSelect;