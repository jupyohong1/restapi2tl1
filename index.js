// index.js
const express = require('express');
const logger = require('./util/logger');
const app = express();
const bodyParser = require('body-parser');
const socketMgr = require('./sock/sock_mgr');

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

// repPort
app.use('/report', require('./routers/report'));

// server
const http = require('http').Server(app);
const port = 3000;
socketMgr.createWebSocket(http);
http.listen(port, function() {
  logger.trace(`listening on Web port: ${port}`);
});

// ems connect
// var ems_port = 34271;
const emsPort = [6200, 6300];
const emsIP = '127.0.0.1';
// var ems_ip = '210.114.89.124';
// sock.connect(emsPort[0], emsIP);

socketMgr.createEMSSocket(emsIP, emsPort[0], emsPort[1]);
socketMgr.repProc();
