const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    desc: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: "",
    },
    sold: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    color: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    colorImages: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const productModel = model("product", productSchema);

module.exports = productModel;
