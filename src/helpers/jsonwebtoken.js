const jwt = require("jsonwebtoken");
const { jwtSecretKey, jwtReSecretKey } = require("../secret");
const createError = require("./createError");

const createToken = (payload) => {
  try {
    const accessToken = jwt.sign(payload, jwtSecretKey, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, jwtReSecretKey, { expiresIn: "7d" });
    return {
      accessToken,refreshToken
    }
  } catch (error) {
    throw createError(500, `Token creation failed: ${error.message}`);
  }
};

const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, jwtSecretKey);
    return decode;
  } catch (error) {
    throw createError(401, `Token verification failed: ${error.message}`);
  }
};

module.exports = { createToken, verifyToken };
