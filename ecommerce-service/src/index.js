const createExpressApp = require("./frameworks/http/express");
const SequelizeClient = require("./frameworks/db/sequelize");
const StoreRepository = require("./stores/repositories/sequelize-store-repository");
const createStoreRouter = require("./stores/http/routers/stores-router");
const ManageStoresUseCase = require("./stores/useCases/manage-stores-usecase");

const sequelizeClient = new SequelizeClient();
const storeRepository = new StoreRepository(sequelizeClient);
const manageStoresUseCase = new ManageStoresUseCase(storeRepository);
sequelizeClient.syncDatabase();

let routers = [createStoreRouter(manageStoresUseCase)];

const app = createExpressApp(routers);
