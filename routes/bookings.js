const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const BookedOrder = require("../models/BookedOrders");
const { restrictTo, validateOrder } = require("../middleware");

async function deleteBooking(req, res, userID, time) {
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

//new booking get req
router.get("/new", restrictTo(["driver"]), async (req, res) => {
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
  await deleteBooking(req, res, userID, parseInt(data.time));
  res.redirect("/bookings");
});

// booking details
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let det = await Order.findById(id);
    console.log(det);
    if (det.isBooked == false) {
      let details = await Order.findByIdAndUpdate(id, { isBooked: true });
      let bookedDetails = new BookedOrder({
        name: details.name,
        pickUp: details.pickUp,
        dropIn: details.dropIn,
        time: details.time,
        price: details.price,
        driverData: details.driverData[0],
        isBooked: true,
        _id: details._id,
      });
      await bookedDetails.save();
    }
    let bookdetails = await BookedOrder.findById(id);

    bookdetails = await bookdetails.populate("driverData");
    console.log(bookdetails, "this is booked details");
    res.render("./bookingDetails.ejs", { details: bookdetails });
  } catch (err) {
    console.log("listing not present");
  }
});

module.exports = router;
