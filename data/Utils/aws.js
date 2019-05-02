const path = require('path');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = ({ stream, filename, folder }) => {
  const fileExt = path.extname(filename);
  const { name } = path.parse(filename);
  let keyPath;
  const timestamp = Date.now();
  if (folder) {
    keyPath = `public/${folder}/${name}_${timestamp}${fileExt}`;
  } else {
    keyPath = `public/action_${timestamp}/${name}_${timestamp}${fileExt}`;
  }

  const params = {
    Bucket: 'adv-studio-cstore',
    Key: keyPath,
    Body: stream,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};
