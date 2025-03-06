const { Schema, model } = require("mongoose");

const divisionSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
});

const divisionModel = model("divisions", divisionSchema);

module.exports = divisionModel;
