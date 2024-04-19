const express = require("express");
const validateSchema = require("../../../frameworks/http/middlewares/joi-validate-middleware");
const { createBuyOrder, updateBuyOrderStatus } = require("../schemas/index");
const checkPermission = require("../../../frameworks/http/middlewares/role-check-middleware");
const { buildOrderFilters } = require("../../utils/build-order-filters-util");
const checkApiKey = require("../../../frameworks/http/middlewares/check-api-key-middleware");
const { BadRequestException } = require("../../../frameworks/http/errors");

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

  router.patch(
    "/orders/:id/status/update",
    checkPermission("update-buy-orders-status"),
    async (req, res) => {
      try {
        const id = req.params.id;
        await ManageBuyOrdersUsecase.updateOrderStatus(
          id,
          req.body.status,
          req.origin
        );
        res
          .status(200)
          .json({ message: "Se transiciono la orden correctamente" });
      } catch (error) {
        res.status(error.status).send({ message: error.message });
      }
    }
  );

  router.post(
    "/orders/:id/cancel",
    checkPermission("cancel-buy-orders"),
    async (req, res) => {
      try {
        const id = req.params.id;
        await ManageBuyOrdersUsecase.cancelBuyOrder(id, req.body.status);
        res.status(200).json({ message: "Se cancelo la orden correctamente" });
      } catch (error) {
        res.status(error.status).send({ message: error.message });
      }
    }
  );

  router.post(
    "/orders/status/webhook",
    validateSchema(updateBuyOrderStatus),
    checkApiKey(process.env.ECOMMERCE_API_KEY),
    async (req, res) => {
      try {
        await ManageBuyOrdersUsecase.updateOrderStatus(
          req.body.orderId,
          req.body.status,
          req.origin
        );
        res.status(200).json({
          message: "Se Actualizo el status de la orden orden correctamente",
        });
      } catch (error) {
        res.status(error.status).send({ message: error.message });
      }
    }
  );

  return router;
}

module.exports = createBuyOrdersRouter;
