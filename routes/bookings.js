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
  handleCompleteRide,
  handleReviews,
} = require("../controllers/bookings");

//bookings page
router.get("/", handleBooking);

//reviews
router.post("/reviews", restrictTo(["driver", "user"]), handleReviews);

// delete req to review
// router.get('/reviews/:id',restrictTo(['driver', 'user']), handleDeleteReview);

//new booking get req
router.get("/new", restrictTo(["driver"]), addNewBooking);

// post req to bookings
router.post("/", restrictTo(["driver"]), validateOrder, handleNewBooking);
router.get("/myorders", restrictTo(["driver", "user"]), handleMyOrders);

//cancel ride
router.post("/cancelride", restrictTo(["user"]), cancelRide, handleCancelRide);

//complete ride
router.post("/success", restrictTo(["driver"]), cancelRide, handleCompleteRide);

// booking details
router.get("/:id", restrictTo("user"), handleBookingDetails);

module.exports = router;
