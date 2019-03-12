const { GraphQLObjectType } = require('graphql');
const posts = require('./posts');

module.exports = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    ...posts,
  }),
});
