const { DataTypes } = require("sequelize");
const { db } = require("../../frameworks/db/sequelize");

class SequelizeStoreRepository {
  constructor() {
    this.storeModel = db.Store;
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
    const store = await this.storeModel.findOne({ where: { id } });
    await store.destroy();
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
