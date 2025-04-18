const express = require("express");
const upload = require("../middlewares/multer");
const {
  handleAddProduct,
  handleGetAllProducts,
  handleGetSingleProductBySlug,
} = require("../controllers/productController");
const { isAuthorized, isAdmin } = require("../middlewares/isAuth");

const productRouter = express.Router();

productRouter.post(
  "/create",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "colorImages", maxCount: 5 },
  ]),
  isAuthorized,
  isAdmin,
  handleAddProduct
);

productRouter.get("/list", handleGetAllProducts);
productRouter.get("/slug/:slug", handleGetSingleProductBySlug);
module.exports = productRouter;
