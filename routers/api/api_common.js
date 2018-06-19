// routers/api/api_common.js
const TL1_API = require('../../tl1/tl1_api');
const sock = require('../../sock/sock').sock;
const util = require('../../util/util');
const API_COMMON = {};

API_COMMON.RTRV = async function(cmd, tid, aid, param) {
  let sendTL1Data = TL1_API.GetSendMsg(cmd, tid, aid, param);
  if (sock.write(sendTL1Data.tid, sendTL1Data.ctag, sendTL1Data.toString())) {
    try {
      const errCount = 0;
      const recvTL1Data =
        await sock.getRecvData(sendTL1Data.tid, sendTL1Data.ctag, errCount);
      const resTL1Data = TL1_API.parseData2Json(cmd, recvTL1Data);
      return resTL1Data;
    } catch (exception) {
      console.log(exception);
      return util.successFalse(500, exception);
    }
  } else {
    let message = 'TL1 Send fail!';
    return util.successFalse(500, message);
  }
};

module.exports = API_COMMON;
