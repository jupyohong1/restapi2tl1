// router/api/router.js
const express = require('express');
const router = express.Router();

router.use('/net', require('./api_net'));
router.use('/sys', require('./api_sys'));

module.exports = router;
