const Store = require("../entities/store");

class ManageStoresUsecase {
  constructor(storesRepository) {
    this.storesRepository = storesRepository;
  }

  async getStores() {
    return await this.storesRepository.getStores();
  }

  async getStore(id) {
    return await this.storesRepository.getStore(id);
  }

  async createStore(data) {
    const store = new Store(undefined, data.name, data.description);
    const id = await this.storesRepository.createStore(store);
    store.id = id;

    return store;
  }

  async updateStore(id, data) {
    const store = new Store(id, data.nombre, data.descripcion,data.warehouseAddress);
    await this.storesRepository.updateStore(store);

    return store;
  }

  async deleteStore(id) {
    await this.storesRepository.deleteStore(id);
  }
}

module.exports = ManageStoresUsecase;
