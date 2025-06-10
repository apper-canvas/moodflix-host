import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-surface-900 border-b border-surface-700 z-40">
        <div className="h-full flex items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Film" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-white">MoodFlix</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {routeArray.map(route => (
              <NavLink
                key={route.id}
                to={route.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(route.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:text-white hover:bg-surface-700'
                }`}
              >
                <ApperIcon name={route.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-700 text-gray-300"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-800 border-t border-surface-700"
          >
            <nav className="px-4 py-3 space-y-2">
              {routeArray.map(route => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive(route.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:text-white hover:bg-surface-700'
                  }`}
                >
                  <ApperIcon name={route.icon} className="w-5 h-5" />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-full"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden bg-surface-900 border-t border-surface-700 z-40">
        <nav className="flex">
          {routeArray.slice(1, 5).map(route => (
            <NavLink
              key={route.id}
              to={route.path}
              className={`flex-1 flex flex-col items-center py-2 px-1 transition-all duration-200 ${
                isActive(route.path)
                  ? 'text-primary'
                  : 'text-gray-400'
              }`}
            >
              <ApperIcon name={route.icon} className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{route.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;