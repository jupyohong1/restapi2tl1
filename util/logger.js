// util/logger.js
const winston = require('winston');

const myLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    trace: 'white',
  },
};

const myFormat = winston.format.printf((info) => {
  return `[${info.timestamp}][${info.level}] ${info.message}`;
});

winston.addColors(myLevels.colors);
const logger = winston.createLogger({
  levels: myLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    // myFormat,
    winston.format.splat(),
    myFormat
  ),
  // timestampprefix: 'true',
  transports: [
    // console
    new (winston.transports.Console)({
      colorize: true,
    }),
    // file
    // new winston.transport.File({filename: 'error.log', level: 'error'})
  ],
});

winston.addColors(myLevels.colors);

module.exports = logger;
