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
      include: [{ model: this.deliveryTrackingModel, as: "trackings" }],
    };

    await this.deliveryModel.update(delivery, options);
  }

  async deleteDelivery(id) {
    const delivery = await this.deliveryModel.findOne({ where: { id } });
    await delivery.destroy();
  }

  async getDeliveryTracking(filters) {
    const deliveriyTracking = await this.deliveryTrackingModel.findOne({
      raw: true,
      where: { ...filters },
      order: [["date", "DESC"]],
    });

    return deliveriyTracking;
  }

  async getDeliveryTrackings(filters) {
    const deliveriyTracking = await this.deliveryModel.findAll({
      attributes: ["status", "trackingNumber"],
      where: { ...filters },
      include: [
        {
          model: this.deliveryTrackingModel,
          as: "trackings",
          attributes: ["status", "date"],
        },
      ],
    });

    return deliveriyTracking;
  }

  async createTracking(tracking) {
    try {
      const data = await this.deliveryTrackingModel.create(tracking);
      return data.id;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateDeliveryTracking(deliveryTracking) {
    const options = {
      where: {
        id: deliveryTracking.id,
      },
    };

    await this.deliveryTrackingModel.update(deliveryTracking, options);
  }
}

module.exports = SequelizeDeliveryRepository;
