const { GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');
const { UsersType } = require('../Types');
const UsersModel = require('../Models/users');

module.exports = {
  userById: {
    type: UsersType,
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { user }) => await UsersModel.findById(user),
  },
  users: {
    type: new GraphQLList(UsersType),
    resolve: async () => await UsersModel.find({}),
  },
};
