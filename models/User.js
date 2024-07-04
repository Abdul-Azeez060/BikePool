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
  image: {
    type: String,
    default:
      "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs2/173502583/original/6a346e0505fac7746ebd790a5de335221c42a4a5/draw-a-simple-big-head-cartoon-from-your-photo.png",
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "BookedOrder" },
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
