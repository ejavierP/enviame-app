const statusCode = require("../utils/http-status-code");

class NotFoundException extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = statusCode.NOT_FOUND;
  }
}

module.exports = NotFoundException;
