const User = require("../models/User");
const Driver = require("../models/Driver");
const { setUser } = require("../service/auth");

async function handleDriverSignUp(req, res) {
  let data = req.body;
  console.log(data);
  new Driver(data)
    .save()
    .then(() => console.log(data, "added successfull"))
    .catch((err) => console.log(err));
  res.send("driver successfully reigsterd");
}

async function handleUserSignUp(req, res) {
  let data = req.body;
  console.log(data);
  new User(data)
    .save()
    .then(() => console.log(data, "added successfull"))
    .catch((err) => console.log(err));
  res.send("user successfully registered");
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
    return res.redirect("/user/login");
  }
  const token = setUser(data);
  res.cookie("uid", token);
  res.redirect("/bookings");
}

module.exports = {
  handleDriverSignUp,
  handleUserSignUp,
  handlelogin,
};
