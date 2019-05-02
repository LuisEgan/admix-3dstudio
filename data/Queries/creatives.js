const { GraphQLList, GraphQLID, GraphQLString, GraphQLNonNull } = require('graphql');
const convert = require('xml-js');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const request = require('request');
const s3Upload = require('../Utils/aws');

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

// const zip = new JSZip();
const options = { compact: true, ignoreComment: true, spaces: 4 };

const createXRAIDFile = awsResponse =>
  new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'xraid.xml'), 'utf8', (err, xml) => {
      if (err) return reject(err);
      const convertedXMLXRAID = convert.xml2js(xml, options);
      const { XRAIDFiles } = convertedXMLXRAID.XRAID.Ad.InLine.Creatives.Creative;
      XRAIDFiles.XRAIDFile._attributes.id = awsResponse.ETag.split('"').join('');
      XRAIDFiles.XRAIDFile._text = awsResponse.Location;
      const xraidXML = convert.js2xml(convertedXMLXRAID, options);
      resolve({
        xml: xraidXML,
        folder: path.parse(path.parse(awsResponse.key).dir).base,
      });
    });
  });

const createXMLFiles = serverData =>
  new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'behavior.xml'), 'utf8', (err, xml) => {
      if (err) reject(err);
      const convertedXMLTemplate = convert.xml2js(xml, options);
      convertedXMLTemplate.XRAID.Unit.BundleUrl = serverData.model_bundle.url;
      const behaviorXML = convert.js2xml(convertedXMLTemplate, options);
      s3Upload({ filename: 'behavior.xml', stream: behaviorXML })
        .then(res => createXRAIDFile(res))
        .then(res => s3Upload({ filename: 'xraid.xml', stream: res.xml, folder: res.folder }))
        .then(res => resolve(res.Location))
        .catch(err => reject(err));
    });
  });

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
      return await createXMLFiles(data);
    },
  },
};
