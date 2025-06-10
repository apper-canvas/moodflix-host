import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, type = 'button', animate = false, ...props }) => {
    const Component = animate ? motion.button : 'button';
    const motionProps = animate ? { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } } : {};

    return (
        <Component
            type={type}
            onClick={onClick}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${className}`}
            {...motionProps}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Button;