const statusCode = require("../../../frameworks/http/utils/http-status-code");

class NotFoundStoreException extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = statusCode.INTERNAL_SERVER_ERROR;
  }
}

module.exports = NotFoundStoreException;
