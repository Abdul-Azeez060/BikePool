const mongoose = require("mongoose");
const { type } = require("../Schema");

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
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "BookedOrder" },
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
