const Joi = require("joi");

const createDelivery = Joi.object().keys({
  foreignOrderId: Joi.number()
    .required()
    .messages({ "any.required": "Debe proveer un numero de orden" }),
  products: Joi.array()
    .items(
      Joi.object({
        sku: Joi.string(),
        name: Joi.string(),
        qty: Joi.number(),
      })
    )
    .required()
    .min(1),
  origin: Joi.object({ address: Joi.string() }).required().min(1),
  destination: Joi.object({
    name: Joi.string(),
    address: Joi.string(),
  })
    .required()
    .min(1),
  status: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer un status" }),
});

module.exports = { createDelivery };
