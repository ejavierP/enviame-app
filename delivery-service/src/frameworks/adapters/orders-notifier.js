const axios = require("axios");
const { BadRequestException } = require("../../deliviries/http/errors/index");

async function notifyOrderStatus(config, order) {
  try {
    const ecommerceUrl = config.url;
    const ecommerceApiKey = config.apiKey;
    await axios.post(
      ecommerceUrl,
      { status: order.status, orderId: order.orderId },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ecommerceApiKey,
        },
      }
    );
  } catch (error) {
   console.log(error)
  }
}
module.exports = notifyOrderStatus;
