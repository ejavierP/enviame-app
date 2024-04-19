const deliveryStatus = {
  DISPATCHED: "DISPATCHED",
  DELIVERED: "DELIVERED",
  READY_FOR_PICK_UP: "READY_FOR_PICK_UP",
  AT_ORIGIN: "AT_ORIGIN",
  EN_ROUTE_OF_DELIVERY: "EN_ROUTE_OF_DELIVERY",
  NOT_DELIVERED: "NOT_DELIVERED",
};

const deliveryStatusSequence = {
  [deliveryStatus.DISPATCHED]: deliveryStatus.READY_FOR_PICK_UP,
  [deliveryStatus.READY_FOR_PICK_UP]: deliveryStatus.AT_ORIGIN,
  [deliveryStatus.AT_ORIGIN]: deliveryStatus.EN_ROUTE_OF_DELIVERY,
  [deliveryStatus.EN_ROUTE_OF_DELIVERY]: [
    deliveryStatus.DELIVERED,
    deliveryStatus.NOT_DELIVERED,
  ],
  [deliveryStatus.NOT_DELIVERED]: deliveryStatus.EN_ROUTE_OF_DELIVERY,
};

module.exports = { deliveryStatus, deliveryStatusSequence };
