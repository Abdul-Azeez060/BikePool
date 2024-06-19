const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const bookingsRouter = require("./routes/bookings");
const usersRouter = require("./routes/user");
const { checkAuthentication } = require("./middleware");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const port = 8080;

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); // css, js static files
app.set("view engine", "ejs");
app.engine("ejs", engine);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // the post request send the data through the url(which is not visible), so we encode the url
app.use(checkAuthentication);

main()
  .then(() => console.log("successfull connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/BikePool");
}

// middleware function
const sessionOptions = {
  secret: "aBdUl$aZeeZ#2145",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 2 * 7 * 24 * 60 * 60 * 1000,
    maxAge: 2 * 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/bookings", bookingsRouter);
app.use("/user", usersRouter);

//home page
app.get("/", (req, res) => {
  res.render("./home.ejs");
});

app.use((err, req, res, next) => {
  res.status(400);
  console.log(err);
  res.render("./error.ejs", { error: err });
});

app.listen(port, () => {
  console.log("server is running");
});
