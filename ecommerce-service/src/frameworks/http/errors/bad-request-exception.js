const statusCode = require("../utils/http-status-code");

class BadRquestException extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = statusCode.BAD_REQUEST;
  }
}

module.exports = BadRquestException;
