const express = require("express");
const validateSchema = require("../../../frameworks/http/middlewares/joi-validate-middleware");
const { createMarketplaceUser, loginUser } = require("../schemas/index");

function createUserRouter(ManageUsersUsecase) {
  const router = express.Router();

  router.post(
    "/users/marketplace/register",
    validateSchema(createMarketplaceUser),
    async (req, res) => {
      const user = await ManageUsersUsecase.createMarketplaceUser(req.body);
      res.status(201).send(user);
    }
  );

  router.post("/users/login", validateSchema(loginUser), async (req, res) => {
    const token = await ManageUsersUsecase.login(req.body);
    res.status(200).send({ token });
  });

  return router;
}

module.exports = createUserRouter;
