// 好友
var dbserver = require('../dao/dbsever');

// 好友申请
exports.applyFriend = (req, res) => {
  var data = req.body;
  dbserver.applyFriend(data, res);
}

// 好友状态更新
exports.updateFriendState = (req, res) => {
  var data = req.body;
  dbserver.updateFriendState(data, res);
}

// 拒绝或删除好友
exports.deleteFriend = (req, res) => {
  var data = req.body;
  dbserver.deleteFriend(data, res);
}