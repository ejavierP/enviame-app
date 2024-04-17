const { Sequelize } = require("sequelize");
const { userRoles } = require("../../users/utils/user-role.js");

let db = {};
class SequelizeClient {
  constructor() {
    const dialect = process.env.SEQUELIZE_DIALECT;
    const username = process.env.SEQUELIZE_USERNAME;
    const password = process.env.SEQUELIZE_PASSWORD;
    const database = process.env.SEQUELIZE_DATABASE;

    const host = process.env.SEQUELIZE_HOST;

    this.sequelize = new Sequelize(database, username, password, {
      dialect: dialect,
      host: host,
      logging: false,
    });

    this.assocations();
  }

  syncDatabase() {
    var syncOptions = {
      alter: false,
    };

    this.sequelize.sync(syncOptions).catch((error) => {
      console.log("Couldn't sync database", error);
    }).then(() => {
      console.log('Seeding Database')
      this.seedData()
    })
  }

  assocations() {
    db.Store = require("./models/store-model.js")(this.sequelize, Sequelize);
    db.BuyOrder = require("./models/buy-order-model.js")(
      this.sequelize,
      Sequelize
    );
    db.BuyOrderItem = require("./models/buy-order-item-model.js")(
      this.sequelize,
      Sequelize
    );
    db.User = require("./models/user-model.js")(this.sequelize, Sequelize);
    db.Product = require("./models/product-model.js")(
      this.sequelize,
      Sequelize
    );

    db.Store.belongsTo(db.User, { as: "storeUser", foreignKey: "sellerId" });
    db.User.hasMany(db.Store, {
      as: "stores",
      foreignKey: "sellerId",
    });

    db.Store.hasMany(db.Product, {
      as: "products",
      foreignKey: "storeId",
    });

    db.Product.belongsTo(db.Store, { as: "store", foreignKey: "storeId" });

    db.BuyOrder.belongsTo(db.User, {
      as: "seller",
      foreignKey: "sellerId",
    });
    db.BuyOrder.belongsTo(db.User, {
      as: "createdBy",
      foreignKey: "createdByUser",
    });

    db.BuyOrder.hasMany(db.BuyOrderItem, {
      as: "buyOrderItems",
      foreignKey: "buyOrderId",
    });

    db.BuyOrderItem.belongsTo(db.BuyOrder, {
      as: "buyOrder",
      foreignKey: "buyOrderId",
    });
    db.User.hasMany(db.BuyOrder, {
      as: "sellers",
      foreignKey: "sellerId",
    });
    db.User.hasMany(db.BuyOrder, {
      as: "createdsBy",
      foreignKey: "createdByUser",
    });
  }

  async seedData() {
    await db.User.create({
      name: "testUser",
      password: "prueba",
      email: "tes@gmail.com",
      shippingAddress: "Av prologancion 27",
      role: userRoles.MARKETPLACE,
    });
    const seller = await db.User.create({
      name: "testUser2",
      password: "prueba",
      email: "tes@gmail2.com",
      role: userRoles.SELLER,
    });
    await db.User.create({
      name: "testUser4",
      password: "prueba",
      email: "tes@gmail4.com",
      role: userRoles.MARKETPLACE_ADMIN,
    });

    const store = await db.Store.create({
      name: "La Sirena 27",
      description: "Tienda para todo articulos",
      warehouseAddress: "Av prologancion 27",
      sellerId: seller.id,
    });

    await db.Product.bulkCreate([
      {
        name: "Celular",
        description: "Rojo",
        quantity: 10,
        sku: "SKU-001",
        price: 1200.8,
        storeId: store.id,
      },
      {
        name: "Carro",
        description: "Rojo",
        quantity: 10,
        sku: "SKU-002",
        price: 8000.2,
        storeId: store.id,
      },
    ]);
  }
}

module.exports = { db, SequelizeClient };
