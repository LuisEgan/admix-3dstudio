require('./services/logger')('Init logger');

const Dotenv = require('dotenv-webpack');
const path = require('path');

const withSass = require('@zeit/next-sass');

module.exports = withSass({
  webpack(config) {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
        safe: true,
      }),
    ];

    return config;
  },
});
