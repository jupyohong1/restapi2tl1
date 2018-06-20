// tl1/tl1_sys.js
const util = require('../util/util');
const TL1_COMMON = require('./tl1_common');

const TL1_SYS = {};

TL1_SYS.GetSendMsg = function(tid) {
  const msg = new TL1_COMMON.GetSendMsg();

  msg.cmd = 'RTRV-SYS';
  msg.tid = tid;
  msg.ctag = util.getCtags();

  return msg;
};

TL1_SYS.parseData2Json = function(TL1RecvData) {
  if (TL1RecvData.code == 'COMPLD') {
    let msg = {
      tid: TL1RecvData.tid,
      date: TL1RecvData.datetime,
      type: TL1RecvData.type,
      ctag: TL1RecvData.ctag,
      items: [],
    };

    let row = {
      tid: '',
      networkid: '',
      networkname: '',
      nettype: '',
      nodeid: '',
      shelfid: '',
      nodename: '',
      nodetype: '',
      vendor: '',
      ip: '',
      subnet: '',
      gateway: '',
    };

    TL1RecvData.items.forEach( function(item, index, array) {
      let sp = item.indexOf(':')+1;
      let ep = item.indexOf(',');
      let value = item.slice(sp, ep);
      switch (index) {
        case 0: row.tid = value; break;
        case 1: row.networkid = value; break;
        case 2: row.networkname = value; break;
        case 3: row.nettype = value; break;
        case 4: row.nodeid = value; break;
        case 5: row.shelfid = value; break;
        case 6: row.nodename = value; break;
        case 7: row.nodetype = value; break;
        case 8: row.vendor = value; break;
        case 9: row.ip = value; break;
        case 10: row.subnet = value; break;
        case 11: row.gateway = value; break;
      }
    });
    // console.log(row);
    msg.items.push(row);

    // return msg;
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
  }
};

module.exports = TL1_SYS;
