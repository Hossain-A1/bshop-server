const validator = require("validator");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel.js");
const { errorResponse, successResponse } = require("./resController.js");
const { createToken } = require("../helpers/jsonwebtoken.js");
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

    //create token
    const token = createToken(user._id);
    if (!token) {
      throw new Error("Token not found");
    }
    return successResponse(res, {
      statusCode: 201,
      message: "User created successfully",
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existEmail = await userModel.findOne({ email }).select("+password");

    if (!existEmail) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Email not exist, Please register first!",
      });
    }

    const matchPassword = await bcrypt.compare(password, existEmail.password);

    if (!matchPassword) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Password not match",
      });
    }

    const token = createToken(existEmail._id);

    return successResponse(res, {
      statusCode: 201,
      message: "User login successfully",
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

// const handleAdminLogin = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (email === adminEmail && password === adminPassword) {
//       const token = jwt.sign(email + password, jwtSecret);

//       return successResponse(res, {
//         statusCode: 200,
//         message: "Admin was login successfully",
//         payload: token,
//       });
//     } else {
//       errorResponse(res, {
//         statusCode: 400,
//         message: "Admin login failed",
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = { handleRegister, handleLogin };
