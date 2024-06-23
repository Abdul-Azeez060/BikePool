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
  let { orderId, userId, driverId } = req.body;
  await Driver.findByIdAndUpdate(driverId, { orderId: null });
  await User.findByIdAndUpdate(userId, { orderId: null });
  await BookedOrder.findByIdAndDelete(orderId);
  next();
}

function restrictTo(roles) {
  return function (req, res, next) {
    if (!res.locals.currUser) res.redirect("/user/login");
    if (!roles.includes(res.locals.currUser.role)) {
      res.send("Access Denied");
    }
    next();
  };
}

module.exports = { cancelRide, validateOrder, checkAuthentication, restrictTo };
