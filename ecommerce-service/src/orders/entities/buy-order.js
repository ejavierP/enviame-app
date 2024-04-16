

class BuyOrder {
  constructor(id,status, products,sellerId,customerAddress,customerName,storeAddress) {
    this.id = id;
    this.products = products;
    this.status = status;
    this.sellerId = sellerId;
    this.customerAddress = customerAddress;
    this.customerName = customerName;
    this.storeAddress = storeAddress;
  }
}

module.exports = BuyOrder;