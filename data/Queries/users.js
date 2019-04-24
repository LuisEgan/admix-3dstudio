const { GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');
const { UsersType } = require('../Types');
const UsersModel = require('../Models/users');

module.exports = {
  userById: {
    type: UsersType,
    description: 'Get User by provided ID. Required ID argument.',
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { user }) => await UsersModel.findById(user),
  },
  users: {
    type: new GraphQLList(UsersType),
    description: 'Get all users of the application. No arguments required. Return array of users.',
    resolve: async () => await UsersModel.find({}),
  },
};
