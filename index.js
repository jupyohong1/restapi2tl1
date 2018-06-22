// index.js
const express = require('express');
const logger = require('./util/logger');
const app = express();
const bodyParser = require('body-parser');
// const sock = require('./sock/sock');
const EMSSock = require('./sock/sock_mgr');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
  next();
});

// API
app.use('/api', require('./routers/api/router'));

// server
const port = 3000;
app.listen(port, () => {
  logger.trace(`listening on Web port: ${port}`);
});

// ems connect
// var ems_port = 34271;
const emsPort = [6200, 6300];
const emsIP = '127.0.0.1';
// var ems_ip = '210.114.89.124';
// sock.connect(emsPort[0], emsIP);

EMSSock.createSocket(emsIP, emsPort[0], emsPort[1]);
