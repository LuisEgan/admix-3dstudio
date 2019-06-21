const dev = process.env.NODE_ENV === 'development';

require('dotenv').config({ path: dev ? '.env.dev' : '.env' });

const express = require('express');
const next = require('next');
const cors = require('cors');
const mongoose = require('mongoose');

const app = next({ dev });
const handle = app.getRequestHandler();

const apollo = require('./services/apollo')(dev);

mongoose.set('debug', dev);

const mongo_uri = dev ? 'localhost:27017' : 'mongo';

mongoose
  .connect(`mongodb://${mongo_uri}/admix-studio`, {
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

  server.listen(4000, () => {
    logger.info(`🎉 Application ready at ${process.env.HOST}:${process.env.PORT}`);
    dev &&
      logger.info(
        `⚡️ GraphQL console ready at ${process.env.HOST}:${process.env.PORT}${apollo.graphqlPath}`,
      );
  });
});
