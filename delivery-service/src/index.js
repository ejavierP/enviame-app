const createExpressApp = require("./frameworks/http/express");
const { SequelizeClient } = require("./frameworks/db/sequelize");
const SequelizeDeliveryRepository = require("../src/deliviries/repositories/sequelize-delivery-repository");
const ManageDeliveriesUsecase = require("../src/deliviries/useCases/manage-delivery-usecase");
const ConfigDeliveryHookUsecase = require("../src/deliviries/useCases/config-hook-delivery-use-case");
const SequelizeDeliveryHookRepository = require("../src/deliviries/repositories/sequelize-delivery-hook-repository");
const {
  createDeliveryRouter,
} = require("../src/deliviries/http/routers/deliveries-router");

const scheduleOrderUpdate = require("./frameworks/scheduler/order-update-scheduler");

const sequelizeClient = new SequelizeClient();
const sequelizeDeliveryRepository = new SequelizeDeliveryRepository();
const sequelizeDeliveryHookRepository = new SequelizeDeliveryHookRepository();
const manageDeliveriesUsecase = new ManageDeliveriesUsecase(
  sequelizeDeliveryRepository,
  sequelizeDeliveryHookRepository
);
const configDeliveryHookUsecase = new ConfigDeliveryHookUsecase(
  sequelizeDeliveryHookRepository
);
sequelizeClient.syncDatabase();

const app = createExpressApp([
  createDeliveryRouter(manageDeliveriesUsecase, configDeliveryHookUsecase),
]);
scheduleOrderUpdate();
