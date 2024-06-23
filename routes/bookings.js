const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");

const { restrictTo, validateOrder, cancelRide } = require("../middleware");
const {
  handleMyOrders,
  handleCancelRide,
  handleBookingDetails,
  handleNewBooking,
  addNewBooking,
  handleBooking,
} = require("../controllers/bookings");




//bookings page
router.get("/", handleBooking);

//new booking get req
router.get("/new", restrictTo(["driver"]), addNewBooking);

// post req to bookings
router.post("/", validateOrder, handleNewBooking);
router.get("/myorders", handleMyOrders);

//cancel ride
router.post("/cancelride", cancelRide, handleCancelRide);

// booking details
router.get("/:id", handleBookingDetails);

module.exports = router;
