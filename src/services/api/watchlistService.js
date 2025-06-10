import watchlistData from '../mockData/watchlists.json';
import { delay } from '../index';

class WatchlistService {
  constructor() {
    this.watchlists = [...watchlistData];
    this.storageKey = 'moodflix_watchlists';
    this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      this.watchlists = JSON.parse(stored);
    }
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.watchlists));
  }

  async getAll() {
    await delay(300);
    return [...this.watchlists];
  }

  async getById(id) {
    await delay(200);
    const watchlist = this.watchlists.find(w => w.id === id);
    if (!watchlist) {
      throw new Error('Watchlist not found');
    }
    return { ...watchlist };
  }

  async create(watchlistData) {
    await delay(300);
    const newWatchlist = {
      ...watchlistData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      movieIds: watchlistData.movieIds || []
    };
    this.watchlists.push(newWatchlist);
    this.saveToStorage();
    return { ...newWatchlist };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.watchlists.findIndex(w => w.id === id);
    if (index === -1) {
      throw new Error('Watchlist not found');
    }
    this.watchlists[index] = { ...this.watchlists[index], ...updateData };
    this.saveToStorage();
    return { ...this.watchlists[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.watchlists.findIndex(w => w.id === id);
    if (index === -1) {
      throw new Error('Watchlist not found');
    }
    this.watchlists.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  async addMovie(watchlistId, movieId) {
    await delay(200);
    const watchlist = this.watchlists.find(w => w.id === watchlistId);
    if (!watchlist) {
      throw new Error('Watchlist not found');
    }
    if (!watchlist.movieIds.includes(movieId)) {
      watchlist.movieIds.push(movieId);
      this.saveToStorage();
    }
    return { ...watchlist };
  }

  async removeMovie(movieId) {
    await delay(200);
    this.watchlists.forEach(watchlist => {
      watchlist.movieIds = watchlist.movieIds.filter(id => id !== movieId);
    });
    this.saveToStorage();
    return true;
  }

  async getByCategory(category) {
    await delay(300);
    const filtered = this.watchlists.filter(w => w.category === category);
    return [...filtered];
  }
}

export default new WatchlistService();