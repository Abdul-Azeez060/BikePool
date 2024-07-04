const Driver = require("../models/Driver");
const User = require("../models/User");
const BookedOrder = require("../models/BookedOrders");
const Order = require("../models/Orders");
const { ExpressError } = require("../utils/ExpressError");
const { Review } = require("../models/Reviews");

async function deleteBooking(req, res, userID, time) {
  let data = await Order.findById(userID);
  setTimeout(async () => {
    await Order.findByIdAndDelete(userID);
  }, time * 60 * 1000);
}

async function handleReviews(req, res, next) {
  try {
    let { review } = req.body;
    review.name = res.locals.currUser.name;
    review.image = currUser.image;
    review.showIn = review.showIn == "on" ? true : false;
    console.log(review);
    let newReview = await new Review(review).save();
    if (!newReview) return next(new ExpressError("Review not submitted"));
    console.log(newReview);
    req.flash("success", "Review Added");
    res.redirect("/");
  } catch (err) {
    next(err);
  }
}
// async function handleDeleteReview(req, res, next) {
//   try {
//     let { id } = req.params;
//     await Review.findByIdAndDelete(id);
//   } catch (err) {
//     next(err);
//   }
// }
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
    const data = await Order.findByIdAndUpdate(orderId, { isBooked: false });
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
    if (!details) {
      req.flash("error", "Booking not found");
      res.redirect("/bookings");
    }
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
    try {
      await User.findByIdAndUpdate(res.locals.currUser._id, {
        orderId: id,
      });
      await Driver.findOneAndUpdate(details.driverData[0], { orderId: id });
    } catch (err) {
      req.flash("error", "Not logged in");
      res.redirect("/user/login");
    }

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
      image: res.locals.currUser.image,
    }).save();
    let orderId = details._id;

    await Driver.findByIdAndUpdate(res.locals.currUser._id, {
      orderId: orderId,
    });
    await deleteBooking(req, res, orderId, parseInt(data.time));
    req.flash("success", "Ride Added Successfully");
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

async function handleCompleteRide(req, res, next) {
  let { orderId } = req.body;
  console.log("compleete button clicked");
  try {
    await Order.findOneAndDelete(orderId);
    req.flash("success", "Ride Complete");
    res.redirect("/");
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
  handleCompleteRide,
  handleReviews,
  // handleDeleteReview,
};
