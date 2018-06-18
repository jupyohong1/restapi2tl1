// routers/api/api_net.js
const TL1_NET = require('../../tl1/tl1_net');

const sock = require('../../sock/sock').sock;
const util = require('../../util/util');
const express = require('express');
const router = express.Router();

// get net
router.get('/', async function(req, res) {
  let sendTL1Data = TL1_NET.GetSendMsg('');
  if (sock.write(sendTL1Data.tid, sendTL1Data.ctag, sendTL1Data.toString())) {
    try {
      const errCount = 0;
      const recvTL1Data =
        await sock.getRecvData(sendTL1Data.tid, sendTL1Data.ctag, errCount);
      const resTL1Data = TL1_NET.parseData2Json(recvTL1Data);
      res.json(resTL1Data);
    } catch (exception) {
      console.log(exception);
      res.json(util.successFalse(500, exception));
    }
  } else {
    let message = 'TL1 Send fail!';
    res.json(util.successFalse(500, message));
  }
});

router.get('/:devtype', async function(req, res) {
  let sendTL1Data = TL1_NET.GetSendMsg(req.params.devtype);
  if (sock.write(sendTL1Data.tid, sendTL1Data.ctag, sendTL1Data.toString())) {
    try {
      const errCount = 0;
      const recvTL1Data =
        await sock.getRecvData(sendTL1Data.tid, sendTL1Data.ctag, errCount);
      const resTL1Data = TL1_NET.parseData2Json(recvTL1Data);
      res.json(resTL1Data);
    } catch (exception) {
      console.log(exception);
      res.json(util.successFalse(500, exception));
    }
  } else {
    let message = 'TL1 Send fail!';
    res.json(util.successFalse(500, message));
  }
});


module.exports = router;
