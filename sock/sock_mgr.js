// sock/sock_mgr.js
const logger = require('../util/logger');
const sock = require('./sock');

const sockMgr = {
  cmdSock: null,
  repSock: null,
};


sockMgr.createSocket = function(ip, cmdPort, repPort) {
  sockMgr.cmdSock = new sock('CMD', ip, cmdPort);
  logger.trace(sockMgr.cmdSock.toString());
  sockMgr.cmdSock.connect();

  sockMgr.repSock = new sock('REP', ip, repPort);
  logger.trace(sockMgr.repSock.toString());
  sockMgr.repSock.connect();
};


module.exports = sockMgr;
