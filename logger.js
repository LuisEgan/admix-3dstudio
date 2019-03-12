module.exports = message => {
  if (!process.browser) {
    const { createLogger, format, transports } = require('winston');
    const {
      combine,
      errors,
      colorize,
      json,
      timestamp,
      splat,
      simple,
    } = format;

    global.logger = createLogger({
      level: 'info',
      format: combine(
        timestamp({
          format: 'DD-MM-YYYY HH:mm:ss',
        }),
        errors({ stack: true }),
        splat(),
        json(),
      ),
      defaultMeta: { service: '3d-studio' },
      transports: [
        new transports.File({ filename: 'studio-error.log', level: 'error' }),
        new transports.File({ filename: 'studio-combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      logger.add(
        new transports.Console({
          format: combine(colorize(), simple()),
        }),
      );
    }
    return console.log(message);
  }

  if (message.stack) {
    return console.error(message);
  }
  return console.info(
    '%c LOGGER: ',
    'background: #222; color: #bada55',
    message,
  );
};
