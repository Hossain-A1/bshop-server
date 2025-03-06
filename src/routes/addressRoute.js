const express =require("express");
const handleGetUserAddress = require("../controllers/addressController");
const addressRoute = express.Router();

addressRoute.get("/", handleGetUserAddress);
// userRouter.post("/admin", handleAdminLogin);

module.exports = addressRoute;