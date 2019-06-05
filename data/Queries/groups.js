const { GraphQLList, GraphQLID, GraphQLNonNull } = require('graphql');
const { GroupsType, CampaignsType } = require('../Types');
const GroupsModel = require('../Models/groups');
const CampaignModel = require('../Models/campaigns');

module.exports = {
  groupById: {
    type: GroupsType,
    description: 'Get Groups by provided ID. Required ID argument.',
    args: {
      group: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { group }) => await GroupsModel.findById(group, { deleted: 0 }),
  },
  groups: {
    type: new GraphQLList(GroupsType),
    description:
      'Get all groups of the application. No arguments required. Return array of groups.',
    resolve: async () => await GroupsModel.find({ deleted: false }, { deleted: 0 }),
  },
  groupsByCampaign: {
    type: new GraphQLList(GroupsType),
    args: {
      campaign: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { campaign }) => await CampaignModel.getGroups(campaign),
  },
};
