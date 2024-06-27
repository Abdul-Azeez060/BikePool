require("dotenv").config();
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
const cluster = require("cluster");
const os = require("os");

main()
  .then(() => console.log("successfull connected"))
  .catch((err) => console.log(err));

async function main() {
  console.log(process.env.MONGO_URL);
  mongoose.connect("mongodb://127.0.0.1:27017/BikePool");
}

// middleware function
const sessionOptions = {
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 2 * 7 * 24 * 60 * 60 * 1000,
    maxAge: 2 * 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

const numCPUs = os.cpus().length;
console.log(numCPUs);

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const app = express();

  app.set("views", path.join(__dirname, "views"));
  app.use(express.static(path.join(__dirname, "public"))); // css, js static files
  app.set("view engine", "ejs");
  app.engine("ejs", engine);
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true })); // the post request send the data through the url(which is not visible), so we encode the url
  app.use(checkAuthentication);

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

  app.get("/id", (req, res) => {
    const id = process.pid;
    console.log(id);
    res.render("./id.ejs", { id });
  });

  app.all("*", (req, res) => {
    res.render("./page404.ejs");
  });

  app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status);
    res.render("./error.ejs", { message });
  });

  app.listen(port, () => {
    console.log(`server is running ${process.pid}`);
  });
}
