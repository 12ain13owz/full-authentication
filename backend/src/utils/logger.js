const logger = require("pino");
const dayjs = require("dayjs");

const level = "debug"; // fatal, error, warn, info, debug, trace
const log = logger({
  transport: { target: "pino-pretty" },
  level,
  base: { pid: false },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

module.exports = log;
