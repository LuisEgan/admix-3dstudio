const { GraphQLList, GraphQLID } = require('graphql');
const { GroupsType } = require('../Types');
const GroupsModel = require('../Models/groups');

module.exports = {
  groupById: {
    type: GroupsType,
    args: {
      group: { type: GraphQLID },
    },
    resolve: async (_, { group }) => await GroupsModel.findById(group),
  },
  groups: {
    type: new GraphQLList(GroupsType),
    resolve: async () => await GroupsModel.find({}),
  },
};
