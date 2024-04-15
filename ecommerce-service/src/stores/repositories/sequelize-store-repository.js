const { DataTypes } = require("sequelize");
const StoreModel = require("./models/store-model");

class SequelizeStoreRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    let tableName = "stores";

    if (test) {
      tableName += "_test";
    }

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.storeModel = StoreModel(sequelizeClient,DataTypes,options);
  }

  async getStores() {
    const stores = await this.storeModel.findAll({
      raw: true,
    });

    return stores;
  }

  async getStore(id) {
    return await this.storeModel.findByPk(id);
  }

  async createStore(store) {
    const data = await this.storeModel.create(store);
    return data.id;
  }

  async updateStore(store) {
    const options = {
      where: {
        id: store.id,
      },
    };

    await this.storeModel.update(store, options);
  }

  async deleteStore(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.storeModel.destroy(options);
  }

  async deleteAllStores() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.storeModel.destroy(options);
    }
  }

  async dropStoresTable() {
    if (this.test) {
      await this.storeModel.drop();
    }
  }
}

module.exports = SequelizeStoreRepository;
