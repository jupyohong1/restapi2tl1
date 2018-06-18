// routers/api/api_sys.js
const TL1_SYS = require('../../tl1/tl1_sys');

const sock = require('../../sock/sock').sock;
const util = require('../../util/util');
const express = require('express');
const router = express.Router();

// get net
router.get('/:tid', async function(req, res) {
  let sendTL1Data = TL1_SYS.GetSendMsg(req.params.tid);
  if (sock.write(sendTL1Data.tid, sendTL1Data.ctag, sendTL1Data.toString())) {
    try {
      const errCount = 0;
      let recvTL1Data =
        await sock.getRecvData(sendTL1Data.tid, sendTL1Data.ctag, errCount);
      const resTL1Data = TL1_SYS.parseData2Json(recvTL1Data);
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
