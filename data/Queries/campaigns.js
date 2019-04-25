const { GraphQLList, GraphQLID, GraphQLString, GraphQLNonNull } = require('graphql');
const convert = require('xml-js');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const { CampaignsType } = require('../Types');
const CampaignsModel = require('../Models/campaigns');

const zip = new JSZip();
const options = { compact: true, ignoreComment: true, spaces: 4 };

// @TODO Delete this two files
// 'test.json'
// 'test2.json'

const readFile = name =>
  new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, name), 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

const ZIPFiles = () => {
  const filePath = path.join(__dirname, '..', '..', 'uploads', 'output.zip');
  return new Promise((resolve, reject) => {
    zip
      .generateNodeStream({ streamFiles: true })
      .pipe(fs.createWriteStream(filePath))
      .on('error', error => reject(error))
      .on('finish', () => resolve(filePath));
  });
};

module.exports = {
  campaignById: {
    type: CampaignsType,
    description: 'Get Campaign by provided ID. Required ID argument.',
    args: {
      campaign: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { campaign }) => await CampaignsModel.findById(campaign, { deleted: 0 }),
  },
  campaignsByUser: {
    type: new GraphQLList(CampaignsType),
    description: 'Get Campaign by provided UserID. Required UserID argument.',
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { user }) => await CampaignsModel.find({ user }, { deleted: 0 }),
  },
  // @TODO Need to more functionality
  campaignXML: {
    type: GraphQLString,
    description:
      'Get ZIP archive by provided campaign ID. Required ID argument. Response url to download archive.',
    args: {
      campaign: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async () => {
      const firstJSON = await readFile('test.json');
      const secondJSON = await readFile('test2.json');

      zip.file('test1.xml', convert.json2xml(firstJSON, options));
      zip.file('test2.xml', convert.json2xml(secondJSON, options));

      return await ZIPFiles();
    },
  },
  campaigns: {
    description:
      'Get all campaigns of the application. No arguments required. Return array of campaigns.',
    type: new GraphQLList(CampaignsType),
    resolve: async () => await CampaignsModel.find({ deleted: false }, { deleted: 0 }),
  },
};
