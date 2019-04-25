const { GraphQLObjectType } = require('graphql');
const CampaignsQueries = require('./campaigns');
const CreativesQueries = require('./creatives');
const GroupsQueries = require('./groups');
const UsersQueries = require('./users');

module.exports = new GraphQLObjectType({
  name: 'Query',
  description: 'Queries allows you to get all info from database.',
  fields: {
    ...CampaignsQueries,
    ...CreativesQueries,
    ...GroupsQueries,
    ...UsersQueries,
  },
});
