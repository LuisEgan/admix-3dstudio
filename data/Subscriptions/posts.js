const { PostType } = require('../Types');
const { POST_ADDED } = require('../actions');
const pubSub = require('../subscription');

module.exports = {
  postAdded: {
    type: PostType,
    resolve: ({ postAdded: { _id, title, content } }) => {
      return {
        id: _id,
        title,
        content,
      };
    },
    subscribe: () => pubSub.asyncIterator([POST_ADDED]),
  },
};
