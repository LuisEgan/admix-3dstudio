const { GraphQLObjectType } = require('graphql');
const CampaignsQueries = require('./campaigns');
const UsersQueries = require('./users');

module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...CampaignsQueries,
    ...UsersQueries,
  }),
});
