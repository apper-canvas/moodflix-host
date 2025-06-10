import Home from '../pages/Home';
import Discover from '../pages/Discover';
import Watchlist from '../pages/Watchlist';
import MovieNights from '../pages/MovieNights';
import Search from '../pages/Search';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  discover: {
    id: 'discover',
    label: 'Discover',
    path: '/discover',
    icon: 'Compass',
    component: Discover
  },
  watchlist: {
    id: 'watchlist',
    label: 'Watchlist',
    path: '/watchlist',
    icon: 'Bookmark',
    component: Watchlist
  },
  movieNights: {
    id: 'movieNights',
    label: 'Movie Nights',
    path: '/movie-nights',
    icon: 'Users',
    component: MovieNights
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search
  }
};

export const routeArray = Object.values(routes);