class Delivery {
  constructor(
    id,
    foreignOrderId,
    products,
    originAddress,
    customerName,
    destinationAddress,
    trackingNumber,
    status,
    date,
    trackings
  ) {
    this.id = id;
    this.foreignOrderId = foreignOrderId;
    this.products = products;
    this.originAddress = originAddress;
    this.customerName = customerName;
    this.destinationAddress = destinationAddress;
    this.trackingNumber = trackingNumber;
    this.status = status;
    this.date = date;
    this.trackings = trackings
  }
}

module.exports = Delivery;
