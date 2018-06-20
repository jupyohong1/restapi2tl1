// tl1/tl1_api.js
const TL1_NET = require('./tl1_net');
const TL1_SYS = require('./tl1_sys');
const TL1_SYSNAME = require('./tl1_sysname');

const TL1_API = {};

TL1_API.GetSendMsg = function(cmd, tid, aid, param) {
  switch (cmd) {
    case 'NET': return TL1_NET.GetSendMsg(param);
    case 'SYS': return TL1_SYS.GetSendMsg(tid);
    case 'SYSNAME': return TL1_SYSNAME.GetSendMsg(tid, aid, param);
  }
};

TL1_API.parseData2Json = function(cmd, data) {
  switch (cmd) {
    case 'NET': return TL1_NET.parseData2Json(data);
    case 'SYS': return TL1_SYS.parseData2Json(data);
    case 'SYSNAME': return TL1_SYSNAME.parseData2Json(data);
  }
};

module.exports = TL1_API;
