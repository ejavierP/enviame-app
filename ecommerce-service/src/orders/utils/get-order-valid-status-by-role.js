const { userRoles } = require("../../users/utils/user-role");

const orderValidStatusByRole = {
  [userRoles.MARKETPLACE]: ["created", "confirmed", "dispatched", "delivered"],
  [userRoles.SELLER]: ["created", "confirmed", "dispatched", "delivered"],
  [userRoles.MARKETPLACE_ADMIN]: [
    "created",
    "confirmed",
    "dispatched",
    "cancelled",
  ],
};

module.exports = orderValidStatusByRole;
