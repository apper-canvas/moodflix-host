import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const PosterImage = ({ src, alt, className = '', containerClassName = '' }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <div className={`relative aspect-[2/3] overflow-hidden ${containerClassName}`}>
            {!imageError ? (
                <>
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-surface-700 animate-pulse"></div>
                    )}
                    <img
                        src={src}
                        alt={alt}
                        className={`w-full h-full object-cover transition-all duration-300 ${className} ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                </>
            ) : (
                <div className="absolute inset-0 bg-surface-700 flex items-center justify-center">
                    <ApperIcon name="Image" className="w-12 h-12 text-gray-500" />
                </div>
            )}
        </div>
    );
};

export default PosterImage;