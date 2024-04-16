const createExpressApp = require("./frameworks/http/express");
const SequelizeClient = require("./frameworks/db/sequelize");
const StoreRepository = require("./stores/repositories/sequelize-store-repository");
const createStoreRouter = require("./stores/http/routers/stores-router");
const ManageStoresUseCase = require("./stores/useCases/manage-stores-usecase");
const ManageUsersUsecase = require('./users/useCases/manage-users-usecase');
const ManageProductsUsecase = require('./products/useCases/manage-products-usecase');
const UserRepository = require('./users/repositories/sequelize-user-repository');
const ProductRepository = require('./products/repositories/sequelize-product-repository');
const createUserRouter = require("./users/http/routers/users-router");
const createProductRouter = require("./products/http/routers/products-router");
const BuyOrdeRepository = require('./orders/repositories/sequelize-buy-order-repository');
const ManageBuyOrdersUsecase = require('./orders/useCases/manage-buy-orders-usecase')
const createBuyOrderRouter = require("./orders/http/routers/buy-orders-router");

const sequelizeClient = new SequelizeClient();
const storeRepository = new StoreRepository(sequelizeClient);
const userRepository = new UserRepository(sequelizeClient);
const productRepository = new ProductRepository(sequelizeClient);
const buyOrdeRepository = new BuyOrdeRepository(sequelizeClient)
const manageUsersUseCase = new ManageUsersUsecase(userRepository);
const manageStoresUseCase = new ManageStoresUseCase(storeRepository,userRepository);
const manageProductsUseCase = new ManageProductsUsecase(productRepository,storeRepository);
const manageBuyOrdersUseCase = new ManageBuyOrdersUsecase(buyOrdeRepository,productRepository,storeRepository);

sequelizeClient.syncDatabase();

let routers = [createStoreRouter(manageStoresUseCase),
               createUserRouter(manageUsersUseCase),
               createProductRouter(manageProductsUseCase),
               createBuyOrderRouter(manageBuyOrdersUseCase)];

const app = createExpressApp(routers);
