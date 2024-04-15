module.exports = function (schema) {
  return async function (req, res, next) {
    try {
      const validated = await schema.validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err) {
      if (err.isJoi)
        return next(res.status(500).json({ message: err.details[0].message }));
    }
  };
};
