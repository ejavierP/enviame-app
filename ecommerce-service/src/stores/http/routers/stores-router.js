const express = require("express");
const validateSchema = require("../../../frameworks/http/middlewares/joi-validate-middleware");
const { createStore ,updateStore} = require("../schemas/index");
const checkPermission = require("../../../frameworks/http/middlewares/role-check-middleware");

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
  
      res.status(200).send(store);
    } catch (error) {
      res.status(error.status).send({message:error.message});
    }
   
  });

  router.post(
    "/stores",
    validateSchema(createStore),
    checkPermission("create-stores"),
    async (req, res) => {
      try {
        const store = await manageStoresUsecase.createStore(req.body);
        res.status(201).send(store);
      } catch (error) {
        res.status(500).send(error.message);
      }
     
    }
  );

  router.put(
    "/stores/:id",
    validateSchema(createStore),
    checkPermission("update-stores"),
    async (req, res) => {
      const id = req.params.id;
      const store = await manageStoresUsecase.updateStore(id, req.body);
      res.status(200).send(store);
    }
  );

  router.delete(
    "/stores/:id",
    checkPermission("delete-stores"),
    async (req, res) => {
      const id = req.params.id;
      await manageStoresUsecase.deleteStore(id);

      res.status(200).send(`Deleted ${id}`);
    }
  );

  return router;
}

module.exports = createStoreRouter;
