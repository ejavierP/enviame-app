const createHttpError = require("http-errors");
const schemas = require("../schemas/index");

module.exports = function (schema) {
  if (!schemas.hasOwnProperty(schema))
    throw new Error(`'${schema}' validator is not exist`);

  return async function (req, res, next) {
    try {
      const validated = await schemas[schema].validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err) {
      if (err.isJoi)
        return next(createHttpError(422, { message: err.message }));
      next(createHttpError(500));
    }
  };
};
