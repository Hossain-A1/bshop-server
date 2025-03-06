const { Schema, model } = require("mongoose");

const upazilaSchema = new Schema({
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

const upazilaModel = model("upazilas", upazilaSchema);

module.exports = upazilaModel;
