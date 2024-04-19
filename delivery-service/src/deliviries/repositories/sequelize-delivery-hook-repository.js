const { db } = require("../../frameworks/db/sequelize");

class SequelizeDeliveryHookRepository {
  constructor() {
    this.deliveryHook = db.DeliveryHook;
  }

  async createDeliveryHook(deliveryHook) {
    const data = await this.deliveryHook.create(deliveryHook);
    return data.id;
  }

  async getDeliveriesHookConfig() {
    const deliveriesHookConfig = await this.deliveryHook.findAll({
      raw: true,
    });

    return deliveriesHookConfig;
  }
}

module.exports = SequelizeDeliveryHookRepository;
