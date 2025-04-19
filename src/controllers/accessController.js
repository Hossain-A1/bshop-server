const {
  errorResponse,
  successResponse,
} = require("../controllers/resController");
const { verifyToken } = require("../helpers/jsonwebtoken");

const handleAccessAdmin = async (req, res, next) => {
  try {
    return successResponse(res, {
      statusCode: 200,
      message: "Admin access has approval",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleAccessAdmin };
