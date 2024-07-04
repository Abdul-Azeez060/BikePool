const User = require("./Driver");

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  //creating schema, template, rules for the db
  name: {
    type: String,
    included: true,
  },
  price: {
    type: Number,
    included: true,
  },
  pickUp: {
    type: String,
    included: true,
  },
  dropIn: {
    type: String,
    included: true,
  },

  time: {
    type: String,
    included: true,
  },
  isBooked: {
    type: Boolean,
  },
  image: {
    type: String,
  },
  driverData: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
  userData: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Order = mongoose.model("Order", OrderSchema); // Order is the model (class) which u have to make instances

module.exports = Order;
