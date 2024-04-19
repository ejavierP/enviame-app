const express = require("express");
const validateSchema = require("../../../frameworks/http/middlewares/joi-validate-middleware");
const { createDelivery, webhookConfig } = require("../schemas/index");
const httpStatusCode = require("../../../frameworks/http/utils/http-status-code-utils");

function createDeliveryRouter(
  manageDeliveriesUseCase,
  configDeliveryHookUsecase
) {
  const router = express.Router();

  router.get("/deliveries", async (req, res) => {
    const stores = await manageDeliveriesUseCase.getDeliveries();
    res.status(200).send(stores);
  });

  router.get("/deliveries/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const store = await manageDeliveriesUseCase.getDelivery(id);
      res.status(200).json(store);
    } catch (error) {
      res.status(httpStatusCode.NOT_FOUND).send({ message: error.message });
    }
  });

  router.post(
    "/deliveries",
    validateSchema(createDelivery),
    async (req, res) => {
      try {
        const delivery = await manageDeliveriesUseCase.createDelivery(req.body);
        res.status(201).json(delivery);
      } catch (error) {
        res.status(httpStatusCode.BAD_REQUEST).json({ message: error.message });
      }
    }
  );

  router.put("/deliveries/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const store = await manageDeliveriesUseCase.updateDelivery(id, req.body);
      res.status(200).send(store);
    } catch (error) {
      res.status(httpStatusCode.BAD_REQUEST).json({ message: error.message });
    }
  });

  router.delete("/deliveries/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await manageDeliveriesUseCase.deleteDelivery(id);
      res.status(200).send(`Deleted ${id}`);
    } catch (error) {
      res.status(httpStatusCode.BAD_REQUEST).json({ message: error.message });
    }
  });

  router.get("/deliveries/tracking", async (req, res) => {
    try {
      const id = req.params.id;
      const store = await manageDeliveriesUseCase.getDelivery(id);
      res.status(200).json(store);
    } catch (error) {
      res.status(httpStatusCode.NOT_FOUND).send({ message: error.message });
    }
  });

  router.post(
    "/deliveries/webhook/config",
    validateSchema(webhookConfig),
    async (req, res) => {
      try {
        await configDeliveryHookUsecase.configHook(req.body);
        res
          .status(200)
          .json({ message: "Se configuro el webhook correctamente" });
      } catch (error) {
        res.status(httpStatusCode.BAD_REQUEST).json({ message: error.message });
      }
    }
  );

  return router;
}

module.exports = { createDeliveryRouter };
