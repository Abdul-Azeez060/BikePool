const Driver = require("../models/Driver");
const User = require("../models/User");
const BookedOrder = require("../models/BookedOrders");
const Order = require("../models/Orders");
const { ExpressError } = require("../utils/ExpressError");

async function deleteBooking(req, res, userID, time) {
  let data = await Order.findById(userID);
  setTimeout(async () => {
    await Order.findByIdAndDelete(userID);
  }, time * 60 * 1000);
}
async function handleMyOrders(req, res, next) {
  try {
    let id = res.locals.currUser._id;
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
    res.render("./bookingDetails", { details: details.orderId });
  } catch (err) {
    next(err);
  }
}

async function handleCancelRide(req, res) {
  try {
    let { orderId } = req.body;
    await Order.findByIdAndUpdate(orderId, { isBooked: false });
    req.flash("success", "Ride Canceled");
    res.redirect("/");
  } catch (err) {
    req.flash("success", "Ride Canceled");
    res.redirect("/bookings");
  }
}

async function handleBookingDetails(req, res, next) {
  try {
    let id = req.params.id;
    let details = await Order.findByIdAndUpdate(id, { isBooked: true });
    console.log(details);
    let bookedDetails = new BookedOrder({
      name: details.name,
      pickUp: details.pickUp,
      dropIn: details.dropIn,
      time: details.time,
      price: details.price,
      driverData: details.driverData[0],
      isBooked: true,
      _id: details._id,
      userData: res.locals.currUser._id,
    });

    await bookedDetails.save();
    await User.findByIdAndUpdate(res.locals.currUser._id, {
      orderId: id,
    });
    req.flash("success", "Ride Booked");
    res.redirect("/bookings/myorders");
  } catch (err) {
    next(new ExpressError(400, "Booking not found"));
  }
}

async function handleNewBooking(req, res) {
  try {
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

    await Driver.findByIdAndUpdate(res.locals.currUser._id, {
      orderId: orderId,
    });
    await deleteBooking(req, res, orderId, parseInt(data.time));
    res.redirect("./bookings");
  } catch (err) {
    next(err);
  }
}

async function addNewBooking(req, res) {
  res.render("./newBooking.ejs");
}

async function handleBooking(req, res, next) {
  try {
    let orders = await Order.find({});
    res.render("./bookings.ejs", { orders });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleBooking,
  handleMyOrders,
  handleCancelRide,
  handleBookingDetails,
  handleNewBooking,
  addNewBooking,
};
