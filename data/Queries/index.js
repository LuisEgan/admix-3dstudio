const { GraphQLObjectType } = require('graphql');
const posts = require('./posts');

module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...posts,
  }),
});
