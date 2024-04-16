const { orderStatus } = require("./order-status-util");

const orderStatusSequence = {
  [orderStatus.CREATED]: orderStatus.CONFIRMED,
  [orderStatus.CONFIRMED]: orderStatus.DISPATCHED,
};

module.exports = { orderStatusSequence };
