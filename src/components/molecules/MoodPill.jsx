import React from 'react';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const MoodPill = ({ mood, isSelected, onClick }) => {
    return (
        <Button
            onClick={() => onClick(mood)}
            animate={true}
            className={`${mood.gradient} rounded-xl p-4 h-24 flex flex-col items-center justify-center text-white font-semibold transition-all duration-200 ${
                isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''
            }`}
        >
            <Text as="span" className="text-2xl mb-1">{mood.emoji}</Text>
            <Text as="span" className="text-sm">{mood.label}</Text>
        </Button>
    );
};

export default MoodPill;