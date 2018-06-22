// routers/api/api_common.js
const logger = require('../../util/logger');
const TL1_API = require('../../tl1/tl1_api');
const util = require('../../util/util');
const sockMgr = require('../../sock/sock_mgr');

const API_COMMON = {};

API_COMMON.cmdProc = async function(cmd, tid, aid, param) {
  const cmdSock = sockMgr.cmdSock;
  logger.trace(cmdSock.getConnectInfo());
  if (cmdSock.isConnect()) {
    try {
      let sendTL1Data = TL1_API.GetSendMsg(cmd, tid, aid, param);
      if (cmdSock.send(sendTL1Data.ctag, sendTL1Data.toString())) {
        let recvData = await cmdSock.recv(
          sendTL1Data.tid,
          sendTL1Data.ctag,
          0);
        if (recvData == undefined) {
          logger.info(`Socket RecvData is undefined, retry!`);
          recvData = await cmdSock.recv(
            sendTL1Data.tid,
            sendTL1Data.ctag,
            0);
        }

        if (recvData.result) {
          const resTL1Data = TL1_API.parseData2Json(cmd, recvData.data);
          logger.info(`RecvTL1Data.ctag[${recvData.data.ctag}]`);
          cmdSock.deleteDataMap(recvData.data.ctag);
          return resTL1Data;
        } else {
          return util.successFalse(recvData.msg);
        }
      } else {
        const msg = `TL1 send fail`;
        logger.warn(msg);
        return util.successFalse(msg);
      }
    } catch (exception) {
      logger.warn(exception);
      return util.successFalse(exception.toString());
    }
  } else {
    const msg = cmdSock.getConnectInfo();
    logger.trace(msg);
    return util.successFalse(msg);
  }
};

module.exports = API_COMMON;
