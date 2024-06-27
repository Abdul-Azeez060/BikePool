const express = require("express");
const router = express.Router();
const {
  handleDriverSignUp,
  handleUserSignUp,
  handlelogin,
  handleRating,
} = require("../controllers/user");
const { restrictTo, denyAccessTo } = require("../middleware");
const { ExpressError } = require("../utils/ExpressError");

// new user register
router.get("/register", denyAccessTo(["user", "driver"]), (req, res) => {
  res.render("./register.ejs");
});

router.post(
  "/driver/successfull",
  denyAccessTo(["user", "driver"]),
  handleDriverSignUp
);

router.post(
  "/user/successfull",
  denyAccessTo(["user", "driver"]),
  handleUserSignUp
);

router.get("/register/driver", denyAccessTo(["user", "driver"]), (req, res) => {
  res.render("./driverRegister.ejs");
});

router.get("/register/user", denyAccessTo(["user", "driver"]), (req, res) => {
  try {
    res.render("./userRegister.ejs");
  } catch (err) {
    next(err);
  }
});

router.get("/login", async (req, res) => {
  res.render("./login.ejs");
});

router.get("/logOut", async (req, res) => {
  console.log("logout");
  res.clearCookie("uid");
  req.flash("success", "Log Out Successfull");
  res.redirect("/");
});

router.get("/profile", restrictTo(["driver", "user"]), async (req, res) => {
  console.log(res.locals.currUser);
  res.render("./profile.ejs", { user: res.locals.currUser });
});

router.post("/rating/:id", restrictTo(["user"]), handleRating);

router.post("/login/successfull", handlelogin);
module.exports = router;
