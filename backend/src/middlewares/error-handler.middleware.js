const log = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  try {
    const message = err.message || "Internal Server Error!";
    const status = err.status || 500;
    const logout = err.logout || false;
    const func = res.locals.func || "Not Found function";
    const method = req.method;
    const url = req.baseUrl + req.url;

    log.error(`${method}: ${url} > ${func}: ${message}`);
    res.status(status).json({ message, logout });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = errorHandler;
