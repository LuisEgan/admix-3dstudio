const { GraphQLNonNull, GraphQLList } = require("graphql");
const { UsersType } = require("../Types");
const Users = require("../Models/users");

module.exports = {
  allUsers: {
    type: new GraphQLList(UsersType),
    resolve() {
      return Users.find({});
    }
  },

  user: {
    type: new GraphQLNonNull(UsersType),
    resolve: async (_, args, { user: { id } }) => {
      return await Users.findById(id);
    },
  },
};
