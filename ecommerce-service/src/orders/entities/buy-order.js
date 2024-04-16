class BuyOrder {
  constructor(
    id,
    status,
    products,
    sellerId,
    customerAddress,
    customerName,
    storeAddress,
    createdBy
  ) {
    this.id = id;
    this.products = products;
    this.status = status;
    this.sellerId = sellerId;
    this.customerAddress = customerAddress;
    this.customerName = customerName;
    this.storeAddress = storeAddress;
    this.createdBy = createdBy;
  }
}

module.exports = BuyOrder;
