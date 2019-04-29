const { GraphQLList, GraphQLID, GraphQLString, GraphQLNonNull } = require('graphql');
const convert = require('xml-js');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const request = require('request');

const sendToUnityServer = body =>
  new Promise((resolve, reject) => {
    return request.post(
      { url: 'http://54.161.80.239:5050/', form: body },
      (error, response, body) => {
        if (error) return reject(error);
        return resolve(body);
      },
    );
  });

const { CreativesType } = require('../Types');
const CreativesModel = require('../Models/creatives');

const zip = new JSZip();

const createXMLFiles = serverData =>
  new Promise((resolve, reject) => {
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    fs.readFile(path.join(__dirname, 'behavior.xml'), 'utf8', (err, xml) => {
      if (err) reject(err);
      const convertedXMLTemplate = convert.xml2js(xml, options);
      for (item in serverData) {
        convertedXMLTemplate.XRAID.Unit.BundleUrl = serverData[item].url;
        zip.file(`${item}.xml`, convert.js2xml(convertedXMLTemplate, options));
      }
      resolve(true);
    });
  });

const ZIPFiles = () => {
  const filePath = path.join(__dirname, '..', '..', 'uploads', 'bundle.zip');
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
    resolve: async (_, { creative }) => {
      // @TODO Need to test and sync

      const { uploads } = await CreativesModel.findById(creative);
      const data = await sendToUnityServer(uploads);
      await createXMLFiles(data);
      return await ZIPFiles();
    },
  },
};
