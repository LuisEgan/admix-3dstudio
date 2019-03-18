const { GraphQLNonNull } = require('graphql');
const { UsersType } = require('../Types');
const Users = require('../Models/users');

module.exports = {
  user: {
    type: new GraphQLNonNull(UsersType),
    resolve: async (_, args, { user: { id } }) => {
      return await Users.findById(id);
    },
  },
};
