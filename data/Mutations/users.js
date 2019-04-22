const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { GraphQLNonNull, GraphQLString } = require('graphql');

const { UsersType, JWTType } = require('../Types');
const Users = require('../Models/users');

const SECRET = process.env.SERVER_TOKEN_SECRET;
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE;

module.exports = {
  createUser: {
    type: UsersType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      company: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      return await Users.create({ ...args });
    },
  },
  loginUser: {
    type: UsersType,
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
