const { GraphQLString, GraphQLList } = require('graphql');
const { PostType } = require('../Types');
const Posts = require('../Models/posts');

module.exports = {
  hello: {
    type: GraphQLString,
    resolve: () => 'Hello World!',
  },
  allPosts: {
    type: new GraphQLList(PostType),
    resolve: async () => await Posts.find({}),
  },
};
