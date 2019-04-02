const { GraphQLObjectType } = require('graphql');
const CampaignsQueries = require('./campaigns');
const CreativesQueries = require('./creatives');
const GroupsQueries = require('./groups');
const UsersQueries = require('./users');

module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...CampaignsQueries,
    ...CreativesQueries,
    ...GroupsQueries,
    ...UsersQueries,
  },
});
