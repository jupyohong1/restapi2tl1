// routers/api/api_sys.js
const API_COMMON = require('./api_common');
const express = require('express');
const router = express.Router();

// get net
router.get('/:tid', async function(req, res) {
  const cmd = 'SYS';
  const tid = req.params.tid;
  const aid = '';
  const param = '';
  res.json(await API_COMMON.RTRV(cmd, tid, aid, param));
});

module.exports = router;
