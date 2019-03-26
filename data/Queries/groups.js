const { GraphQLList } = require('graphql');
const { GroupsType } = require('../Types');
const GroupsModel = require('../Models/groups');

module.exports = {
  groups: {
    type: new GraphQLList(GroupsType),
    resolve: async () => await GroupsModel.find({}),
  },
};
