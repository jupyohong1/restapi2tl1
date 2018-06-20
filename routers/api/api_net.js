// routers/api/api_net.js
const API_COMMON = require('./api_common');
const express = require('express');
const router = express.Router();

// get net
router.get('/', async function(req, res) {
  const cmd = 'NET';
  const tid = '';
  const aid = '';
  const param = '';
  res.json(await API_COMMON.process(cmd, tid, aid, param));
});

router.get('/:devtype', async function(req, res) {
  const cmd = 'NET';
  const tid = '';
  const aid = '';
  const param = req.params.devtype;
  res.json(await API_COMMON.process(cmd, tid, aid, param));
});


module.exports = router;
