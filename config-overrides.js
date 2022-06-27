const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require('path');

module.exports = (config, env) => {
  if (env === 'production') {
    config.plugins = config.plugins.concat([
      new PrerenderSPAPlugin({
        routes: [
          '/home-v1/',
          '/home-v1/faq',
          '/home-v1/brand',
          '/home-v1/ambassador',
          '/home-v1/community',
          '/home-v1/blog',
          '/home-v1/media',
          '/home-v1/reports',
          '/home-v1/events',
          '/home-v1/videos',
          '/home-v1/news',
          '/home-v1/tech',
          '/home-v1/economic_model',
          '/home-v1/404'
        ],
        staticDir: path.join(__dirname, 'build'),
      }),
    ]);
  }

  return config;
};