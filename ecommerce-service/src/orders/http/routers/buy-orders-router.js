const express = require("express");
const validateSchema = require("../../../frameworks/http/middlewares/joi-validate-middleware");
const { createBuyOrder } = require("../schemas/index");
const checkPermission = require("../../../frameworks/http/middlewares/role-check-middleware");
const { userRoles } = require("../../../users/utils/user-role");
const orderValidStatusByRole = require("../../utils/get-order-valid-status-by-role");
const { BadRequestException } = require("../../../frameworks/http/errors");
const { buildOrderFilters } = require("../../utils/build-order-filters-util");

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
          id: req.user.id,
        });
        res.status(201).json(buyOrder);
      } catch (error) {
        res.status(error.status).json({ message: error.message });
      }
    }
  );

  router.get(
    "/orders",
    checkPermission("view-buy-orders"),
    async (req, res) => {
      try {
        const role = req.user.role;
        const status = req.query.status;
        const filters = buildOrderFilters(role, status, undefined, req.user.id);
        const buyOrder = await ManageBuyOrdersUsecase.getBuyOrders(filters);
        res.status(200).json(buyOrder);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  );

  router.get(
    "/orders/:id",
    checkPermission("view-single-buy-orders"),
    async (req, res) => {
      try {
        const id = req.params.id;
        const role = req.user.role;
        const status = req.query.status;
        const filters = buildOrderFilters(role, status, id, req.user.id);
        const buyOrder = await ManageBuyOrdersUsecase.getBuyOrder(filters);
        res.status(200).json(buyOrder);
      } catch (error) {
        res.status(error.status).send({ message: error.message });
      }
    }
  );

  return router;
}

module.exports = createBuyOrdersRouter;
