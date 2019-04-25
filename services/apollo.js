const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const { ApolloServer } = require('apollo-server-express');
const schema = require('../data/schema');

const SECRET = process.env.SERVER_TOKEN_SECRET;

function createContext({ req }) {
  let token = '';
  let user = {};

  if (req.headers.cookie) {
    token = cookie.parse(req.headers.cookie).token;
  } else {
    token = req.headers.authorization;
  }
  try {
    user = jwt.verify(token, SECRET);
  } catch (err) {
    logger.warn(err);
  }
  return { user };
}

module.exports = dev =>
  new ApolloServer({
    schema,
    playground: dev,
    context: createContext,
    uploads: {
      maxFileSize: 10000000, // 10 MB
      maxFiles: 20,
    },
  });
