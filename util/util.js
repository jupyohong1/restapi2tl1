// util.js
const util = {};

util.successTrue = function(data) {
  return {
    success: true,
    message: null,
    errors: null,
    data: data,
  };
};

util.successFalse = function(err, message) {
  if (!err&&!message) message = 'data not found';
  return {
    success: false,
    message: message,
    errors: (err)? util.parseError(err): null,
    data: null,
  };
};

util.parseError = function(errors) {
  let parsed = {};
  if (errors.name == 'ValidationError') {
    for (let name in errors.errors) {
      if (Object.prototype.hasOwnProperty.call(errors.errors, name)) {
        let validationError = errors.errors[name];
        parsed[name] = {message: validationError.message};
      }
    }
  } else if (errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = {message: 'This username already exists!'};
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
};


// middlewares
util.isLoggedin = function(req, res, next) {
  let token = req.headers['x-access-token'];
  if (!token) return res.json(util.successFalse(null, 'token is required!'));
  else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) return res.json(util.successFalse(err));
      else {
        req.decoded = decoded;
        next();
      }
    });
  }
};

let ctag = 0;
util.getCtags = function() {
  let retCtag = ctag;
  ctag = (ctag + 1) % Number.MAX_SAFE_INTEGER;
  return retCtag;
};

module.exports = util;
