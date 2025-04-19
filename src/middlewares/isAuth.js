const { errorResponse } = require("../controllers/resController");
const createError = require("../helpers/createError");
const { verifyToken } = require("../helpers/jsonwebtoken");
const { jwtSecretKey } = require("../secret");

const isAuthorized = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Unauthorized: Token not found");
    }

    const token = authHeader.split(" ")[1];
   
    console.log(token);
    const decode = verifyToken(token, jwtSecretKey);
    if (!decode) {
      throw createError(401, "Unauthorized: Invalid token");
    }

    req.user = decode;
    next();
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const admin = req.user;
    if (admin?.role === "admin") {
      next();
    } else {
      return errorResponse(res, {
        statusCode: 403,
        message: "Access denied. Admins only.",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {isAuthorized,isAdmin};
