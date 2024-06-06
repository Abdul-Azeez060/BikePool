const mongoose = require("mongoose");
main()
  .then(() => console.log("successfull connected"))
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
  },
  email: {
    type: String,
    included: true,
  },

  bikeNum: {
    type: String,
    included: true,
  },
  bikeDesc: {
    type: String,
    included: true,
  },
});

const Driver = mongoose.model("Driver", DriverSchema);

const driver1 = new Driver({
  name: "Abdul Azeez",
  phone: 7989331245,
  email: "abdulazeez@gmail.com",
  bikeNum: "AP5BU 7612",
  bikeDesc: "Suzuki Access 125, Blue Color",
});

driver1
  .save()
  .then(() => console.log("driver data added"))
  .catch((err) => console.log(err));

module.exports = Driver;
