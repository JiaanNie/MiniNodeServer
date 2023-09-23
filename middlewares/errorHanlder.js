const { logEvents } = require("../middlewares/logEvent");

const errorHanlder = (error, req, res, next) => {
  logEvents(
    `${req.path} ${req.headers.origin} ${req.method} ${error.message}`,
    "errorsLogs.txt"
  );
  res.status(500).send(error.message);
};

module.exports = errorHanlder;
