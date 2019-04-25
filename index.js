require('dotenv').config();

const express = require('express');
const next = require('next');
const cors = require('cors');
const mongoose = require('mongoose');

const { PORT, HOST, dev } = require('./config');

const app = next({ dev });
const handle = app.getRequestHandler();

const apollo = require('./services/apollo')(dev);

mongoose.set('debug', dev);

mongoose
  .connect('mongodb://localhost:27017/admix-studio', {
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then(() => logger.info('🌈 Connected to DB'))
  .catch(error => logger.error('error', error));

app.prepare().then(() => {
  const server = express();

  server.use(cors());

  apollo.applyMiddleware({ app: server });

  server.get('*', (req, res) => handle(req, res));

  server.listen(PORT, () => {
    logger.info(`🎉 Application ready at ${HOST}:${PORT}`);
    dev &&
      logger.info(
        `⚡️ GraphQL console ready at ${HOST}:${PORT}${apollo.graphqlPath}`,
      );
  });
});
