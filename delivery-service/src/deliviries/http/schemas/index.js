const { createDelivery } = require("./create-delivery-schema");
const { webhookConfig } = require("./delivery-webhook-config-schema");

module.exports = { createDelivery, webhookConfig };
