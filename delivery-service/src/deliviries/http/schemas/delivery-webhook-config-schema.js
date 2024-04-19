const Joi = require("joi");

const webhookConfig = Joi.object().keys({
  url: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer una url" }),
  apiKey: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer una api key" }),
});

module.exports = { webhookConfig };
