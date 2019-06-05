const { GraphQLList, GraphQLID, GraphQLNonNull } = require('graphql');
const { CampaignsType } = require('../Types');
const CampaignsModel = require('../Models/campaigns');

module.exports = {
  campaignById: {
    type: CampaignsType,
    description: 'Get Campaign by provided ID. Required ID argument.',
    args: {
      campaign: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { campaign }) => await CampaignsModel.findById(campaign, { deleted: 0 }),
  },
  campaignsByUser: {
    type: new GraphQLList(CampaignsType),
    description: 'Get Campaign by provided UserID. Required UserID argument.',
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { user }) => await CampaignsModel.find({ user }, { deleted: 0 }),
  },
  campaigns: {
    description:
      'Get all campaigns of the application. No arguments required. Return array of campaigns.',
    type: new GraphQLList(CampaignsType),
    resolve: async () => await CampaignsModel.find({ deleted: false }, { deleted: 0 }),
  },
};
