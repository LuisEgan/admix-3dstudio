const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
} = require('graphql');

const UsersModel = require('../Models/users');

module.exports = new GraphQLObjectType({
  name: 'UsersType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    company: { type: GraphQLString },
    isVerified: { type: GraphQLBoolean },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    accessToken: { type: GraphQLString },
    accessGroups: { type: GraphQLString },
    error: { type: GraphQLString },
    campaigns: {
      type: new GraphQLList(require('./campaigns')),
      resolve: async parentValue => await UsersModel.getCampaigns(parentValue._id),
    },
  }),
});
