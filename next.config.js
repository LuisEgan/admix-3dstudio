const withSass = require("@zeit/next-sass");
const withImages = require("next-images");

const nextConfig = withSass(withImages());

module.exports = nextConfig;
