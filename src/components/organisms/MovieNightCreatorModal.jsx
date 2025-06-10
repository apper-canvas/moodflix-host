import React from 'react';
import Modal from '@/components/molecules/Modal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const MovieNightCreatorModal = ({ isOpen, onClose, newMovieNight, setNewMovieNight, onSubmit }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMovieNight(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} modalClassName="max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
                <Text as="h2" className="text-2xl font-display font-bold text-white">
                    Create Movie Night
                </Text>
                <Button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-white hover:bg-surface-700 rounded-lg"
                >
                    <ApperIcon name="X" className="w-5 h-5" />
                </Button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <FormField
                    label="Theme Name"
                    id="theme"
                    name="theme"
                    type="text"
                    value={newMovieNight.theme}
                    onChange={handleInputChange}
                    placeholder="e.g., 80s Action Night, Rom-Com Marathon"
                    required
                />

                <FormField
                    label="Date"
                    id="date"
                    name="date"
                    type="date"
                    value={newMovieNight.date}
                    onChange={handleInputChange}
                    required
                />

                <div className="flex space-x-3 pt-4">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-surface-700 text-gray-300 hover:bg-surface-600"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-primary text-white hover:bg-primary/90"
                    >
                        Create Night
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default MovieNightCreatorModal;