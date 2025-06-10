import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import SearchAndFilterSection from '@/components/organisms/SearchAndFilterSection';
import MovieListDisplay from '@/components/organisms/MovieListDisplay';
import MovieDetailModal from '@/components/organisms/MovieDetailModal';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';

import { movieService } from '@/services';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: ''
  });

  useEffect(() => {
    loadAllMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [searchQuery, filters, allMovies]);

  const loadAllMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await movieService.getAll();
      setAllMovies(result);
      setMovies(result);
    } catch (err) {
      setError(err.message || 'Failed to load movies');
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = [...allMovies];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genres?.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Genre filter
    if (filters.genre) {
      filtered = filtered.filter(movie =>
        movie.genres?.includes(filters.genre)
      );
    }

    // Year filter
    if (filters.year) {
      const selectedYear = parseInt(filters.year);
      filtered = filtered.filter(movie => movie.year === selectedYear);
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(movie => movie.rating >= minRating);
    }

    setMovies(filtered);
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      await movieService.addToWatchlist(movie.id);
      toast.success(`${movie.title} added to watchlist!`);
    } catch (err) {
      toast.error('Failed to add to watchlist');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({ genre: '', year: '', rating: '' });
  };

  const genres = [...new Set(allMovies.flatMap(movie => movie.genres || []))].sort();
  const years = [...new Set(allMovies.map(movie => movie.year))].sort((a, b) => b - a);

  if (loading) {
    return <LoadingState type="search" />;
  }

  if (error) {
    return <ErrorState message="Failed to load movies" onRetry={loadAllMovies} />;
  }

  return (
    <div className="max-w-full overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Text as="h1" className="text-3xl font-display font-bold text-white mb-2">
            Search Movies
          </Text>
          <Text className="text-gray-400">
            Find movies by title, genre, or description
          </Text>
        </div>

        <SearchAndFilterSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          genres={genres}
          years={years}
          handleClearFilters={handleClearFilters}
        />

        <MovieListDisplay
          movies={movies}
          onShowDetails={setSelectedMovie}
          onAddToWatchlist={handleAddToWatchlist}
          searchQuery={searchQuery}
          handleClearFilters={handleClearFilters}
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

export default SearchPage;