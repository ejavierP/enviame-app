const Joi = require("joi");

const createStore = Joi.object().keys({
  nombre: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer un nombre" }),
  descripcion: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer una descripcion" }),
});

module.exports = { createStore };
