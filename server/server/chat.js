// 聊天
var dbserver = require('../dao/dbsever');

// 获取一对一聊天数据
exports.msg = (req, res) => {
  var data = req.body;
  dbserver.msg(data, res);
}

// 获取一对一聊天数据
exports.Groupmsg = (req, res) => {
  var data = req.body;
  dbserver.Groupmsg(data, res);
}