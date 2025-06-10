import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import WatchlistContent from '@/components/organisms/WatchlistContent';
import MovieDetailModal from '@/components/organisms/MovieDetailModal';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';

import { watchlistService, movieService } from '@/services';

const WatchlistPage = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadWatchlistData();
  }, []);

  const loadWatchlistData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [watchlistData, movieData] = await Promise.all([
        watchlistService.getAll(),
        movieService.getAll()
      ]);

      setWatchlists(watchlistData);

      // Get movies that are in watchlists
      const watchlistMovieIds = watchlistData.flatMap(w => w.movieIds || []);
      const watchlistMovies = movieData.filter(movie =>
        watchlistMovieIds.includes(movie.id)
      );

      setMovies(watchlistMovies);
    } catch (err) {
      setError(err.message || 'Failed to load watchlist');
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await watchlistService.removeMovie(movieId);
      setMovies(prev => prev.filter(movie => movie.id !== movieId));
      toast.success('Movie removed from watchlist');
    } catch (err) {
      toast.error('Failed to remove movie from watchlist');
    }
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      await movieService.addToWatchlist(movie.id);
      toast.success(`${movie.title} added to watchlist!`);
    } catch (err) {
      toast.error('Failed to add to watchlist');
    }
  };

  const categories = [
    { id: 'all', label: 'All Movies', count: movies.length },
    { id: 'action', label: 'Action', count: movies.filter(m => m.genres?.includes('Action')).length },
    { id: 'comedy', label: 'Comedy', count: movies.filter(m => m.genres?.includes('Comedy')).length },
    { id: 'drama', label: 'Drama', count: movies.filter(m => m.genres?.includes('Drama')).length },
  ];

  if (loading) {
    return <LoadingState type="watchlist" />;
  }

  if (error) {
    return <ErrorState message="Failed to load watchlist" onRetry={loadWatchlistData} />;
  }

  return (
    <div className="max-w-full overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Text as="h1" className="text-3xl font-display font-bold text-white mb-2">
            My Watchlist
          </Text>
          <Text className="text-gray-400">
            Keep track of movies you want to watch
          </Text>
        </div>

        <WatchlistContent
          movies={movies}
          activeCategory={activeCategory}
          categories={categories}
          onCategoryChange={setActiveCategory}
          onRemove={handleRemoveFromWatchlist}
          onShowDetails={setSelectedMovie}
        />
      </div>

      <MovieDetailModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onAddToWatchlist={handleAddToWatchlist}
      />
    </div>
  );
};

export default WatchlistPage;