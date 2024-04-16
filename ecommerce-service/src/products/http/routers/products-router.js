const express = require("express");
const validateSchema = require("../../../frameworks/http/middlewares/joi-validate-middleware");
const { createUpdateProduct } = require("../schemas/index");
const checkPermission = require("../../../frameworks/http/middlewares/role-check-middleware");
const httpStatusCode = require("../../../frameworks/http/utils/http-status-code");

function createProductsRouter(manageProductsUsecase) {
  const router = express.Router();

  router.get("/products", checkPermission("view-products"), async (req, res) => {
    const products = await manageProductsUsecase.getProducts();
    res.status(200).send(products);
  });

  router.get("/products/:id", checkPermission('view-single-product'),async (req, res) => {
    try {
      const id = req.params.id;
      const product = await manageProductsUsecase.getProduct(id);
      res.status(200).json(product);
    } catch (error) {
      res.status(error.status).send({ message: error.message });
    }
  });

  router.post(
    "/products",
    validateSchema(createUpdateProduct),
    checkPermission("create-products"),
    async (req, res) => {
      try {
        const product = await manageProductsUsecase.createProduct(req.body);
        res.status(201).json(product);
      } catch (error) {
        res.status(httpStatusCode.BAD_REQUEST).json({ message: error.message });
      }
    }
  );

  router.put(
    "/products/:id",
    validateSchema(createUpdateProduct),
    checkPermission("update-products"),
    async (req, res) => {
      try {
        const id = req.params.id;
        const product = await manageProductsUsecase.updateProduct(id, req.body);
        res.status(200).send(product);
      } catch (error) {
        res.status(error.status).json({ message: error.message });
      }
    }
  );

  router.delete(
    "/products/:id",
    checkPermission("delete-products"),
    async (req, res) => {
      try {
        const id = req.params.id;
        await manageProductsUsecase.deleteProduct(id);
        res.status(200).json({message: `Deleted product with ${id}`});
      } catch (error) {
        res.status(error.status).json({ message: error.message });
      }
    }
  );

  return router;
}

module.exports = createProductsRouter;
