const Joi = require("joi");

const updateBuyOrderStatus = Joi.object().keys({
  status: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer un status" }),
  orderId: Joi.number()
    .required()
    .messages({ "any.required": "Debe proveer un id de la orden" }),
});

module.exports = { updateBuyOrderStatus };
