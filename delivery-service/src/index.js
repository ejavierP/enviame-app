const createExpressApp = require("./frameworks/http/express");
const { SequelizeClient } = require("./frameworks/db/sequelize");
const SequelizeDeliveryRepository = require("../src/deliviries/repositories/sequelize-delivery-repository");
const ManageDeliveriesUsecase = require("../src/deliviries/useCases/manage-delivery-usecase");
const createDeliveryRouter = require("../src/deliviries/http/routers/deliveries-router");

const sequelizeClient = new SequelizeClient();
const sequelizeDeliveryRepository = new SequelizeDeliveryRepository();
const manageDeliveriesUsecase = new ManageDeliveriesUsecase(
  sequelizeDeliveryRepository
);
sequelizeClient.syncDatabase();

const app = createExpressApp([createDeliveryRouter(manageDeliveriesUsecase)]);
