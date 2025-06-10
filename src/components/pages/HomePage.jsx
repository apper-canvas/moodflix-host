import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '@/components/organisms/HeroSection';
import FeatureSection from '@/components/organisms/FeatureSection';
import CallToActionSection from '@/components/organisms/CallToActionSection';

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: 'Heart',
            title: 'Mood-Based Discovery',
            description: 'Find movies that match exactly how you\'re feeling right now',
            action: () => navigate('/discover')
        },
        {
            icon: 'Bookmark',
            title: 'Personal Watchlist',
            description: 'Save movies you want to watch and organize them your way',
            action: () => navigate('/watchlist')
        },
        {
            icon: 'Users',
            title: 'Movie Nights',
            description: 'Plan themed movie nights and share them with friends',
            action: () => navigate('/movie-nights')
        }
    ];

    return (
        <div className="min-h-full bg-background">
            <HeroSection
                onDiscoverClick={() => navigate('/discover')}
                onSearchClick={() => navigate('/search')}
            />
            <FeatureSection features={features} />
            <CallToActionSection onDiscoverClick={() => navigate('/discover')} />
        </div>
    );
};

export default HomePage;