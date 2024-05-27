// 首页好友列表获取
const db = require('../config/mongoDB');
var dbserver = require('../dao/dbsever');

exports.getFriend = (req, res) => {
  var data = req.body;
  if(data.state == 0){
    dbserver.getUsers(data, res);
  }else if(data.state == 1){
    dbserver.getUsers1(data, res);
  }
}

// 获取最后一条消息
exports.getLastMsg = (req, res) => {
  var data = req.body;
  dbserver.getOneMsg(data, res);
}

// 获取好友未读消息数
exports.unreadMsg = (req, res) => {
  var data = req.body;
  dbserver.unreadMsg(data, res);
}

// 好友消息修改为已读
exports.updateMsg = (req, res) => {
  var data = req.body;
  dbserver.updateMsg(data, res);
}


// 获取群列表
exports.getGroup = (req, res) => {
  var data = req.body.uid;
  // console.log(data);
  dbserver.getGroup(data, res);
}

// 获取群最后一条消息
exports.getLastGroupMsg = (req, res) => {
  var gid = req.body.gid;
  dbserver.getOneGroupMsg(gid, res);
}

// 群消息已读
exports.updateGroupMsg = (req, res) => {
  var data = req.body;
  dbserver.updateGroupMsg(data, res);
}