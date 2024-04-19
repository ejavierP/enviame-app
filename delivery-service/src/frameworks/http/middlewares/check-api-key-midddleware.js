module.exports = function (apiKey) {
  return async function (req, res, next) {
    try {
      const headerApiKey = req.headers["x-api-key"];
      const deliveryApiKey = apiKey;

      if (headerApiKey && headerApiKey === deliveryApiKey) {
        return next();
      }

      if (!headerApiKey) {
        return next(
          res.status(401).json({ message: "Debe proveer un api key" })
        );
      }

      return next(
        res.status(401).json({ message: "Debe proveer un api key valido" })
      );
    } catch (err) {
      return next(res.status(401).json({ message: err.message }));
    }
  };
};
