const mongoose = require("mongoose");
const divisionModel = require("../models/divisionModel");
const { errorResponse, successResponse } = require("./resController");
const districtsModel = require("../models/districtsModel");
const upazilaModel = require("../models/upzillaModel");
const unionModel = require("../models/unionModel");

const handleGetUserAddress = async (_req, res, next) => {
  try {
    // Fetch all data in parallel
    const [divisions, districts, upazilas, unions] = await Promise.all([
      divisionModel.find({}),
      districtsModel.find({}),
      upazilaModel.find({}),
      unionModel.find({}),
    ]);

    // Check if any of the arrays are empty
    if (
      divisions.length === 0 ||
      districts.length === 0 ||
      upazilas.length === 0 ||
      unions.length === 0
    ) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Address data not found",
      });
    }

    // Return the response with all the data
    return successResponse(res, {
      statusCode: 200,
      message: "Address data found",
      payload: {
        divisions: divisions,
        districts: districts,
        upazilas: upazilas,
        unions: unions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = handleGetUserAddress;
