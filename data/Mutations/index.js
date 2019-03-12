const { GraphQLObjectType } = require("graphql");
const campaigns = require("./campaigns");
const creatives = require("./creatives");
const groups = require("./groups");
const users = require("./users");

module.exports = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...campaigns,
    ...creatives,
    ...groups,
    ...users,
  }),
});
