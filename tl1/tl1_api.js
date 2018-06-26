// tl1/tl1_api.js
const TL1_NET = require('./EMS/tl1_net');
const TL1_SYS = require('./SYS_COMMON/tl1_sys');

const TL1_API = {};

TL1_API.GetSendMsg = function(cmd, tid, aid, param) {
  switch (cmd) {
    case 'RTRV-NET': return TL1_NET.GetRTRVSendMsg(param);
    case 'RTRV-SYS': return TL1_SYS.GetRTRVSendMsg(tid);
    case 'PRV-SYS': return TL1_SYS.GetPRVSendMsg(tid, aid, param);
  }
};

TL1_API.parseData2Json = function(cmd, data) {
  switch (cmd) {
    case 'RTRV-NET': return TL1_NET.parseRTRVData2Json(data);
    case 'RTRV-SYS': return TL1_SYS.parseRTRVData2Json(data);
    case 'PRV-SYS': return TL1_SYS.parsePRVData2Json(data);
  }
};

module.exports = TL1_API;
