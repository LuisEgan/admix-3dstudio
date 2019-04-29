const { GraphQLList, GraphQLID, GraphQLString, GraphQLNonNull } = require('graphql');
const convert = require('xml-js');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const request = require('request');

const sendToUnityServer = body =>
  new Promise((resolve, reject) => {
    return request.post({ url: '54.161.80.239:5050', form: body }, function(error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      if (error) reject(err);
      return resolve(response);
    });
  });

const { CreativesType } = require('../Types');
const CreativesModel = require('../Models/creatives');

const zip = new JSZip();
const options = { compact: true, ignoreComment: true, spaces: 4 };

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
  creativeById: {
    type: CreativesType,
    description: 'Get creative by provided ID. Required argument ID. Return Creative object.',
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (_, { creative }) => await CreativesModel.findById(creative, { deleted: 0 }),
  },
  creatives: {
    type: new GraphQLList(CreativesType),
    description: 'Get all creative of the app. No required arguments. Return array of creative.',
    resolve: async () => await CreativesModel.find({ deleted: false }, { deleted: 0 }),
  },
  creativeXML: {
    type: GraphQLString,
    description:
      'Get ZIP archive by provided creative ID. Required ID argument. Response url to download archive.',
    args: {
      creative: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async ({ creative }) => {
      // @TODO Need response from Unity server

      const { uploads } = CreativesModel.findById(creative);
      const data = await sendToUnityServer(uploads);
      // const firstJSON = await readFile('test.json');
      // const secondJSON = await readFile('test2.json');

      // zip.file("test1.xml", convert.json2xml(firstJSON, options));
      // zip.file("test2.xml", convert.json2xml(secondJSON, options));

      return await ZIPFiles();
    },
  },
};
