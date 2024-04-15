const express = require("express");
const validateSchema = require("../../../frameworks/http/middlewares/joi-validate-middleware");
const { createMarketplaceUser } = require('../schemas/index')

function createUserRouter(ManageUsersUsecase) {
  const router = express.Router();

  router.post("/users/marketplace/register", validateSchema(createMarketplaceUser), async (req, res) => {
    const user = await ManageUsersUsecase.createMarketplaceUser(req.body);
    res.status(201).send(user);
  });

  return router;
}

module.exports = createUserRouter;
