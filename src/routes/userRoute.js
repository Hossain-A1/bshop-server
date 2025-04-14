const express = require("express");
const {
  handleRegister,
  handleLogin,
  handleGetUser,
  handleSaveUserAddress,
  handleGetUserAddress,
} = require("../controllers/userController");
const isAuthorized = require("../middlewares/isAuth");
const userRouter = express.Router();

userRouter.post("/register", handleRegister);
userRouter.post("/login", handleLogin);
userRouter.get("/get", isAuthorized, handleGetUser);
userRouter.put("/save/address", isAuthorized, handleSaveUserAddress);
// userRouter.post("/admin", handleAdminLogin);

module.exports = userRouter;
