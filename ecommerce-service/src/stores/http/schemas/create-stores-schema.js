const Joi = require("joi");

const createStore = Joi.object().keys({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer un nombre" }),
  description: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer una descripcion" }),
  sellerId: Joi.number()
    .required()
    .messages({ "any.required": "Debe proveer un seller" }),
});

module.exports = { createStore };
