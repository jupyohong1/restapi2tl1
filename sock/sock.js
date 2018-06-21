const logger = require('../util/logger');
const net = require('net');

const sock = {};
let client;
const iconv = require('iconv-lite');
const TL1_COMMON = require('../tl1/tl1_common');
const util = require('../util/util');

const CommMap = new Map();

sock.status = 'DISCONN';
sock.bIsConnected = false;
sock.recvData = '';
sock.bIsReceived = false;

sock.connect = function(PORT, IP) {
  sock.status = 'CONNECTING';
  client = net.connect({port: PORT, host: IP}, () => {
    sock.bIsConnected = true;
    sock.status = 'CONN';
    logger.info('connect success IP: %s, PORT: %s', IP, PORT);
  });

  client.on('data', (data) => {
    // logger.info('socket, recv data!!!');
    sock.bIsReceived = true;
    const strContent = new Buffer(data);
    data = iconv.decode(strContent, 'euckr').toString();
    recvData = data.toString();
    const tl1Data = new TL1_COMMON.GetRecvMsg();
    tl1Data.parseHdr(recvData);
    // logger.info('socket: ' + tl1Data);
    const strKey = makeCommKey(tl1Data.ctag);
    logger.info('recv key [%s]', strKey);
    CommMap.set(strKey, tl1Data);
    // logger.info(tl1Data);
  });

  client.on('timeout', () => {
    logger.info('client occured timeout >> ');
  });

  client.on('end', () => {
    sock.bIsConnected = false;
    sock.status = 'DISCONN';
    logger.warn('client disconnected');
  });

  client.on('error', (err) => {
    sock.bIsConnected = false;
    sock.status = 'DISCONN';
    logger.error(err);
  });

  client.on('close', (err) => {
    sock.bIsConnected = false;
    sock.status = 'DISCONN';
    logger.error('socket closed, reconnect to after 3sec');
    setTimeout(()=>{
      sock.connect(PORT, IP);
    }, 3000);
  });
};

sock.write = function(tid, ctag, msg) {
  if (sock.status == 'CONN') {
    const writeOk = client.write(msg);
    logger.info('client send data [%s] and end of write = %s', msg, writeOk);
    return writeOk;
  } else {
    logger.warn('already socket disconnected');
    return 0;
  }
};

/**
 * parse to number.
 * @param {obj} ctag Number Object
 * @return {int} Number(ctag)
 */
function makeCommKey(ctag) {
  return Number(ctag);
}

sock._promise = function(tid, ctag) {
  return new Promise(((resolve, reject) => {
    setTimeout(() => {
      const key = makeCommKey(ctag);
      if (CommMap.size <= 0) {
        reject(new Error('Error'));
      } else {
        const obj = CommMap.get(key);
        if (CommMap.get(key) == undefined) {
          reject(new Error('Error'));
        } else {
          resolve(obj);
        }
      }
    }, 100);
  }));
};

sock.getRecvData = async function(tid, ctag, errCount) {
  let recvData;
  let bIsReceived = false;

  await sock._promise(tid, ctag)
  .then(function(obj) {
    recvData = obj;
    bIsReceived = true;
  }, function(error) {
    errCount++;
  });

  if (bIsReceived) {
    if (recvData != undefined) {
      return {result: true, data: recvData};
      // return recvData;
    } else {
      errCount++;
    }
  }

  if (errCount > 20) {
    let message = 'not found data, tid: ' + tid + ', ctag: ' + ctag;
    message += ', errCount: ' + errCount;

    logger.info(message);
    return {result: false, data: util.successFalse(500, message)};
    // return util.successFalse(500, message);
  } else {
    await sock.getRecvData(tid, ctag, errCount);
  }
};

sock.DeleteCommData = function(tid, ctag) {
  const key = makeCommKey(ctag);
  if (CommMap.get(key) != undefined) {
    CommMap.delete(key);
  }
};

module.exports = sock;
