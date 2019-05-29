const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { GraphQLNonNull, GraphQLString } = require('graphql');

const { UsersType } = require('../Types');
const Users = require('../Models/users');

const SECRET = process.env.SERVER_TOKEN_SECRET;
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE;

module.exports = {
  createUser: {
    type: UsersType,
    description:
      'This mutation helps you to create new user. You should to provide `Email`, `Name` and `Password` arguments to create this user. Resolve new user object.',
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      company: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      try {
        return await Users.create({ ...args });
      } catch (e) {
        throw new AuthenticationError('User already exist');
      }
    },
  },
  loginUser: {
    type: UsersType,
    description:
      'This mutation helps you to login existing user. You should to provide `Email` and `Password` arguments to login user. Resolve JWT token.',
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, { email, password }) => {
      const user = await Users.findOne({ email });
      console.log('user: ', user);
      const samePasswords = await bcrypt.compare(password, user.password);
      let accessToken = null;
      if (samePasswords) {
        accessToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, {
          expiresIn: TOKEN_EXPIRE,
        });
      }
      return { accessToken, email, name: user.name, id: user.id };
    },
  },
};
