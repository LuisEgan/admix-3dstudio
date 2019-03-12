const { GraphQLString } = require('graphql');
const { PostType } = require('../Types');
const Posts = require('../Models/posts');
const { POST_ADDED } = require('../actions');
const pubSub = require('../subscription');

module.exports = {
  createArticle: {
    type: PostType,
    args: {
      title: { type: GraphQLString },
      content: { type: GraphQLString },
    },
    resolve: async (_, { title, content }) => {
      const postAdded = await Posts.create({ title, content });
      pubSub.publish(POST_ADDED, { postAdded });
      return postAdded;
    },
  },
};
