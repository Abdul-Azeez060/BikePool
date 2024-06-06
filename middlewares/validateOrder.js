const OrderSchema = require("../Schema");

function validateOrder(req, res, next) {
  console.log("this is the validation");
  let ans = OrderSchema.validate(req.body.booking);
  if (ans.error) {
    console.log("there is error");
    return next(ans.error); // next(err) here default express error handler comes without using error handler middleware
  }
  return next();
}

module.exports = validateOrder;
