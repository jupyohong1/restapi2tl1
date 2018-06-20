// routers/api/api_common.js
const TL1_API = require('../../tl1/tl1_api');
const sock = require('../../sock/sock');
const util = require('../../util/util');
const API_COMMON = {};

API_COMMON.process = async function(cmd, tid, aid, param) {
  let sendTL1Data = TL1_API.GetSendMsg(cmd, tid, aid, param);
  if (sock.write(sendTL1Data.tid, sendTL1Data.ctag, sendTL1Data.toString())) {
    try {
      const errCount = 0;
      let recvTL1Data =
        await sock.getRecvData(sendTL1Data.tid, sendTL1Data.ctag, errCount);
      if (recvTL1Data == undefined) {
        console.log('Socket RecvData is undefined, retry!');
        recvTL1Data =
          await sock.getRecvData(sendTL1Data.tid, sendTL1Data.ctag, errCount);
      }

      console.log('return key[%s]', sendTL1Data.ctag);
      if (recvTL1Data.result) {
        const resTL1Data = TL1_API.parseData2Json(cmd, recvTL1Data.data);
        sock.DeleteCommData(sendTL1Data.tid, sendTL1Data.ctag);
        return resTL1Data;
      } else {
        return recvTL1Data.data;
      }
    } catch (exception) {
      console.log(exception);
      return util.successFalse(exception);
    }
  } else {
    let message = 'TL1 Send fail!';
    console.log('return key[%s]', sendTL1Data.ctag);
    console.log(message);
    return util.successFalse(message);
  }
};

module.exports = API_COMMON;
