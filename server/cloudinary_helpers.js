const cloudinary = require('cloudinary').v2;

const { cloudinaryKeys } = require('../config/keys.js');

cloudinary.config({
  cloud_name: 'dx4mrqtne',
  api_key: cloudinaryKeys.apiKey,
  api_secret: cloudinaryKeys.apiSecret
});

const createSignature = () => {
  const timestamp = Math.round((new Date()).getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260',
      folder: 'test'
    },
    cloudinaryKeys.apiSecret
  );

  return signature;
};

const uploadToCloudinary = async (file) => {
  //console.log(cloudinary.config());
  const res = await cloudinary.uploader.upload(file, { resource_type: 'auto' });
  return res;
};

module.exports = {
  createSignature,
  uploadToCloudinary
};
