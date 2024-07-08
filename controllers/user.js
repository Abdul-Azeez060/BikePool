const User = require("../models/User");
const Driver = require("../models/Driver");
const { setUser } = require("../service/auth");
const { ExpressError } = require("../utils/ExpressError");
const cookieExp = 2 * 7 * 24 * 60 * 60 * 1000;
async function handleDriverSignUp(req, res, next) {
  try {
    let data = req.body;
    console.log(data);
    data.image =
      data.image == "male"
        ? "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs2/173502583/original/6a346e0505fac7746ebd790a5de335221c42a4a5/draw-a-simple-big-head-cartoon-from-your-photo.png"
        : "https://static.boredpanda.com/blog/wp-content/uploads/2020/09/67950251_497014150843468_6994039138377086122_n-5f60ef7458981__880.jpg";
    const insertedData = await new Driver(data).save();
    console.log(insertedData);
    const token = setUser(insertedData);
    res.cookie("uid", token, { maxAge: cookieExp });
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
    data.image =
      data.image == "male"
        ? "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs2/173502583/original/6a346e0505fac7746ebd790a5de335221c42a4a5/draw-a-simple-big-head-cartoon-from-your-photo.png"
        : "https://static.boredpanda.com/blog/wp-content/uploads/2020/09/67950251_497014150843468_6994039138377086122_n-5f60ef7458981__880.jpg";

    const insertedData = await new User(data).save();
    const token = setUser(insertedData);
    res.cookie("uid", token, { maxAge: cookieExp });
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
    const token = setUser(data);
    res.cookie("uid", token, { maxAge: cookieExp });
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
