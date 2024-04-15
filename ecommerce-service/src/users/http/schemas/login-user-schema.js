const Joi = require("joi");

const loginUser = Joi.object().keys({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Debe proveer un nombre" }),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

module.exports = { loginUser };
