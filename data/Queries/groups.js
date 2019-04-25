const { GraphQLList, GraphQLID, GraphQLNonNull } = require('graphql');
const { GroupsType } = require('../Types');
const GroupsModel = require('../Models/groups');

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
};
