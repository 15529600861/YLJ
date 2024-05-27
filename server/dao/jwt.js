// token
// 引入
var jwt = require('jsonwebtoken');
var secret = 'yunLJ';
// 生成 token
exports.generateToken = function(e) {
  var payload = { id: e, time: new Date() };
  var token = jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 * 120 });
  return token;
}

// 解析 token
exports.verifyToken = function(e) {
  var payload;
  jwt.verify(e, secret, function(err, result) {
    if (err) {
      payload = 0;
    } else {
      payload = 1;
    }
  });
  return payload;
}