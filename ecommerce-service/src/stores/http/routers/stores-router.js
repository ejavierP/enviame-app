const express = require("express");
const validateSchema = require("../../../frameworks/http/middlewares/joi-validate-middleware");
const { createStore, updateStore } = require("../schemas/index");
const checkPermission = require("../../../frameworks/http/middlewares/role-check-middleware");
const httpStatusCode = require("../../../frameworks/http/utils/http-status-code");

function createStoreRouter(manageStoresUsecase) {
  const router = express.Router();

  router.get("/stores", checkPermission("view-stores"), async (req, res) => {
    const stores = await manageStoresUsecase.getStores();
    res.status(200).send(stores);
  });

  router.get("/stores/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const store = await manageStoresUsecase.getStore(id);
      res.status(200).json(store);
    } catch (error) {
      res.status(error.status).send({ message: error.message });
    }
  });

  router.post(
    "/stores",
    validateSchema(createStore),
    checkPermission("create-stores"),
    async (req, res) => {
      try {
        const store = await manageStoresUsecase.createStore(req.body);
        res.status(201).json(store);
      } catch (error) {
        res.status(httpStatusCode.BAD_REQUEST).json({ message: error.message });
      }
    }
  );

  router.put(
    "/stores/:id",
    validateSchema(updateStore),
    checkPermission("update-stores"),
    async (req, res) => {
      try {
        const id = req.params.id;
        const store = await manageStoresUsecase.updateStore(id, req.body);
        res.status(200).send(store);
      } catch (error) {
        res.status(error.status).json({ message: error.message });
      }
    }
  );

  router.delete(
    "/stores/:id",
    checkPermission("delete-stores"),
    async (req, res) => {
      try {
        const id = req.params.id;
        await manageStoresUsecase.deleteStore(id);
        res.status(200).send(`Deleted ${id}`);
      } catch (error) {
        res.status(error.status).json({ message: error.message });
      }
    }
  );

  return router;
}

module.exports = createStoreRouter;
