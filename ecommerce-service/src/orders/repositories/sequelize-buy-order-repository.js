const { DataTypes } = require("sequelize");
const BuyOrderModel = require("./models/buy-order-model");
const BuyOrderItem = require("./models/buy-order-item-model");

class SequelizeBuyOrderRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    let tableNameOrders = "buyOrders";
    let tableNameOrdersItem = "buyOrderItems";

    if (test) {
      tableNameOrders += "_test";
      tableNameOrdersItem += "_test";
    }

    const options = {
      tableName: tableNameOrders,
      timestamps: false,
    };

    this.buyOrderModel = BuyOrderModel(sequelizeClient, DataTypes, options);
    this.buyOrderItemModel = BuyOrderItem(sequelizeClient, DataTypes, {
      tableName: tableNameOrdersItem,
      timestamps: false,
    });
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

  async getBuyOrderWithFilters(filters) {
    return await this.buyOrderModel.findOne({
      where: { ...filters },
    });
  }

  async createBuyOrder(buyOrder) {
    const tId = await this.sequelizeClient.sequelize.transaction();
    const buyOrderData = await this.buyOrderModel.create(
      {
        status: buyOrder.status,
        sellerId: buyOrder.sellerId,
        storeAddress: buyOrder.storeAddress,
        customerName: buyOrder.customerName,
        customerAddress: buyOrder.customerAddress,
      },
      { transaction: tId }
    );

    const buyOrderId = buyOrderData.id;

    if (buyOrderId) {
      await this.createBuyOrderItems(buyOrder.products, buyOrderId, tId);
    }

    return buyOrderId;
  }

  async createBuyOrderItems(products, buyOrderId, tId) {
    await Promise.all(
      products.map(async (product) => {
        await this.buyOrderItemModel.create(
          {
            name: product.name,
            sku: product.sku,
            quantity: product.quantity,
            buyOrderId: buyOrderId,
          },
          { transaction: tId }
        );
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
