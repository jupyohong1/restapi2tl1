// tl1/tl1_net.js
const util = require('../util/util');
const TL1_COMMON = require('./tl1_common');

const TL1_NET = {};

TL1_NET.GetSendMsg = function(param) {
  const msg = new TL1_COMMON.GetSendMsg();

  msg.cmd = 'RTRV-NET';
  msg.ctag = util.getCtags();
  if (param != '') {
    msg.param = 'DEVTYPE=' + param;
  }

  return msg;
};

TL1_NET.parseData2Json = function(TL1RecvData) {
  if (TL1RecvData.code == 'COMPLD') {
    let msg = {
      tid: TL1RecvData.tid,
      date: TL1RecvData.date + ' ' + TL1RecvData.time,
      type: TL1RecvData.type,
      ctag: TL1RecvData.ctag,
      items: [],
    };

    TL1RecvData.items.forEach( function(item, index, array) {
      let sp = item.indexOf('\"')+1;
      let ep = item.indexOf(',');
      let tid = item.slice(sp, ep);

      let= ep+1;
      ep = item.indexOf(',', sp);
      let neName = item.slice(sp, ep);

      sp = ep+1;
      ep = item.indexOf(',', sp);
      let connStat = item.slice(sp, ep);

      let row = {
        tid: tid,
        neName: neName,
        connStat: connStat,
      };

      // console.log(row);
      msg.items.push(row);
    });
    // return msg;
    return util.successTrue(msg);
  } else {
    let err = 500;
    return util.successFalse(err, 'parsing error');
  }
};

module.exports = TL1_NET;
