const { DataTypes } = require("sequelize");
const { db } = require("../../frameworks/db/sequelize");

class SequelizeBuyOrderRepository {
  constructor() {
    this.buyOrderModel = db.BuyOrder;
    this.buyOrderItemModel = db.BuyOrderItem;
  }

  async getBuyOrders() {
    const users = await this.buyOrderModel.findAll({
      raw: true,
    });

    return users;
  }

  async getBuyOrder(id) {
    return await this.buyOrderModel.findByPk(id);
  }

  async getBuyOrdersWithFilters(filters) {
    return await this.buyOrderModel.findAll({
      attributes: ["id","status","storeAddress","customerName","customerAddress"],
      where: { ...filters },
      include: [{ model:  this.buyOrderItemModel, as: "buyOrderItems",  attributes: ["name","sku","quantity"], }],
    });
  }

  async getBuyOrderWithFilters(filters) {
    return await this.buyOrderModel.findOne({
      attributes: ["status","storeAddress","customerName","customerAddress"],
      where: { ...filters },
      include: [{ model:  this.buyOrderItemModel, as: "buyOrderItems", attributes: ["name","sku","quantity","productId"] }],
    });
  }

  async createBuyOrder(buyOrder) {
    const buyOrderData = await this.buyOrderModel.create({
      status: buyOrder.status,
      sellerId: buyOrder.sellerId,
      storeAddress: buyOrder.storeAddress,
      customerName: buyOrder.customerName,
      customerAddress: buyOrder.customerAddress,
      createdByUser: buyOrder.createdBy,
      createdDate: new Date().toDateString(),
    });

    const buyOrderId = buyOrderData.id;

    if (buyOrderId) {
      await this.createBuyOrderItems(buyOrder.products, buyOrderId);
    }

    return buyOrderId;
  }

  async createBuyOrderItems(products, buyOrderId) {
    await Promise.all(
      products.map(async (product) => {
        await this.buyOrderItemModel.create({
          name: product.name,
          sku: product.sku,
          quantity: product.quantity,
          buyOrderId: buyOrderId,
          productId: product.productId,
        });
      })
    );
  }

  async updateBuyOrder(buyOrder) {
    const options = {
      where: {
        id: buyOrder.id,
      },
    };

    await this.buyOrderModel.update(buyOrder, options);
  }

  async deleteBuyOrder(id) {
    const buyOrder = await this.buyOrderModel.findOne({ where: { id } });
    await buyOrder.destroy();
  }

  async deleteAllBuyOrders() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.buyOrderModel.destroy(options);
    }
  }

  async dropBuyOrdersTable() {
    if (this.test) {
      await this.buyOrderModel.drop();
    }
  }
}

module.exports = SequelizeBuyOrderRepository;
