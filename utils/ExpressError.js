class ExpressError extends Error {
  // personalized error messages
  constructor(status, message) {
    super();
    (this.status = status), (this.message = message);
  }
}

module.exports = { ExpressError };
