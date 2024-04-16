const { userRoles } = require("../../users/utils/user-role");
const { orderStatus } = require("./order-status-util");

const orderValidStatusByRole = {
  [userRoles.MARKETPLACE]: [
    orderStatus.CREATED,
    orderStatus.CONFIRMED,
    orderStatus.DISPATCHED,
    orderStatus.DELIVERED,
  ],
  [userRoles.SELLER]: [
    orderStatus.CREATED,
    orderStatus.CONFIRMED,
    orderStatus.DISPATCHED,
    orderStatus.DELIVERED,
  ],
  [userRoles.MARKETPLACE_ADMIN]: [
    orderStatus.CREATED,
    orderStatus.CONFIRMED,
    orderStatus.DISPATCHED,
    orderStatus.CANCELLED,
  ],
};

module.exports = orderValidStatusByRole;
