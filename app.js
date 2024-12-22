require("dotenv").config({ path: "./.env" });
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const bookingsRouter = require("./routes/bookings");
const usersRouter = require("./routes/user");
const { checkAuthentication } = require("./middleware");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const port = 8080;
const cluster = require("cluster");
const os = require("os");
const { Review } = require("./models/Reviews");
const { ExpressError } = require("./utils/ExpressError");

main();

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("successfully connected");
  } catch (error) {
    next(new ExpressError("couldn't not connect to the database", 500));
  }
}

// middleware function
const sessionOptions = {
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUninitialized: false,
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
  app.get("/", async (req, res) => {
    try {
      const reviews = await Review.find();
      res.render("./home.ejs", { reviews });
    } catch (err) {
      next(err);
    }
  });

  app.get("/id", (req, res) => {
    const id = process.pid;

    res.render("./id.ejs", { id });
  });
  app.get("/notify", (req, res) => {
    res.render("./notify.ejs");
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
