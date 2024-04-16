

class Product {
  constructor(id,name, description,quantity,sku,price,storeId) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.sku = sku;
    this.price = price;
    this.storeId = storeId;
  }
}

module.exports = Product;