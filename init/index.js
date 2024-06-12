const mongoose = require("mongoose");
const trips = require("./data");
const Order = require("../models/Orders");

main()
  .then(() => console.log("successfull connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/BikePool");
}

async function initDb() {
  console.log(trips);
  await Order.deleteMany({});
  let changedTrips = trips.map((obj) => {
    obj.driverData = "6655a827fc78f72941d5feb5";
    obj.time = 2;
    obj.isBooked = false;
    return obj;
  });

  console.log(changedTrips);
  await Order.insertMany(changedTrips);
}

initDb()
  .then(() => console.log("records added to collection"))
  .catch((err) => console.log(err));
