const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = require('graphql');

const UsersModel = require('../Models/users');
const GroupsModel = require('../Models/groups');
const UsersType = require('./users');

module.exports = new GraphQLObjectType({
  name: 'CreativesType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    sourceURL: { type: GraphQLString },
    thumbURL: { type: GraphQLString },
    format: { type: GraphQLString },
    state: { type: GraphQLString },
    size: { type: GraphQLString },
    IAB: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    user: {
      type: UsersType,
      resolve: async ({ user }) =>
        await UsersModel.findById(user).populate('user'),
    },
    groups: {
      type: new GraphQLList(require('./groups')),
      resolve: async ({ groups }) =>
        await GroupsModel.find({ _id: { $in: groups } }).populate('groups'),
    },
  }),
});
