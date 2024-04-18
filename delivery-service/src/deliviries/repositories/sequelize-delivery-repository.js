const { db } = require("../../frameworks/db/sequelize");

class SequelizeDeliveryRepository {
  constructor() {
    this.deliveryModel = db.Delivery;
    this.deliveryTrackingModel = db.DeliveryTracking;
    this.deliveryProductModel = db.DeliveryProduct;
  }

  async getDeliveries() {
    const deliveries = await this.deliveryModel.findAll({
      raw: true,
    });

    return deliveries;
  }

  async getDelivery(id) {
    return await this.deliveryModel.findByPk(id);
  }

  async createDelivery(delivery) {
    const data = await this.deliveryModel.create(delivery, {
      include: [
        { model: this.deliveryTrackingModel, as: "trackings" },
        { model: this.deliveryProductModel, as: "products" },
      ],
    });
    return data.id;
  }

  async updateDelivery(delivery) {
    const options = {
      where: {
        id: delivery.id,
      },
    };

    await this.deliveryModel.update(delivery, options);
  }

  async deleteDelivery(id) {
    const delivery = await this.deliveryModel.findOne({ where: { id } });
    await delivery.destroy();
  }

  async getDeliveriesTracking(filters) {
    const deliveriesTracking = await this.deliveryModel.findAll({
      raw: true,
      where: { ...filters },
      include: [{ model: this.deliveryTrackingModel, as: "trackings" }],
    });

    return deliveriesTracking;
  }
}

module.exports = SequelizeDeliveryRepository;
