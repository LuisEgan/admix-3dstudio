const { GraphQLList, GraphQLID, GraphQLNonNull } = require('graphql');
const { GroupsType, CampaignsType } = require('../Types');
const GroupsModel = require('../Models/groups');
const CampaignModel = require('../Models/campaigns');

module.exports = {
  groupById: {
    type: GroupsType,
    args: {
      group: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { group }) => await GroupsModel.findById(group),
  },
  groups: {
    type: new GraphQLList(GroupsType),
    resolve: async () => await GroupsModel.find({}),
  },
  groupsByCampaign: {
    type: new GraphQLList(GroupsType),
    args: {
      campaign: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { campaign }) => await CampaignModel.getGroups(campaign),
  },
};
