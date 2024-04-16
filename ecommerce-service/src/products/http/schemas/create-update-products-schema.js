const Joi = require("joi");

const createUpdateProduct = Joi.object().keys({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer un nombre" }),
  description: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer una descripcion" }),
  price: Joi.number()
    .required()
    .messages({ "any.required": "Debe proveer un precio para el producto" }),
  sku: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer un sku para el producto" }),
  quantity: Joi.number()
    .required()
    .messages({ "any.required": "Debe proveer un quantity para el producto" }),
  storeId: Joi.number()
    .required()
    .messages({ "any.required": "Debe proveer la tienda para el producto" }),
});

module.exports = { createUpdateProduct };
