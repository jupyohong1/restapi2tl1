// util.js
const util = {};

util.successTrue = function(data) {
  return {
    success: true,
    message: null,
    data: data,
  };
};

util.successFalse = function(message) {
  if (!message) message = 'data not found';
  return {
    success: false,
    message: message,
    data: null,
  };
};

let ctag = 0;
util.getCtags = function() {
  let retCtag = ctag;
  ctag = (ctag + 1) % Number.MAX_SAFE_INTEGER;
  return retCtag;
};

module.exports = util;
