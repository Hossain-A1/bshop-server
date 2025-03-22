const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../secret");
const createError = require("./createError");

const createToken = (id) => {
  try {
    const token = jwt.sign({ id }, jwtSecretKey, { expiresIn: "7d" });
    return token;
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
