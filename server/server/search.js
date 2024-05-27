// 搜索页面
var dbserver = require('../dao/dbsever');

// 用户搜索
exports.searchUser = (req, res) => {
  var data = req.body.data;
  dbserver.searchUser(data, res);
}

// 判断是否为好友
exports.isFriend = (req, res) => {
  var uid = req.body.uid;
  var fid = req.body.fid;
  dbserver.isFriend(uid, fid, res);
}

// 群搜索
exports.searchGroup = (req, res) => {
  var data = req.body.data;
  dbserver.searchUser(data, res);
}

// 判断是否为好友
exports.isInGroup = (req, res) => {
  var uid = req.body.uid;
  var gid = req.body.gid;
  dbserver.isInGroup(uid, gid, res);
}