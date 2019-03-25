const { GraphQLString, GraphQLID, GraphQLNonNull } = require('graphql');
const { GroupsType } = require('../Types');
const GroupsModel = require('../Models/groups');

module.exports = {
  createCreative: {
    type: GroupsType,
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      campaign: { type: new GraphQLNonNull(GraphQLID) },
      description: { type: GraphQLString },
    },
    resolve: async (parentValue, args) => await GroupsModel.create({ ...args }),
  },
};
