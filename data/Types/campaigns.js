const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

const UserModel = require('../Models/users');
const UsersType = require('./users');

module.exports = new GraphQLObjectType({
  name: 'CampaignsType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    state: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    user: {
      type: UsersType,
      resolve: async ({ user }) =>
        await UserModel.findById(user).populate('user'),
    },
  }),
});
