const { required } = require("joi");
const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },
  review: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
  },
  showIn: {
    type: Boolean,
    required: true,
  },
});

const Review = new mongoose.model("review", ReviewSchema);

module.exports = { Review };
