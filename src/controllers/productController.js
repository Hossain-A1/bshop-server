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

    // Ensure files exist
    if (!req.files || (!req.files.images && !req.files.colorImages)) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Both images and colorImages are required",
      });
    }

    // Handle file uploads
    const uploadedImages = req.files.images ? req.files.images : [];
    const uploadedColorImages = req.files.colorImages ? req.files.colorImages : [];

    if (uploadedImages.length === 0 || uploadedColorImages.length === 0) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Both images and colorImages must contain at least one file",
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
    const productExisted = await productModel.exists({title:title})

    if(productExisted){
      return errorResponse(res,{statusCode:409,message:"Product has in database! try another product."})
    }

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
    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const load = parseInt(req.query.load) || 0;
    const limit = parseInt(req.query.limit) || 30;

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
      const countProducts = await productModel.find({}).countDocuments();
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
