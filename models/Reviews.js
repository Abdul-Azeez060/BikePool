const { required } = require("joi");
const mongoose = require("mongoose");
const { message, type } = require("../Schema");

const ReviewSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  showIn: {
    type: Boolean,
    required: true,
  },
});

const Review = new mongoose.model("review", ReviewSchema);

module.exports = { Review };
