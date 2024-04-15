const Joi = require("joi");

const createMarketplaceUser = Joi.object().keys({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer un nombre" }),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  shippingAddress: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer una direccion de entrega" }),
});

module.exports = { createMarketplaceUser };
