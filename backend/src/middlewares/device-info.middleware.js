const deviceInfo = (req, res, next) => {
  try {
    res.locals.func = "Middleware > Device-Info > deviceInfo";

    const deviceInfo = {
      type: req.headers["client-type"],
      browser: req.headers["client-browser"],
      os: req.headers["client-os"],
    };
    res.locals.deviceInfo = deviceInfo;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { deviceInfo };
