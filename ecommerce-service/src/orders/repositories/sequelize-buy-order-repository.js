const { DataTypes } = require("sequelize");
const { db } = require("../../frameworks/db/sequelize");


class SequelizeBuyOrderRepository {
  constructor() {
    this.buyOrderModel = db.BuyOrder
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
      where: { ...filters },
    });
  }

  async getBuyOrderWithFilters(filters) {
    return await this.buyOrderModel.findOne({
      where: { ...filters },
    });
  }

  async createBuyOrder(buyOrder) {
    const buyOrderData = await this.buyOrderModel.create({
      status: buyOrder.status,
      sellerId: buyOrder.sellerId,
      storeAddress: buyOrder.storeAddress,
      customerName: buyOrder.customerName,
      customerAddress: buyOrder.customerAddress,
      createdBy: buyOrder.createdBy
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
        });
      })
    );
  }

  async updateBuyOrder(user) {
    const options = {
      where: {
        id: user.id,
      },
    };

    await this.buyOrderModel.update(user, options);
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
