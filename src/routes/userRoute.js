const express =require("express");
const {handleRegister,handleLogin} =require('../controllers/userController')
const userRouter = express.Router();

userRouter.post("/register",handleRegister );
userRouter.post("/login", handleLogin);
// userRouter.post("/admin", handleAdminLogin);

module.exports = userRouter;