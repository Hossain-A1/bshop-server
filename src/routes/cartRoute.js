const express =require("express");
const { handleAddToCart } = require("../controllers/addToCartController");
const isAuthorized = require("../middlewares/isAuth");
const cartRouter = express.Router();

cartRouter.post("/add",isAuthorized, handleAddToCart );


module.exports = cartRouter;