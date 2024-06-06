const User = require("./Driver");

const mongoose = require("mongoose");
main()
  .then(() => console.log("successfull connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/BikePool");
}

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
  driverData: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
});

const Order = mongoose.model("Order", OrderSchema); // Order is the model (class) which u have to make instances

module.exports = Order;
