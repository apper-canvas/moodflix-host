import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import MovieNightGrid from '@/components/organisms/MovieNightGrid';
import MovieNightCreatorModal from '@/components/organisms/MovieNightCreatorModal';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import { movieNightService } from '@/services';

const MovieNightsPage = () => {
  const [movieNights, setMovieNights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMovieNight, setNewMovieNight] = useState({
    theme: '',
    date: '',
    movieIds: []
  });

  useEffect(() => {
    loadMovieNights();
  }, []);

  const loadMovieNights = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await movieNightService.getAll();
      setMovieNights(result);
    } catch (err) {
      setError(err.message || 'Failed to load movie nights');
      toast.error('Failed to load movie nights');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovieNight = async (e) => {
    e.preventDefault();

    if (!newMovieNight.theme || !newMovieNight.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const movieNight = await movieNightService.create({
        ...newMovieNight,
        shareLink: `moodflix.app/night/${Date.now()}`
      });

      setMovieNights(prev => [movieNight, ...prev]);
      setNewMovieNight({ theme: '', date: '', movieIds: [] });
      setShowCreateModal(false);
      toast.success('Movie night created successfully!');
    } catch (err) {
      toast.error('Failed to create movie night');
    }
  };

  const handleShare = async (movieNight) => {
    try {
      await navigator.clipboard.writeText(movieNight.shareLink);
      toast.success('Share link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy share link');
    }
  };

  const handleDelete = async (movieNightId) => {
    try {
      await movieNightService.delete(movieNightId);
      setMovieNights(prev => prev.filter(mn => mn.id !== movieNightId));
      toast.success('Movie night deleted');
    } catch (err) {
      toast.error('Failed to delete movie night');
    }
  };

  if (loading) {
    return <LoadingState type="movie-nights" />;
  }

  if (error) {
    return <ErrorState message="Failed to load movie nights" onRetry={loadMovieNights} />;
  }

  return (
    <div className="max-w-full overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Text as="h1" className="text-3xl font-display font-bold text-white mb-2">
              Movie Nights
            </Text>
            <Text className="text-gray-400">
              Plan themed movie nights and share them with friends
            </Text>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            animate={true}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white hover:bg-primary/90"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <Text as="span" className="font-medium">Create Movie Night</Text>
          </Button>
        </div>

        {/* Movie Nights Grid */}
        <MovieNightGrid
          movieNights={movieNights}
          onShare={handleShare}
          onEdit={() => {}} // Placeholder for edit functionality
          onDelete={handleDelete}
          onCreateClick={() => setShowCreateModal(true)}
        />
      </div>

      <MovieNightCreatorModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        newMovieNight={newMovieNight}
        setNewMovieNight={setNewMovieNight}
        onSubmit={handleCreateMovieNight}
      />
    </div>
  );
};

export default MovieNightsPage;