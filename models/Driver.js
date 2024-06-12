const mongoose = require("mongoose");
const { type } = require("../Schema");
main()
  .then(() => console.log("successfull connected to the database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/BikePool");
}

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
