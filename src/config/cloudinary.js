const cloudinary  = require("cloudinary").v2;
const { cloudnaryName, cloudnaryApiKey, cloudnarySecret }= require("../secret.js");

  cloudinary.config({
    cloud_name: cloudnaryName,
    api_key: cloudnaryApiKey,
    api_secret: cloudnarySecret,
  });

module.exports = cloudinary;
