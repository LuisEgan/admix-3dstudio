require("dotenv").config();
require("./logger")("Init logger");

const express = require("express");
const next = require("next");
const http = require("http");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const schema = require("./data/schema");

const { PORT, HOST, WS_HOST, dev } = require("./config");

const app = next({ dev });
const handle = app.getRequestHandler();

const apollo = new ApolloServer({ schema, playground: dev });

mongoose
  .connect("mongodb://localhost:27017/admix-studio", {
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then(() => logger.info("🌈 Connected to DB"))
  .catch(error => logger.error("error", error));

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);

  apollo.applyMiddleware({ app: server });
  apollo.installSubscriptionHandlers(httpServer);

  server.get("*", (req, res) => handle(req, res));

  httpServer.listen(PORT, () => {
    logger.info(`🎉 Application ready at ${HOST}:${PORT}`);
    logger.info(
      `🚀 Subscriptions ready at ${WS_HOST}:${PORT}${apollo.subscriptionsPath}`,
    );
    dev &&
      logger.info(
        `⚡️ GraphQL console ready at ${HOST}:${PORT}${apollo.graphqlPath}`,
      );
  });
});
