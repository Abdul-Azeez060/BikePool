const { getUser } = require("./service/auth");
const OrderSchema = require("./Schema");
const Driver = require("./models/Driver");
const User = require("./models/User");
const BookedOrder = require("./models/BookedOrders");
const { ExpressError } = require("./utils/ExpressError");

function validateOrder(req, res, next) {
  console.log("this is the validation");
  let ans = OrderSchema.validate(req.body.booking);
  if (ans.error) {
    console.log("there is error");
    return next(ans.error); // next(err) here default express error handler comes without using error handler middleware
  }
  return next();
}

function checkAuthentication(req, res, next) {
  let token = req.cookies?.uid;
  if (!token) {
    res.locals.currUser = null;
    return next();
  }
  let { data: user } = getUser(token);
  res.locals.currUser = user;
  next();
}

async function cancelRide(req, res, next) {
  try {
    let { orderId, userId, driverId } = req.body;
    console.log(
      orderId,
      "this is order id",
      userId,
      "this is user id",
      driverId,
      "this is driver id"
    );
    await Driver.findByIdAndUpdate(driverId, { orderId: null });
    await User.findByIdAndUpdate(userId, { orderId: null });
    await BookedOrder.findByIdAndDelete(orderId);
    next();
  } catch (err) {
    next(new ExpressError("something went wrong"));
  }
}

function denyAccessTo(roles) {
  return (req, res, next) => {
    if (!res.locals.currUser) {
      return next();
    }
    if (roles.includes(res.locals.currUser.role)) {
      req.flash("error", "Your already logged In");
      return res.redirect("/bookings");
    }
    next();
  };
}

function restrictTo(roles) {
  return function (req, res, next) {
    if (!res.locals.currUser) {
      req.flash("error", "User not logged In");
      return res.redirect("/user/login");
    }
    if (!roles.includes(res.locals.currUser.role)) {
      req.flash("error", "Your Not Authorized");
      return res.redirect("/bookings");
    }

    next();
  };
}

module.exports = {
  cancelRide,
  validateOrder,
  checkAuthentication,
  restrictTo,
  denyAccessTo,
};
