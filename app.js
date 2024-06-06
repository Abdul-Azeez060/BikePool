const express = require("express");
const path = require("path");
const engine = require("ejs-mate");
const bookingsRouter = require("./routes/bookings");
const usersRouter = require("./routes/user");

const app = express();
const port = 8080;

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); // css, js static files
app.set("view engine", "ejs");
app.engine("ejs", engine);
app.use(express.urlencoded({ extended: true })); // the post request send the data through the url(which is not visible), so we encode the url

app.use("/bookings", bookingsRouter);
app.use("/user", usersRouter);
// middleware function

//home page
app.get("/", (req, res) => {
  res.render("./home.ejs");
});

app.use((err, req, res, next) => {
  res.status(400);
  console.log(err);
  res.render("./error.ejs", { error: err.details[0]?.message });
});

app.listen(port, () => {
  console.log("server is running");
});
