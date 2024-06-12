const { getUser } = require("./service/auth");
const OrderSchema = require("./Schema");

function validateOrder(req, res, next) {
  console.log("this is the validation");
  let ans = OrderSchema.validate(req.body.booking);
  if (ans.error) {
    console.log("there is error");
    return next(ans.error); // next(err) here default express error handler comes without using error handler middleware
  }
  return next();
}

function checkAuthentication(req, res, next) {
  let token = req.cookies?.uid;
  if (!token) {
    res.locals.currUser = null;
    return next();
  }
  let { data: user } = getUser(token);
  req.user = user;
  res.locals.currUser = user;
  next();
}
function restrictTo(roles) {
  return function (req, res, next) {
    if (!req.user) res.redirect("/user/login");
    if (!roles.includes(req.user.role)) res.send("Authorization denied");
    return next();
  };
}

module.exports = { validateOrder, checkAuthentication, restrictTo };
