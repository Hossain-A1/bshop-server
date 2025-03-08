const { Schema, model } = require("mongoose");

const unionSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  upazilla_id:{
    type: Number,
    required: true,
  },
  name:{
    type: String,
    trim: true,
    required: true,
  },
});

const unionModel = model("unions", unionSchema);

module.exports = unionModel;
