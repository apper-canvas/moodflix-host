import React from 'react';
import Spinner from '@/components/atoms/Spinner';

const LoadingState = ({ type = 'page', className = '' }) => {
    const renderContent = () => {
        switch (type) {
            case 'discover':
                return (
                    <>
                        <div className="mb-8">
                            <div className="h-8 bg-surface-700 rounded w-64 mb-4 animate-pulse"></div>
                            <div className="h-4 bg-surface-700 rounded w-96 animate-pulse"></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-24 bg-surface-700 rounded-xl animate-pulse"></div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-surface-800 rounded-xl p-4 animate-pulse">
                                    <div className="aspect-[2/3] bg-surface-700 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-surface-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-surface-700 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'search':
                return (
                    <>
                        <div className="mb-8">
                            <div className="h-8 bg-surface-700 rounded w-48 mb-4 animate-pulse"></div>
                            <div className="h-4 bg-surface-700 rounded w-96 animate-pulse"></div>
                        </div>
                        
                        <div className="h-12 bg-surface-700 rounded-lg mb-8 animate-pulse"></div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-surface-800 rounded-xl p-4 animate-pulse">
                                    <div className="aspect-[2/3] bg-surface-700 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-surface-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-surface-700 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'movie-nights':
                return (
                    <>
                        <div className="mb-8">
                            <div className="h-8 bg-surface-700 rounded w-48 mb-4 animate-pulse"></div>
                            <div className="h-4 bg-surface-700 rounded w-96 animate-pulse"></div>
                        </div>
                        
                        <div className="h-12 bg-surface-700 rounded-lg w-40 mb-8 animate-pulse"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-surface-800 rounded-xl p-6 animate-pulse">
                                    <div className="h-6 bg-surface-700 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-surface-700 rounded w-1/2 mb-6"></div>
                                    <div className="flex space-x-2 mb-4">
                                        {[...Array(3)].map((_, j) => (
                                            <div key={j} className="w-12 h-16 bg-surface-700 rounded-lg"></div>
                                        ))}
                                    </div>
                                    <div className="h-4 bg-surface-700 rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'watchlist':
                return (
                    <>
                        <div className="mb-8">
                            <div className="h-8 bg-surface-700 rounded w-48 mb-4 animate-pulse"></div>
                            <div className="h-4 bg-surface-700 rounded w-96 animate-pulse"></div>
                        </div>
                        
                        <div className="flex space-x-4 mb-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-10 bg-surface-700 rounded-lg w-24 animate-pulse"></div>
                            ))}
                        </div>
                        
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-surface-800 rounded-xl p-4 animate-pulse">
                                    <div className="flex space-x-4">
                                        <div className="w-16 h-24 bg-surface-700 rounded-lg"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-6 bg-surface-700 rounded w-3/4"></div>
                                            <div className="h-4 bg-surface-700 rounded w-1/2"></div>
                                            <div className="h-4 bg-surface-700 rounded w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            default:
                return (
                    <div className="flex justify-center items-center h-full min-h-[300px]">
                        <Spinner className="w-12 h-12" />
                    </div>
                );
        }
    };

    return (
        <div className={`p-6 ${className}`}>
            {renderContent()}
        </div>
    );
};

export default LoadingState;