import React from 'react';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const FormField = ({ label, id, type, value, onChange, placeholder, required = false, className = '' }) => {
    return (
        <div className={className}>
            <Text as="label" htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
                {label} {required && '*'}
            </Text>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
};

export default FormField;