var dbserver = require('../dao/dbsever');

// token
// var jwt = require('../dao/jwt');

// 登录
exports.singIn = function(req, res) {
  var data = req.body.data;
  var pwd = req.body.pwd;

  dbserver.userMatch(data, pwd, res)
}

// token
// exports.test = function(req, res) {
//   // console.log(req);
//   var token = req.body.token;
//   var jg = jwt.verifyToken(token);

//   res.send(jg);
// }