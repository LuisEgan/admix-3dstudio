require('./services/logger')('Init logger');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const Dotenv = require('dotenv-webpack');
const path = require('path');

const resolveAbsolutePath = (config, currentPath) =>
  (config.resolve.alias[currentPath] = path.join(__dirname, currentPath));

const dev = process.env.NODE_ENV === 'development';

const nextConfig = withImages(
  withSass(
    withCSS({
      webpack(config) {
        resolveAbsolutePath(config, 'components');
        resolveAbsolutePath(config, 'pages');
        resolveAbsolutePath(config, 'lib');
        resolveAbsolutePath(config, 'themes');
        resolveAbsolutePath(config, 'queries');
        resolveAbsolutePath(config, 'mutations');
        resolveAbsolutePath(config, 'inputs');
        resolveAbsolutePath(config, 'data');

        config.plugins = config.plugins || [];

        config.plugins = [
          ...config.plugins,

          new Dotenv({
            path: path.join(__dirname, dev ? '.env.dev' : '.env'),
            systemvars: true,
            safe: true,
          }),
        ];

        return config;
      },
    }),
  ),
);

module.exports = {
  // target: 'serverless',
  ...nextConfig,
};
