const User = require("../models/User");
const Driver = require("../models/Driver");
const { setUser } = require("../service/auth");

async function handleDriverSignUp(req, res) {
  let data = req.body;
  console.log(data);
  const insertedData = await new Driver(data).save();
  console.log(insertedData);
  const token = setUser(insertedData);
  res.cookie("uid", token);
  req.flash("success", "Welcome to BikePool");
  res.redirect("/");
}

async function handleUserSignUp(req, res) {
  let data = req.body;
  console.log(data);
  const insertedData = await new User(data).save();

  const token = setUser(insertedData);
  res.cookie("uid", token);
  req.flash("success", "Welcome to BikePool");
  res.redirect("/");
}

async function handlelogin(req, res) {
  console.log(req.body);
  const { role, phone } = req.body;
  let data;
  if (role == "user") {
    data = await User.findOne({ phone: phone });
  } else if (role === "driver") {
    data = await Driver.findOne({ phone: phone });
  }
  console.log(data);
  if (!data) {
    console.log("invalid user");
    req.flash("error", "Invalid user");
    return res.redirect("/user/login");
  }
  const token = setUser(data);
  res.cookie("uid", token);
  req.flash("success", "Welcome Back");
  res.redirect("/bookings");
}

module.exports = {
  handleDriverSignUp,
  handleUserSignUp,
  handlelogin,
};
