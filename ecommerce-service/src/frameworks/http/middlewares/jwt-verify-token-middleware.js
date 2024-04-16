const { verify } = require("../jwt");
module.exports = function () {
  return async function (req, res, next) {
    try {
      const excludedPaths = ["/users/marketplace/register", "/users/login"];
      if (excludedPaths.includes(req.originalUrl)) {
        return next();
      }
      const token = req.header("Authorization");
      const tokenNormalized = token.split(" ")[1];
      const decodedToken = await verify(tokenNormalized);
      req.user = decodedToken.user;
      return next();
    } catch (err) {
      return next(res.status(401).json({ message: err.message }));
    }
  };
};
