const express = require("express");
const validateSchema = require("../../../frameworks/http/middlewares/joi-validate-middleware");
const { createBuyOrder } = require("../schemas/index");
const checkPermission = require("../../../frameworks/http/middlewares/role-check-middleware");

function createBuyOrdersRouter(ManageBuyOrdersUsecase) {
  const router = express.Router();

  router.post(
    "/orders",
    validateSchema(createBuyOrder),
    checkPermission("create-buy-orders"),
    async (req, res) => {
      try {
        const buyOrder = await ManageBuyOrdersUsecase.createBuyOrder(req.body, {
          shippingAddress: req.user.shippingAddress,
          name: req.user.name,
        });
        res.status(201).json(buyOrder);
      } catch (error) {
        res.status(error.status).json({ message: error.message });
      }
     
    }
  );

  return router;
}

module.exports = createBuyOrdersRouter;
