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
    });
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

    db.Store.belongsTo(db.User, { as: "stores", foreignKey: "storeId" });

    db.Store.hasMany(db.Product, {
      as: "products",
      foreignKey: "productId",
    });

    db.Product.belongsTo(db.Store, { as: "products", foreignKey: "productId" });

    db.BuyOrder.belongsTo(db.User, {
      as: "ordersSeller",
      foreignKey: "sellerId",
    });
    db.BuyOrder.belongsTo(db.User, {
      as: "ordersCreatedBy",
      foreignKey: "createdByUser",
    });

    db.BuyOrder.hasMany(db.BuyOrderItem, {
      as: "buyOrderItems",
      foreignKey: "buyOrderId",
    });

    db.BuyOrderItem.belongsTo(db.BuyOrder, {
      as: "buyOrderItems",
      foreignKey: "buyOrderId",
    });

    db.User.hasMany(db.Store, {
      as: "stores",
      foreignKey: "storeId",
    });
    db.User.hasMany(db.BuyOrder, {
      as: "ordersSeller",
      foreignKey: "sellerId",
    });
    db.User.hasMany(db.BuyOrder, {
      as: "ordersCreatedBy",
      foreignKey: "createdByUser",
    });
  }

  // async seedData() {
  //   await db.User.bulkCreate([
  //     {
  //       name: "testUser",
  //       password: "prueba",
  //       email: "tes@gmail.com",
  //       role: userRoles.MARKETPLACE,
  //     },
  //     {
  //       name: "testUser2",
  //       password: "prueba",
  //       email: "tes@gmail2.com",
  //       role: userRoles.SELLER,
  //     },
  //     {
  //       name: "testUser3",
  //       password: "prueba",
  //       email: "tes@gmail3.com",
  //       role: userRoles.SELLER,
  //     },
  //     {
  //       name: "testUser4",
  //       password: "prueba",
  //       email: "tes@gmail4.com",
  //       role: userRoles.MARKETPLACE_ADMIN,
  //     },
  //   ]);

  //   await db.Store.bulkCreate([
  //     {
  //       name: "La Sirena 27",
  //       description: "Tienda para todo articulos",
  //       warehouseAddress: "Av prologancion 27",
  //       sellerId: 2,
  //     },
  //     {
  //       name: "La Sirena Naco",
  //       description: "Tienda para todo articulos",
  //       warehouseAddress: "Av Naco DO",
  //       sellerId: 3,
  //     },
  //   ]);

  //   await db.Product.bulkCreate([
  //     {
  //       name: "Celular",
  //       description: "Rojo",
  //       quantity: 10,
  //       sku: "SKU-001",
  //       price: 1200.8,
  //       storeId: 1,
  //     },
  //     {
  //       name: "Carro",
  //       description: "Rojo",
  //       quantity: 10,
  //       sku: "SKU-002",
  //       price: 8000.2,
  //       storeId: 2,
  //     },
  //   ]);
  // }
}

module.exports = { db, SequelizeClient };
