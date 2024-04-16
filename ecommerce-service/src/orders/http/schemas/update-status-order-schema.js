const Joi = require("joi");

const updateBuyOrderStatus = Joi.object().keys({
  status: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer un status" }),
});

module.exports = { updateBuyOrderStatus };
