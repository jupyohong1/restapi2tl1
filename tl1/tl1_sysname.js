// tl1/tl1_sysname.js
const util = require('../util/util');
const TL1_COMMON = require('./tl1_common');

const TL1_SYSNAME = {};

TL1_SYSNAME.GetSendMsg = function(tid, aid, param) {
  const msg = new TL1_COMMON.GetSendMsg();

  msg.cmd = 'PRV-SYSNAME';
  msg.tid = tid;
  msg.aid = aid;
  msg.ctag = util.getCtags();
  msg.param = param;

  return msg;
};

TL1_SYSNAME.parseData2Json = function(TL1RecvData) {
  if (TL1RecvData.code == 'COMPLD') {
    let msg = {
      tid: TL1RecvData.tid,
      date: TL1RecvData.datetime,
      type: TL1RecvData.type,
      ctag: TL1RecvData.ctag,
    };
    return util.successTrue(msg);
  } else {
    let msg = {
      tid: TL1RecvData.tid,
      date: TL1RecvData.datetime,
      type: TL1RecvData.type,
      ctag: TL1RecvData.ctag,
      errcode: TL1RecvData.errcode,
      errtxt: TL1RecvData.errtxt,
    };
    return util.successFalse(msg);

    // console.log(msg);
  }
};

module.exports = TL1_SYSNAME;
