const express = require("express");
const schemaValidate = require("../middlewares/joi-validate-middleware");

function createStoreRouter(manageStoresUsecase) {
  const router = express.Router();

  router.get("/stores", async (req, res) => {
    const stores = await manageStoresUsecase.getStores();
    res.status(200).send(stores);
  });

  router.get("/store/:id", async (req, res) => {
    const id = req.params.id;
    const store = await manageStoresUsecase.getStore(id);

    res.status(200).send(store);
  });

  router.post("/stores", schemaValidate("createStore"), async (req, res) => {
    const store = await manageStoresUsecase.createStore(req.body);
    res.status(201).send(store);
  });

  router.put("/store/:id", async (req, res) => {
    const id = req.params.id;
    const store = await manageStoresUsecase.updateBook(id, req.body);
    res.status(200).send(store);
  });

  router.delete("/store/:id", async (req, res) => {
    const id = req.params.id;
    await manageStoresUsecase.deleteStore(id);

    res.status(200).send(`Deleted ${id}`);
  });

  return router;
}

module.exports = createStoreRouter;
