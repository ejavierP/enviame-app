const Joi = require("joi");

const createBuyOrder = Joi.object().keys({
  products: Joi.array().items({
    id: Joi.number().required(),
    quantity: Joi.number().required(),
  }),
  
});


module.exports = { createBuyOrder };
