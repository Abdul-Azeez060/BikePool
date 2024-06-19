const { required, string } = require("joi");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  //creating schema, template, rules for the db
  name: {
    type: String,
    included: true,
    required: true,
  },
  phone: {
    type: Number,
    included: true,
    unique: true,
  },
  email: {
    type: String,
    included: true,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
    required: true,
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "BookedOrder" },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
