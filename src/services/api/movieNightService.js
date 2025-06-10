import movieNightData from '../mockData/movieNights.json';
import { delay } from '../index';

class MovieNightService {
  constructor() {
    this.movieNights = [...movieNightData];
    this.storageKey = 'moodflix_movie_nights';
    this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      this.movieNights = JSON.parse(stored);
    }
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.movieNights));
  }

  async getAll() {
    await delay(300);
    return [...this.movieNights].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await delay(200);
    const movieNight = this.movieNights.find(mn => mn.id === id);
    if (!movieNight) {
      throw new Error('Movie night not found');
    }
    return { ...movieNight };
  }

  async create(movieNightData) {
    await delay(300);
    const newMovieNight = {
      ...movieNightData,
      id: Date.now().toString(),
      date: movieNightData.date || new Date().toISOString(),
      movieIds: movieNightData.movieIds || [],
      shareLink: movieNightData.shareLink || `moodflix.app/night/${Date.now()}`
    };
    this.movieNights.push(newMovieNight);
    this.saveToStorage();
    return { ...newMovieNight };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.movieNights.findIndex(mn => mn.id === id);
    if (index === -1) {
      throw new Error('Movie night not found');
    }
    this.movieNights[index] = { ...this.movieNights[index], ...updateData };
    this.saveToStorage();
    return { ...this.movieNights[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.movieNights.findIndex(mn => mn.id === id);
    if (index === -1) {
      throw new Error('Movie night not found');
    }
    this.movieNights.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  async addMovie(movieNightId, movieId) {
    await delay(200);
    const movieNight = this.movieNights.find(mn => mn.id === movieNightId);
    if (!movieNight) {
      throw new Error('Movie night not found');
    }
    if (!movieNight.movieIds.includes(movieId)) {
      movieNight.movieIds.push(movieId);
      this.saveToStorage();
    }
    return { ...movieNight };
  }

  async removeMovie(movieNightId, movieId) {
    await delay(200);
    const movieNight = this.movieNights.find(mn => mn.id === movieNightId);
    if (!movieNight) {
      throw new Error('Movie night not found');
    }
    movieNight.movieIds = movieNight.movieIds.filter(id => id !== movieId);
    this.saveToStorage();
    return { ...movieNight };
  }

  async getByShareLink(shareLink) {
    await delay(300);
    const movieNight = this.movieNights.find(mn => mn.shareLink === shareLink);
    if (!movieNight) {
      throw new Error('Movie night not found');
    }
    return { ...movieNight };
  }
}

export default new MovieNightService();