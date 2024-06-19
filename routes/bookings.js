const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const BookedOrder = require("../models/BookedOrders");
const { restrictTo, validateOrder, cancelRide } = require("../middleware");
const Driver = require("../models/Driver");
const User = require("../models/User");

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
    name: res.locals.currUser.name,
    pickUp: data.pickUp,
    dropIn: data.dropIn,
    time: t,
    price: data.price,
    driverData: res.locals.currUser._id,
    isBooked: false,
  }).save();
  let orderId = details._id;

  const currUserData = await Driver.findByIdAndUpdate(res.locals.currUser._id, {
    orderId: orderId,
  });
  console.log(currUserData, "this is the driver users currUser");
  await deleteBooking(req, res, orderId, parseInt(data.time));
  res.redirect("./bookings");
});
router.get("/myorders", async (req, res) => {
  let id = res.locals.currUser._id;
  console.log("this is the id", id);
  let details = null;
  if (res.locals.currUser.role == "driver") {
    details = await Driver.findById(id).populate({
      path: "orderId",
      populate: { path: "userData" }, // Nested population of the user field inside driverData
    });
  } else {
    details = await User.findById(id).populate({
      path: "orderId",
      populate: { path: "driverData" },
    });
  }
  console.log(details, "this is the details in the order");
  res.render("./bookingDetails", { details: details.orderId });
});

//cancel ride
router.post("/cancelride", cancelRide, async (req, res) => {
  let { orderId, userId, driverId } = req.body;

  await Order.findByIdAndUpdate(id, { isBooked: false });
});

// booking details
router.get("/:id", async (req, res) => {
  console.log("this is get req to :id");
  try {
    let id = req.params.id;
    let det = await Order.findById(id);
    if (det.isBooked == false) {
      let details = await Order.findByIdAndUpdate(id, { isBooked: true });
      console.log(details);
      console.log(details.driverData[0].toString());
      let bookedDetails = new BookedOrder({
        name: details.name,
        pickUp: details.pickUp,
        dropIn: details.dropIn,
        time: details.time,
        price: details.price,
        driverData: details.driverData[0].toString(),
        isBooked: true,
        _id: details._id,
        userData: res.locals.currUser._id,
      });
      await bookedDetails.save();
    }
    const currUserData = await User.findByIdAndUpdate(res.locals.currUser._id, {
      orderId: id,
    });
    res.redirect("/bookings/myorders");
  } catch (err) {
    console.log("listing not present");
  }
});

module.exports = router;
