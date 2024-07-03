const User = require("../models/User");
const Driver = require("../models/Driver");
const { setUser } = require("../service/auth");
const { ExpressError } = require("../utils/ExpressError");

async function handleDriverSignUp(req, res, next) {
  try {
    let data = req.body;
    const insertedData = await new Driver(data).save();
    const token = setUser(insertedData);
    res.cookie("uid", token);
    req.flash("success", "Welcome to BikePool");
    res.redirect("/");
  } catch (err) {
    req.flash("error", "Rider already exits");
    res.redirect("/user/login");
  }
}

async function handleUserSignUp(req, res, next) {
  try {
    let data = req.body;
    const insertedData = await new User(data).save();
    const token = setUser(insertedData);
    res.cookie("uid", token);
    req.flash("success", "Welcome to BikePool");
    res.redirect("/");
  } catch (err) {
    req.flash("error", "User already exits");
    res.redirect("/user/login");
  }
}

async function handlelogin(req, res, next) {
  try {
    const { role, phone } = req.body;
    let data;
    if (role == "user") {
      data = await User.findOne({ phone: phone });
    } else if (role === "driver") {
      data = await Driver.findOne({ phone: phone });
    }
    if (!data) {
      console.log("invalid user");
      req.flash("error", "Invalid user");
      return res.redirect("/user/login");
    }
    console.log(data);
    const token = setUser(data);
    console.log(token);
    res.cookie("uid", token);
    req.flash("success", "Welcome Back");
    res.redirect("/bookings");
  } catch (err) {
    next(err);
  }
}
async function handleRating(req, res, next) {
  let { id } = req.params;
  let { rating } = req.body;
  console.log(rating, id);
  const details = await Driver.findById(id);
  if (!details) {
    return next(new ExpressError("Order not find"));
  }
  console.log(details.rating);
  console.log(rating);
  const updatedRating = (details.rating + parseInt(rating)) / 2;
  console.log(updatedRating);
  details.rating = updatedRating;
  details.save();
  res.redirect("/bookings/myorders");
}

module.exports = {
  handleDriverSignUp,
  handleUserSignUp,
  handlelogin,
  handleRating,
};
