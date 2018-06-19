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
    console.log('connect success, IP: %s, PORT: %d', IP, PORT);
  });

  client.on('data', (data) => {
    // console.log('socket, recv data!!!');
    sock.bIsReceived = true;
    const strContent = new Buffer(data);
    data = iconv.decode(strContent, 'euckr').toString();
    recvData = data.toString();
    const tl1Data = new TL1_COMMON.GetRecvMsg();
    tl1Data.parseHdr(recvData);
    const strKey = makeCommKey(tl1Data.ctag);
    console.log('recv key [%s]', strKey);
    // CommMap.set(strKey, recv_data);
    CommMap.set(strKey, tl1Data);
  });

  client.on('timeout', () => {
    console.log('client occured timeout >> ');
  });

  client.on('end', () => {
    sock.bIsConnected = false;
    sock.status = 'DISCONN';
    console.log('client disconnected');
  });

  client.on('error', (err) => {
    sock.bIsConnected = false;
    sock.status = 'DISCONN';
    console.log(err);
  });

  client.on('close', (err) => {
    sock.bIsConnected = false;
    sock.status = 'DISCONN';
    console.log(err);
  });
};

sock.write = function(tid, ctag, msg) {
  const writeOk = client.write(msg);
  console.log('client send data [%s] and end of write = %s', msg, writeOk);
  return writeOk;
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

    console.log(message);
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
