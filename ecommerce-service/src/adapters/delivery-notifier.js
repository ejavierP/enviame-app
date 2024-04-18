const axios = require("axios");
const { BadRequestException } = require("../frameworks/http/errors/index");

async function notifyDelivery(delivery) {
  try {
    const deliveryUrl = process.env.DELIVERY_BASE_URL;
    const deliveryApiKey = process.env.DELIVERY_API_KEY;
    await axios.post(deliveryUrl, delivery, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": deliveryApiKey,
      },
    });
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}
module.exports = notifyDelivery;
