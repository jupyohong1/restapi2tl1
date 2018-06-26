// router/api/router.js
const express = require('express');
const router = express.Router();

// EMS
router.use('/net', require('./EMS/api_net'));

// sys_common
router.use('/sys', require('./SYS_COMMON/api_sys'));

module.exports = router;
