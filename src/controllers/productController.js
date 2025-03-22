const slugfy = require("slugify");
const cloudinary = require("../config/cloudinary");
const productModel = require("../models/productModel");
const { errorResponse, successResponse } = require("./resController");
//create product-----------
const handleAddProduct = async (req, res, next) => {
  try {
    const { title, desc, sold, stock, category, brand, price, sizes, color } =
      req.body;

    // Validate required fields
    if (
      !title ||
      !desc ||
      !sold ||
      !stock ||
      !category ||
      !price ||
      !sizes ||
      !color
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Please provide all required fields",
      });
    }


    // Ensure files exist
    if (!req.files || (!req.files.images && !req.files.colorImages)) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Both images and colorImages are required",
      });
    }

    // Handle file uploads
    const uploadedImages = req.files.images ? req.files.images : [];
    const uploadedColorImages = req.files.colorImages
      ? req.files.colorImages
      : [];

    if (uploadedImages.length === 0 || uploadedColorImages.length === 0) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Both images and colorImages must contain at least one file",
      });
    }
   // Parse color if it's a JSON string
   const colorsArray = typeof color === "string" ? JSON.parse(color) : color;

   // Validate the length of color and colorImages arrays
   if (colorsArray.length !== uploadedColorImages.length) {
     return errorResponse(res, {
       statusCode: 400,
       message: "The number of colors must match the number of color images",
     });
   }
    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      uploadedImages.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, {
          resource_type: "image",
          folder: "b-shop",
        });
        return result.secure_url;
      })
    );

    const colorImagesUrl = await Promise.all(
      uploadedColorImages.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, {
          resource_type: "image",
          folder: "b-shop-colorimg",
        });
        return result.secure_url;
      })
    );

    //if exist
    const productExisted = await productModel.exists({ title: title });

    if (productExisted) {
      return errorResponse(res, {
        statusCode: 409,
        message: "Product has in database! try another product.",
      });
    }

    // Prepare product data
    const productData = {
      title,
      slug: slugfy(title),
      desc,
      sold,
      stock,
      category,
      brand: brand || "", //
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

// Get all products with search, pagination, and sorting
const handleGetAllProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const load = parseInt(req.query.load) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = search
      ? {
          $or: [{ title: { $regex: searchRegExp } }],
        }
      : {};

    const products = await productModel
      .find(filter)
      .skip((load - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "Products not found",
      });
    }

    const countProducts = await productModel.countDocuments(filter);

    return res.status(200).json({
      statusCode: 200,
      message: "Products fetched successfully",
      payload: {
        products,
        totalLoad: Math.ceil(countProducts / limit),
        currentLoad: load,
        loadPage: load <= Math.ceil(countProducts / limit) ? load + 1 : null,
        totalNumberOfProducts: countProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Product by Slug
 const handleGetSingleProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await productModel.findOne({ slug });

    if (!product) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Product not found",
      });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Product was returned successfully",
      payload:product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleAddProduct,
  handleGetAllProducts,
  handleGetSingleProductBySlug,
};
