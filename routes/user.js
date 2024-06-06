const express = require("express");
const router = express.Router();

// new user register
router.get("/register", (req, res) => {
  res.render("./register.ejs");
});

router.post("/successfull", (req, res) => {
  console.log(req.body);
  res.redirect("./register/driver");
});

router.get("/register/driver", (req, res) => {
  res.render("./driver.ejs");
});

router.get("/verification", (req, res) => {
  res.render("./verification.ejs");
});

router.get("/register/user", (req, res) => {
  res.render("./user.ejs");
});

module.exports = router;
