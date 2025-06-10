import movieService from './api/movieService';
import watchlistService from './api/watchlistService';
import movieNightService from './api/movieNightService';
import ratingService from './api/ratingService';

// Utility function for simulating network delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export {
  movieService,
  watchlistService,
  movieNightService,
  ratingService,
  delay
};