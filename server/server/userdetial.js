// 好友详情
// 搜索页面
var dbserver = require('../dao/dbsever');

// 详情
exports.userDetial = (req, res) => {
  var id = req.body.id;
  dbserver.userDetial(id, res);
}

// 用户信息修改
exports.userUpdate = (req, res) => {
  var data = req.body;
  dbserver.userUpdate(data, res);
}

// 好友昵称获取
exports.getMarkName = (req, res) => {
  var data = req.body;
  dbserver.getMarkName(data, res);
}
// 好友备注修改
exports.updateMarkName = (req, res) => {
  var data = req.body;
  dbserver.updateMarkName(data, res);
}