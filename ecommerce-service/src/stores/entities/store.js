

class Store {
  constructor(id,name, description,warehouseAddress,sellerId) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.warehouseAddress = warehouseAddress;
    this.sellerId = sellerId;
  }
}

module.exports = Store;