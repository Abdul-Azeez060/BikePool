const Joi = require("joi");

const OrderSchema = Joi.object({
  pickUp: Joi.string().required(),
  dropIn: Joi.string().required(),
  time: Joi.number().required(),
  price: Joi.number().min(1),
});

module.exports = OrderSchema;
