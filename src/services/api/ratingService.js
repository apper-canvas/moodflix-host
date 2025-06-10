import { delay } from '../index';

class RatingService {
  constructor() {
    this.storageKey = 'moodflix_ratings';
    this.ratings = this.loadRatings();
  }

  loadRatings() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading ratings from localStorage:', error);
      return [];
    }
  }

  saveRatings() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.ratings));
    } catch (error) {
      console.error('Error saving ratings to localStorage:', error);
      throw new Error('Failed to save rating');
    }
  }

  async getAll() {
    await delay(200);
    return [...this.ratings];
  }

  async getById(id) {
    await delay(200);
    const rating = this.ratings.find(r => r.id === id);
    if (!rating) {
      throw new Error('Rating not found');
    }
    return { ...rating };
  }

  async getByMovieId(movieId) {
    await delay(300);
    const movieRatings = this.ratings.filter(r => r.movieId === movieId);
    return [...movieRatings];
  }

  async getByUserId(userId) {
    await delay(300);
    const userRatings = this.ratings.filter(r => r.userId === userId);
    return [...userRatings];
  }

  async getUserRatingForMovie(movieId, userId) {
    await delay(200);
    const rating = this.ratings.find(r => r.movieId === movieId && r.userId === userId);
    return rating ? { ...rating } : null;
  }

  async getAverageRating(movieId) {
    await delay(200);
    const movieRatings = this.ratings.filter(r => r.movieId === movieId);
    
    if (movieRatings.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = movieRatings.reduce((sum, r) => sum + r.rating, 0);
    const average = Math.round((total / movieRatings.length) * 10) / 10; // Round to 1 decimal

    return { 
      average, 
      count: movieRatings.length 
    };
  }

  async create(ratingData) {
    await delay(300);

    // Validate required fields
    if (!ratingData.movieId || !ratingData.userId || !ratingData.rating) {
      throw new Error('Missing required fields: movieId, userId, and rating are required');
    }

    if (ratingData.rating < 1 || ratingData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if user already rated this movie
    const existingIndex = this.ratings.findIndex(
      r => r.movieId === ratingData.movieId && r.userId === ratingData.userId
    );

    const newRating = {
      id: Date.now().toString(),
      movieId: ratingData.movieId,
      userId: ratingData.userId,
      rating: ratingData.rating,
      review: ratingData.review || '',
      timestamp: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      // Update existing rating
      newRating.id = this.ratings[existingIndex].id;
      this.ratings[existingIndex] = newRating;
    } else {
      // Add new rating
      this.ratings.push(newRating);
    }

    this.saveRatings();
    return { ...newRating };
  }

  async update(id, updateData) {
    await delay(300);

    const index = this.ratings.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Rating not found');
    }

    // Validate rating if provided
    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const updatedRating = {
      ...this.ratings[index],
      ...updateData,
      timestamp: new Date().toISOString()
    };

    this.ratings[index] = updatedRating;
    this.saveRatings();
    
    return { ...updatedRating };
  }

  async delete(id) {
    await delay(200);

    const index = this.ratings.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Rating not found');
    }

    this.ratings.splice(index, 1);
    this.saveRatings();
    
    return true;
  }

  async deleteByMovieAndUser(movieId, userId) {
    await delay(200);

    const index = this.ratings.findIndex(r => r.movieId === movieId && r.userId === userId);
    if (index === -1) {
      throw new Error('Rating not found');
    }

    this.ratings.splice(index, 1);
    this.saveRatings();
    
    return true;
  }

  // Get ratings with pagination for admin/display purposes
  async getPaginated(page = 1, limit = 10, sortBy = 'timestamp', sortOrder = 'desc') {
    await delay(300);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    let sortedRatings = [...this.ratings];

    // Sort ratings
    sortedRatings.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'rating') {
        comparison = a.rating - b.rating;
      } else if (sortBy === 'timestamp') {
        comparison = new Date(a.timestamp) - new Date(b.timestamp);
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    const paginatedRatings = sortedRatings.slice(startIndex, endIndex);

    return {
      ratings: paginatedRatings,
      pagination: {
        page,
        limit,
        total: this.ratings.length,
        totalPages: Math.ceil(this.ratings.length / limit)
      }
    };
  }

  // Get movie statistics
  async getMovieStats(movieId) {
    await delay(200);

    const movieRatings = this.ratings.filter(r => r.movieId === movieId);
    
    if (movieRatings.length === 0) {
      return {
        average: 0,
        count: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const total = movieRatings.reduce((sum, r) => sum + r.rating, 0);
    const average = Math.round((total / movieRatings.length) * 10) / 10;

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    movieRatings.forEach(r => {
      distribution[r.rating]++;
    });

    return {
      average,
      count: movieRatings.length,
      distribution
    };
  }
}

export default new RatingService();