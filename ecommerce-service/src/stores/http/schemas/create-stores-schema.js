const Joi = require("joi");

const createStore = Joi.object().keys({
  nombre: Joi.string().required(),
  descripcion: Joi.string().required(),
});

module.exports = { createStore };