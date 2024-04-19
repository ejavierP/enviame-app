const { Sequelize } = require("sequelize");

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
    db.Delivery = require("./models/delivery-model.js")(
      this.sequelize,
      Sequelize
    );
    db.DeliveryProduct = require("./models/delivery-product-model.js")(
      this.sequelize,
      Sequelize
    );
    db.DeliveryTracking = require("./models/delivery-tracking-model.js")(
      this.sequelize,
      Sequelize
    );

    db.DeliveryHook = require("./models/deelivery-hook.js")(
      this.sequelize,
      Sequelize
    );

    db.Delivery.hasMany(db.DeliveryProduct, {
      as: "products",
      foreignKey: "deliveryId",
    });
    db.DeliveryProduct.belongsTo(db.Delivery, {
      as: "delivery",
      foreignKey: "deliveryId",
    });

    db.Delivery.hasMany(db.DeliveryTracking, {
      as: "trackings",
      foreignKey: "deliveryId",
    });
    db.DeliveryTracking.belongsTo(db.Delivery, {
      as: "tracking",
      foreignKey: "deliveryId",
    });
  }
}

module.exports = { db, SequelizeClient };
