const { GraphQLList } = require('graphql');
const { UsersType } = require('../Types');
const UsersModel = require('../Models/users');

module.exports = {
  users: {
    type: new GraphQLList(UsersType),
    resolve: async () => await UsersModel.find({}),
  },
};
