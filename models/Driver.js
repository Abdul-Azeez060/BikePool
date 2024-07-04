const mongoose = require("mongoose");
const { type } = require("../Schema");
const { required } = require("joi");

const DriverSchema = new mongoose.Schema({
  //creating schema, template, rules for the db
  name: {
    type: String,
    included: true,
  },
  phone: {
    type: Number,
    included: true,
    unique: true,
  },
  email: {
    type: String,
    included: true,
    unique: true,
  },

  bikeNum: {
    type: String,
    included: true,
    unique: true,
  },
  bikeDesc: {
    type: String,
    included: true,
  },
  role: {
    type: String,
    default: "driver",
    required: true,
  },
  rating: {
    type: Number,
    default: 5,
  },
  image: {
    type: String,
    default:
      "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs2/173502583/original/6a346e0505fac7746ebd790a5de335221c42a4a5/draw-a-simple-big-head-cartoon-from-your-photo.png",
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "BookedOrder" },
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const Driver = mongoose.model("Driver", DriverSchema);

// const driver1 = new Driver({
//   name: "Abdul Azeez",
//   phone: 7989331245,
//   email: "abdulazeez@gmail.com",
//   bikeNum: "AP5BU 7612",
//   bikeDesc: "Suzuki Access 125, Blue Color",
// });

module.exports = Driver;
