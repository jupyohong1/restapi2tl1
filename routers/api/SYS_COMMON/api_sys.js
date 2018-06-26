// routers/api/api_sys.js
const API_COMMON = require('../api_common');
const express = require('express');
const router = express.Router();

// RTRV-SYS
router.get('/:tid', async function(req, res) {
  const cmd = 'RTRV-SYS';
  const tid = req.params.tid;
  const aid = '';
  const param = '';
  res.json(await API_COMMON.cmdProc(cmd, tid, aid, param));
});

// PRV-SYS
router.post('/', async function(req, res) {
  const cmd = 'PRV-SYS';
  const tid = req.body.tid;
  const aid = '';
  const param = req.body.sysname;
  console.log('req.body: ' + req.body);
  res.json(await API_COMMON.cmdProc(cmd, tid, aid, param));
});

module.exports = router;
