// routers/api/api_sysname.js
const API_COMMON = require('./api_common');
const express = require('express');
const router = express.Router();

// set sysname
router.post('/', async function(req, res) {
  const cmd = 'SYSNAME';
  const tid = req.body.tid;
  const aid = req.body.aid;
  const param = req.body.sysname;
  res.json(await API_COMMON.cmdProc(cmd, tid, aid, param));
});

module.exports = router;
