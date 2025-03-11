const express =require("express");
const {handleRegister,handleLogin, handleGetUser} =require('../controllers/userController')
const userRouter = express.Router();

userRouter.post("/register",handleRegister );
userRouter.post("/login", handleLogin);
userRouter.get("/get", handleGetUser);
// userRouter.post("/admin", handleAdminLogin);

module.exports = userRouter;