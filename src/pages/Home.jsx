import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'Heart',
      title: 'Mood-Based Discovery',
      description: 'Find movies that match exactly how you\'re feeling right now',
      action: () => navigate('/discover')
    },
    {
      icon: 'Bookmark',
      title: 'Personal Watchlist',
      description: 'Save movies you want to watch and organize them your way',
      action: () => navigate('/watchlist')
    },
    {
      icon: 'Users',
      title: 'Movie Nights',
      description: 'Plan themed movie nights and share them with friends',
      action: () => navigate('/movie-nights')
    }
  ];

  return (
    <div className="min-h-full bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Movie Match
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover movies that match your mood, create watchlists, and plan amazing movie nights with friends
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/discover')}
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Discovering
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/search')}
              className="px-8 py-4 bg-surface-800 text-white font-semibold rounded-xl hover:bg-surface-700 transition-colors duration-200"
            >
              Search Movies
            </motion.button>
          </motion.div>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Everything You Need for Movie Discovery
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              From mood-based recommendations to social movie planning, we've got your entertainment covered
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-surface-800 rounded-2xl p-8 text-center cursor-pointer group hover:bg-surface-700 transition-all duration-300"
                onClick={feature.action}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <ApperIcon name={feature.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-6 bg-surface-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center border border-primary/20"
          >
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              Ready to Find Your Next Favorite Movie?
            </h3>
            <p className="text-gray-300 mb-6">
              Start by telling us how you're feeling, and we'll find the perfect movies for your mood
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/discover')}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors duration-200"
            >
              <ApperIcon name="Compass" className="w-5 h-5" />
              <span>Discover Movies</span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;