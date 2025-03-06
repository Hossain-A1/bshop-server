const { Schema, model } = require("mongoose");

const districtsSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  division_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
});

const districtsModel = model("district", districtsSchema);

module.exports = districtsModel;
