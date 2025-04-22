const validator = require("validator");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel.js");
const { errorResponse, successResponse } = require("./resController.js");
const { createToken } = require("../helpers/jsonwebtoken.js");
const verifyUser = require("../service/userService.js");
const handleRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await userModel.findOne({ email });
    if (existUser) {
      throw new Error("Email already used. Try another email ID");
    }

    //validating emal and password
    if (!validator.isEmail(email)) {
      throw new Error("Please inter a valid email!");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Password must be 8char+ long with one uppercase ,lowercase and symbol"
      );
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
    });
    if (!user) {
      throw new Error("User not found");
    }

    verifyUser(res, user);
    return successResponse(res, {
      statusCode: 201,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Email not exist, Please register first!",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Password not match",
      });
    }

    verifyUser(res, user);

    return successResponse(res, {
      statusCode: 200,
      message: "User login successfully",
    });
  } catch (error) {
    next(error);
  }
};

const handleforgetPassword = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    console.log(password);
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, {
        statusCode: 404,
        message: "You did not register with this email.",
      });
    }

    if (password !== confirmPassword) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Password not match.",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return errorResponse(res, {
        statusCode: 400,
        message:
          "Password must be 8char+ long with one uppercase lowercase and symbol",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;

    verifyUser(res, user);
    user.save();
    return successResponse(res, {
      statusCode: 200,
      message: "Password was successfull",
    });
  } catch (error) {
    next(error);
  }
};

const handleGetUser = async (req, res, next) => {
  try {
    const id = req.user;
    const user = await userModel.findById(id);
    if (!user) {
      return errorResponse(res, {
        statusCode: 404,
        message: "user not found in db",
      });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "user found",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

const handleSaveUserAddress = async (req, res, next) => {
  try {
    const { formData } = req.body;
    const userId = req.user;

    // Validate formData
    if (
      !formData ||
      typeof formData !== "object" ||
      Object.keys(formData).length === 0
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Invalid formData. It must be a non-empty object.",
      });
    }

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return errorResponse(res, {
        statusCode: 404,
        message: "User not found in database",
      });
    }

    // Update the address, ensuring all fields are properly set
    const updatedUserAddress = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          "address.fullName": formData.fullName || user.address.fullName,
          "address.phone": formData.phone || user.address.phone,
          "address.division": formData.division || user.address.division,
          "address.district": formData.district || user.address.district,
          "address.upazila": formData.upazila || user.address.upazila,
          "address.union": formData.union || user.address.union,
          "address.building": formData.building || user.address.building,
          "address.landmark": formData.landmark || user.address.landmark,
          "address.address": formData.address || user.address.address,
        },
      },
      { new: true }
    );

    return successResponse(res, {
      statusCode: 200,
      message: "User address updated successfully",
      payload: updatedUserAddress,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  handleGetUser,
  handleSaveUserAddress,
  handleforgetPassword,
};
