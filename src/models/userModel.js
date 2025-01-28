const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartItem: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

const userModel = model("user", userSchema);

module.exports = userModel;
