import movieData from '../mockData/movies.json';
import { delay } from '../index';

class MovieService {
  constructor() {
    this.movies = [...movieData];
    this.watchlist = JSON.parse(localStorage.getItem('moodflix_watchlist') || '[]');
  }

  async getAll() {
    await delay(300);
    return [...this.movies];
  }

  async getById(id) {
    await delay(200);
    const movie = this.movies.find(m => m.id === id);
    if (!movie) {
      throw new Error('Movie not found');
    }
    return { ...movie };
  }

  async getByMood(mood) {
    await delay(400);
    const filtered = this.movies.filter(movie => 
      movie.moods && movie.moods.includes(mood)
    );
    return [...filtered];
  }

  async getByGenre(genre) {
    await delay(300);
    const filtered = this.movies.filter(movie => 
      movie.genres && movie.genres.includes(genre)
    );
    return [...filtered];
  }

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    const filtered = this.movies.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.synopsis.toLowerCase().includes(searchTerm) ||
      (movie.genres && movie.genres.some(genre => 
        genre.toLowerCase().includes(searchTerm)
      ))
    );
    return [...filtered];
  }

  async addToWatchlist(movieId) {
    await delay(200);
    if (!this.watchlist.includes(movieId)) {
      this.watchlist.push(movieId);
      localStorage.setItem('moodflix_watchlist', JSON.stringify(this.watchlist));
    }
    return true;
  }

  async removeFromWatchlist(movieId) {
    await delay(200);
    this.watchlist = this.watchlist.filter(id => id !== movieId);
    localStorage.setItem('moodflix_watchlist', JSON.stringify(this.watchlist));
    return true;
  }

  async getWatchlistMovies() {
    await delay(300);
    const watchlistMovies = this.movies.filter(movie => 
      this.watchlist.includes(movie.id)
    );
    return [...watchlistMovies];
  }

  async create(movieData) {
    await delay(300);
    const newMovie = {
      ...movieData,
      id: Date.now().toString()
    };
    this.movies.push(newMovie);
    return { ...newMovie };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.movies.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Movie not found');
    }
    this.movies[index] = { ...this.movies[index], ...updateData };
    return { ...this.movies[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.movies.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Movie not found');
    }
    this.movies.splice(index, 1);
    return true;
  }
}

export default new MovieService();