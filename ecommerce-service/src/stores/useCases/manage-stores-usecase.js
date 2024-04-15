const Store = require("../entities/store");
const {
  BadRequestException,
  NotFoundException,
} = require("../../frameworks/http/errors/index");
class ManageStoresUsecase {
  constructor(storesRepository, usersRepository) {
    this.storesRepository = storesRepository;
    this.usersRepository = usersRepository;
  }

  async getStores() {
    return await this.storesRepository.getStores();
  }

  async getStore(id) {
    const store = await this.storesRepository.getStore(id);
    if (!store) {
      throw new NotFoundException(
        "No se encontro una tienda con el id especificado"
      );
    }
    return store;
  }

  async createStore(data) {
    const store = new Store(
      undefined,
      data.name,
      data.description,
      undefined,
      data.sellerId
    );
    const seller = await this.usersRepository.getUserWithFilters({
      id: data.sellerId,
      role: "marketplace",
    });
    if (!seller) {
      throw new NotFoundException(
        "No se encontraron resultados para el sellerId especificado"
      );
    }
    const id = await this.storesRepository.createStore(store);
    store.id = id;

    return store;
  }

  async updateStore(id, data) {
    try {
      const store = new Store(
        id,
        data.nombre,
        data.descripcion,
        data.warehouseAddress
      );
      await this.storesRepository.updateStore(store);

      return store;
    } catch (error) {
      throw new BadRequestException("Ocurrio un error actualizando la tienda");
    }
  }

  async deleteStore(id) {
    try {
      await this.storesRepository.deleteStore(id);
    } catch (error) {
      throw new BadRequestException("Ocurrio un error borrando la tienda");
    }
  }
}

module.exports = ManageStoresUsecase;
