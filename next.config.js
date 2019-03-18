require("./services/logger")("Init logger");
const withSass = require("@zeit/next-sass");
const withImages = require("next-images");
const Dotenv = require("dotenv-webpack");
const path = require("path");

const nextConfig = withImages(
  withSass({
    webpack(config) {
      config.plugins = config.plugins || [];

      config.plugins = [
        ...config.plugins,

        new Dotenv({
          path: path.join(__dirname, ".env"),
          systemvars: true,
          safe: true,
        }),
      ];

      return config;
    },
  }),
);

module.exports = nextConfig;
