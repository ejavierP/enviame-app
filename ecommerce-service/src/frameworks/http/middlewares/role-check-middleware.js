module.exports = function (permission) {
  return async function (req, res, next) {
    try {
      //Esto se pueda migrar hacia entidad
      const permissionsByRole = {
        marketplace_admin: [
          "update-stores",
          "create-stores",
          "delete-stores",
          "view-stores",
          "view-single-store",
          "view-buy-orders",
        ],
        seller: [
          "update-stores",
          "view-stores",
          "create-products",
          "view-products",
          "update-products",
          "delete-products",
          "view-single-product",
          "view-single-buy-orders",
          "view-buy-orders",
        ],
        marketplace: [
          "create-buy-orders",
          "cancel-buy-order",
        ],
      };

      const permissions = permissionsByRole[req.role];

      if (permissions.includes(permission)) {
        return next();
      }

      return next(
        res
          .status(401)
          .json({ message: "No tienes permisos para realizar esa accion" })
      );
    } catch (err) {
      return next(res.status(401).json({ message: err.message }));
    }
  };
};
