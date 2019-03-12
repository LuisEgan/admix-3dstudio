const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

module.exports = PostType;
