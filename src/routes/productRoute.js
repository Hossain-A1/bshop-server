const express = require("express");
const upload = require("../middlewares/multer");
const {
  handleAddProduct,
  handleGetAllProducts,
  handleGetSingleProductBySlug,
} = require("../controllers/productController");

const productRouter = express.Router();

productRouter.post(
  "/create",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "colorImages", maxCount: 5 },
  ]),
  handleAddProduct
);

productRouter.get("/list", handleGetAllProducts);
productRouter.get("/slug/:slug", handleGetSingleProductBySlug);
module.exports = productRouter;
