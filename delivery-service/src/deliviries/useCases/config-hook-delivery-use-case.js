const {
  BadRequestException,
} = require("../../../src/deliviries/http/errors/index");

class ConfigDeliveryHookUsecase {
  constructor(deliveryHookRepository) {
    this.deliveryHookRepository = deliveryHookRepository;
  }

  async configHook(data) {
    try {
      const id = await this.deliveryHookRepository.createDeliveryHook({
        url: data.url,
        apiKey: data.apiKey,
      });

      return id;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}

module.exports = ConfigDeliveryHookUsecase;
