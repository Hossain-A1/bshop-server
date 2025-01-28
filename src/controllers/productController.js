const cloudinary = require("../config/cloudinary");
const productModel = require("../models/productModel");
const { errorResponse, successResponse } = require("./resController");
//create product-----------
const handleAddProduct = async (req, res, next) => {
  try {
    const { title, desc, category, brand, price, sizes, color } = req.body;

    // Validate required fields
    if (!title || !desc || !category || !price || !sizes || !color) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Please provide all required fields",
      });
    }

    // Handle file uploads
    const uploadedImages = req.files.images && req.files.images;

    const uploadedColorImages = req.files.colorImages && req.files.colorImages;

    const defiendImages = [uploadedImages].filter((img) => img !== undefined);
    const defiendColorImages = [uploadedColorImages].filter(
      (img) => img !== undefined
    );

    if (defiendImages && defiendColorImages) {
      return console.log(defiendImages, defiendColorImages);
    }

    if (!defiendImages || !defiendColorImages) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Both images and colorImages are required",
      });
    }

    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      defiendImages.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, {
          resource_type: "image",
          folder: "b-shop",
        });
        return result.secure_url;
      })
    );

    const colorImagesUrl = await Promise.all(
      defiendColorImages.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, {
          resource_type: "image",
          folder: "b-shop-colorimg",
        });
        return result.secure_url;
      })
    );

    // Prepare product data
    const productData = {
      title,
      desc,
      category,
      brand: brand || "", // Optional field
      price: Number(price),
      sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes),
      color: Array.isArray(color) ? color : JSON.parse(color),
      images: imagesUrl,
      colorImages: colorImagesUrl,
    };

    // Save product to the database
    const product = await productModel.create(productData);

    if (!product) {
      return errorResponse(res, {
        statusCode: 500,
        message: "Failed to create product",
      });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Product was added successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

//get all product -----------------

const handleGetAllProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const load = parseInt(req.query.load) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [{ name: { $regex: searchRegExp } }],
    };

    const products = await productModel
      .find(filter)
      .skip((load - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

      if (!products) {
        throw createHttpError(404, "Products not found");
      }
      const countProducts = await productModel.find(filter).countDocuments();
    //usccess response
    return successResponse(res, {
      statusCode: 200,
      message: "Products was returned successfully",
      payload: {
        products,
        loadation: {
          totalLoad: Math.ceil(countProducts / limit),
          currentLoad: load,
          loadPage:
            load + 1 <= Math.ceil(countProducts / limit) ? load + 1 : null,
          totalNumberOfProducts: countProducts,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleAddProduct,handleGetAllProducts };
