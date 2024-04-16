const { BadRequestException } = require("../../frameworks/http/errors");
const { userRoles } = require("../../users/utils/user-role");
const orderValidStatusByRole = require("../utils/get-order-valid-status-by-role");

function buildOrderFilters(role, status, orderId, userId) {
  const filters = {};
  const isSellerUser = role && role === userRoles.SELLER;
  const isMarketPlaceUser = role && role === userRoles.MARKETPLACE;
  const getValidStatus = orderValidStatusByRole[role];

  if (status && !getValidStatus.includes(status)) {
    throw new BadRequestException(
      `El status proveido no es valido`
    );
  }
  if (getValidStatus.length && status && getValidStatus.includes(status)) {
    filters.status = status;
  }
  if (isSellerUser) {
    filters.sellerId = userId;
  }

  if (isMarketPlaceUser) {
    filters.createdBy = userId;
  }
  if (orderId) {
    filters.id = orderId;
  }
  return filters;
}

module.exports = { buildOrderFilters };
