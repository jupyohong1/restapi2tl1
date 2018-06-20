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

/**
 * return First Initial of level name
 * @param {string} level - level name
 * @return {string} First Initial of level name
 */
function getLevelInitial(level) {
  switch (level) {
    case 'error': return 'E';
    case 'warn': return 'W';
    case 'info': return 'I';
    case 'debug': return 'D';
    case 'trace': return 'T';
    default: return 'UNKNOWN';
  }
}

const myFormat = winston.format.printf((info) => {
  return `${getLevelInitial(info.level)} ${info.timestamp} : ${info.message}`;
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
      level: 'trace',
      colorize: true,
    }),
    // file
    new (require('winston-daily-rotate-file'))({
      level: 'info',
      filename: 'log/log',
      datePattern: 'YYYY-MM-DD',
      prepend: true,
    }),
  ],
});

winston.addColors(myLevels.colors);

module.exports = logger;
