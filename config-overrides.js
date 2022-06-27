const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require('path');

module.exports = (config, env) => {
  if (env === 'production') {
    config.plugins = config.plugins.concat([
      new PrerenderSPAPlugin({
        routes: [
          '/legacy-home/',
          '/legacy-home/faq',
          '/legacy-home/brand',
          '/legacy-home/ambassador',
          '/legacy-home/community',
          '/legacy-home/blog',
          '/legacy-home/media',
          '/legacy-home/reports',
          '/legacy-home/events',
          '/legacy-home/videos',
          '/legacy-home/news',
          '/legacy-home/tech',
          '/legacy-home/economic_model',
          '/legacy-home/404'
        ],
        staticDir: path.join(__dirname, 'build'),
      }),
    ]);
  }

  return config;
};