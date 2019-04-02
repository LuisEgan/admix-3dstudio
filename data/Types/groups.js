const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require('graphql');

const CampaignsModel = require('../Models/campaigns');
const UsersModel = require('../Models/users');
const CreativesModel = require('../Models/creatives');
const UsersType = require('./users');
const CampaignsType = require('./campaigns');
const CreativesType = require('./creatives');

module.exports = new GraphQLObjectType({
  name: 'GroupsType',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    state: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    user: {
      type: UsersType,
      resolve: async ({ user }) =>
        await UsersModel.findById(user).populate('user'),
    },
    campaign: {
      type: CampaignsType,
      resolve: async ({ campaign }) =>
        await CampaignsModel.findById(campaign).populate('campaign'),
    },
    creatives: {
      type: new GraphQLList(CreativesType),
      resolve: async ({ creatives }) =>
        await CreativesModel.find({ _id: { $in: creatives } }).populate(
          'creatives',
        ),
    },
  },
});
