// index.js
const logger = require('./util/logger');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socketMgr = require('./sock/sock_mgr');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
//   next();
// });

// Swagger-UI
// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
  info: { // API informations (required)
    title: 'API Docs', // Title (required)
    version: '1.0.0', // Version (required)
  },
  basePath: '/api',
};
// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // Path to the API docs
  apis: [
    './routers/api/EMS/swagger_param.yaml',
    './routers/api/SYS_COMMON/swagger_param.yaml',
  ],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

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
// const emsIP = '127.0.0.1';
const emsIP = '210.114.89.124';
// const emsIP = '192.168.135.251';
// sock.connect(emsPort[0], emsIP);

socketMgr.createEMSSocket(emsIP, emsPort[0], emsPort[1]);
socketMgr.repProc();
