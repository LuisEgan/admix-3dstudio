module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 4000,
  HOST: process.env.HOST || "http://localhost",
  WS_HOST: process.env.WS_HOST || "ws://localhost",
  dev: process.env.NODE_ENV !== "production",
};
