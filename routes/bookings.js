const express = require("express");
const router = express.Router();
const validateOrder = require("../middlewares/validateOrder");
const Order = require("../models/Orders");

async function deleteBooking(userID, time) {
  let data = await Order.findById(userID);
  setTimeout(async () => {
    await Order.findByIdAndDelete(userID);
  }, time * 60 * 1000);
}

//bookings page
router.get("/", async (req, res) => {
  let orders = await Order.find({});
  res.render("./bookings.ejs", { orders });
});

router.get("/new", async (req, res) => {
  res.render("./newBooking.ejs");
});

// post req to bookings
router.post("/", validateOrder, async (req, res) => {
  let data = req.body.booking;
  let t = new Date(
    new Date().getTime() + parseInt(data.time) * 60 * 1000
  ).toLocaleTimeString();
  let details = await Order({
    name: "Abdul Azeez",
    pickUp: data.pickUp,
    dropIn: data.dropIn,
    time: t,
    price: data.price,
    driverData: "6655a827fc78f72941d5feb5",
    isBooked: false,
  }).save();
  let userID = details._id;
  await deleteBooking(userID, parseInt(data.time));
  res.redirect("/bookings");
});

// booking details
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let bookingDetails = await Order.findByIdAndUpdate(id, { isBooked: true });
    let details = await Order.findById(id).populate("driverData");
    console.log(details);
    res.render("./bookingDetails.ejs", { details: details });
  } catch (err) {
    console.log("listing not present");
  }
});

module.exports = router;
