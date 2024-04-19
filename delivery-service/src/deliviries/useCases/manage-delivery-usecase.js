const Delivery = require("../entities/delivery");
const {
  BadRequestException,
  NotFoundException,
} = require("../../../src/deliviries/http/errors/index");
const {
  generateTrackingNumber,
} = require("../utils/generate-tracking-number-utils");

const {
  deliveryStatus,
  deliveryStatusSequence,
} = require("../utils/delivery-status.util");

const notifyOrderStatus = require("../../frameworks/adapters/orders-notifier");

class ManageDeliveriesUsecase {
  constructor(deliveryRepository, deliveryConfigHookRepository) {
    this.deliveryRepository = deliveryRepository;
    this.deliveryConfigHookRepository = deliveryConfigHookRepository;
  }

  async getDeliveries() {
    return await this.deliveryRepository.getDeliveries();
  }

  async getDelivery(id) {
    const delivery = await this.deliveryRepository.getDelivery(id);
    if (!delivery) {
      throw new NotFoundException(
        "No se encontro delivery con el id especificado"
      );
    }
    return delivery;
  }

  async getDeliveryTrackings(filters) {
    try {
      const delivery = await this.deliveryRepository.getDeliveryTrackings({
        foreignOrderId: filters.foreignOrderId,
        trackingNumber: filters.trackingNumber,
      });
      if (!delivery) {
        throw new NotFoundException(
          "No se encontro delivery"
        );
      }
      return delivery;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createDelivery(data) {
    try {
      const trackingNumber = generateTrackingNumber();
      const originAddress = data.origin.address;
      const customerAddress = data.destination.address;
      const customerName = data.destination.name;

      const trackings = [
        {
          status: data.status,
          trackingNumber: trackingNumber,
          date: Date.now(),
          isNotified: false,
        },
      ];
      const delivery = new Delivery(
        undefined,
        data.foreignOrderId,
        data.products,
        originAddress,
        customerName,
        customerAddress,
        trackingNumber,
        data.status,
        Date.now(),
        trackings
      );
      const id = await this.deliveryRepository.createDelivery(delivery);
      delivery.id = id;

      return delivery;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async updateDelivery(id, data) {
    const originAddress = data.origin.address;
    const customerAddress = data.destination.address;
    const customerName = data.destination.name;

    try {
      const delivery = new Delivery(
        id,
        data.foreignOrderId,
        data.products,
        originAddress,
        customerName,
        customerAddress,
        undefined,
        data.status
      );
      await this.deliveryRepository.updateDelivery(delivery);

      return delivery;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteDelivery(id) {
    try {
      await this.deliveryRepository.deleteDelivery(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

module.exports = ManageDeliveriesUsecase;
