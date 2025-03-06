const mongoose = require("mongoose");
const divisionModel = require("../models/divisionModel");
const { errorResponse, successResponse } = require("./resController");
const districtsModel = require("../models/districtsModel");
const upazilaModel = require("../models/upzillaModel");

const handleGetUserAddress = async (req, res, next) => {
  try {
    const division = await divisionModel.find({});
    if (!division) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Division not found",
      });
    }
    const districts = await districtsModel.find({});
    if (!districts) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Districts not found",
      });
    }
    const upazilas = await upazilaModel.find({});
    if (!upazilas) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Upazilas not found",
      });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Address found",
      payload: { division, districts ,upazilas},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = handleGetUserAddress;
