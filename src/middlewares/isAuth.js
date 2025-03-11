const createError = require("../helpers/createError");
const { verifyToken } = require("../helpers/jsonwebtoken");
const { jwtSecretKey } = require("../secret");

const isAuthorized = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Unauthorized: Token not found");
    }

    const token = authHeader.split(" ")[1];
    const decode = verifyToken(token, jwtSecretKey);
    if (!decode) {
      throw createError(401, "Unauthorized: Invalid token");
    }

    req.user = decode.id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAuthorized;
