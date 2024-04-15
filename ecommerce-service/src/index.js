const createExpressApp = require("./frameworks/http/express");
const SequelizeClient = require("./frameworks/db/sequelize");
const StoreRepository = require("./stores/repositories/sequelize-store-repository");
const createStoreRouter = require("./stores/http/routers/stores-router");
const ManageStoresUseCase = require("./stores/useCases/manage-stores-usecase");
const ManageUsersUsecase = require('./users/useCases/manage-users-usecase');
const UserRepository = require('./users/repositories/sequelize-user-repository');
const createUserRouter = require("./users/http/routers/users-router");

const sequelizeClient = new SequelizeClient();
const storeRepository = new StoreRepository(sequelizeClient);
const userRepository = new UserRepository(sequelizeClient);
const manageUsersUseCase = new ManageUsersUsecase(userRepository);
const manageStoresUseCase = new ManageStoresUseCase(storeRepository,userRepository);
sequelizeClient.syncDatabase();

let routers = [createStoreRouter(manageStoresUseCase),
               createUserRouter(manageUsersUseCase)];

const app = createExpressApp(routers);
