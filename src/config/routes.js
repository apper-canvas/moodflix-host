import HomePage from '@/components/pages/HomePage';
import DiscoverPage from '@/components/pages/DiscoverPage';
import WatchlistPage from '@/components/pages/WatchlistPage';
import MovieNightsPage from '@/components/pages/MovieNightsPage';
import SearchPage from '@/components/pages/SearchPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
icon: 'Home',
    component: HomePage
  },
  discover: {
    id: 'discover',
    label: 'Discover',
    path: '/discover',
    icon: 'Compass',
icon: 'Compass',
    component: DiscoverPage
  },
  watchlist: {
    id: 'watchlist',
    label: 'Watchlist',
    path: '/watchlist',
    icon: 'Bookmark',
icon: 'Bookmark',
    component: WatchlistPage
  },
  movieNights: {
    id: 'movieNights',
    label: 'Movie Nights',
    path: '/movie-nights',
    icon: 'Users',
icon: 'Users',
    component: MovieNightsPage
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
icon: 'Search',
    component: SearchPage
  }
};

export const routeArray = Object.values(routes);