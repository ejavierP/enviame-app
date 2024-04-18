const Joi = require("joi");

const updateStore = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string(),
  warehouseAddress: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer una descripcion" }),
});

module.exports = { updateStore };
