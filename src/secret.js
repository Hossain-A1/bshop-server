require("dotenv").config();
const port = process.env.SERVER_PORT || 4001;
const mongodbAtlasURL = process.env.MONGO_DB_ATLAS_URL;

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const jwtReSecretKey = process.env.JWT_RE_SECRET_KEY;

//cloudinary api keys
const cloudnaryName = process.env.CLOUDINARY_NAME || "dvjrxv9dg";
const cloudnaryApiKey = process.env.CLOUDINARY_API_KRY || "195625563955856";
const cloudnarySecret =
  process.env.CLOUDINARY_SECRET_KRY || "us0FhIw9sJcQzmNJftDayj8ITTI";

const clientURL = process.env.CLINET_URL;

const smtpUserName = process.env.SMTP_USERANAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "lwsraxutifepjvap";
// ------------------- //

module.exports = {
  port,
  mongodbAtlasURL,
  jwtSecretKey,
  jwtReSecretKey,
  smtpUserName,
  smtpPassword,
  clientURL,
  cloudnaryName,
  cloudnaryApiKey,
  cloudnarySecret,
};
