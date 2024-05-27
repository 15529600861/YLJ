var mongoose = require('mongoose');
var db = require('../config/mongoDB'); // 引入连接数据库配置

var Schema = mongoose.Schema; //创建结构

// 用户表
var UserSchema = new Schema({
  name: { type: String }, // 用户名
  psw: { type: String }, // 密码
  email: { type: String }, // 邮箱
  sex: { type: String, default: 'asexual' }, // 性别
  birth: { type: Date }, // 生日
  phone: { type: Number }, //电话
  explain: { type: String }, // 介绍
  imgurl: { type: String, default: '/user/user.png' }, // 用户头像
  time: { type: Date }, // 注册时间 
});

// 好友表
var FriendSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户ID
  friendID: { type: Schema.Types.ObjectId, ref: 'User' }, // 好友ID
  state: { type: String }, // 好友状态（0代表已为好友；1代表申请中；2代表申请发送方，对方还未同意）
  time: { type: Date }, // 成为好友的时间 
  markname: { type: String }, // 好友昵称
  lastTime: { type: Date }, // 最后一条消息的时间
});

// 好友之间一对一消息表
var MessageSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户ID
  friendID: { type: Schema.Types.ObjectId, ref: 'User' }, // 好友ID
  message: { type: String }, // 发送消息内容
  types: { type: String }, // 发送消息内容的类型（0文字；1图片链接；2音频链接...）
  time: { type: Date }, // 消息发送时间
  state: { type: Number }, // 消息接收状态（0已读；1未读） 
});

// 群表
var GroupSchema = new Schema({
  // groupID: { type: Schema.Types.ObjectId, ref: 'Group' }, // 群ID
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户ID
  name: { type: String }, // 群名
  imgurl: { type: String, default: '/group/group.png' }, // 群头像 
  notice: { type: String }, // 公告
  time: { type: Date }, // 群创建的时间
});

// 群成员表
var GroupUserSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' }, // 群ID
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户ID
  name: { type: String }, // 群内名称
  tip: { type: Number, default: 0 }, // 未读消息数
  time: { type: Date }, // 加入时间
  shield: { type: Number }, // 是否屏蔽群消息（0屏蔽；1不屏蔽）
  lastTime: { type: Date }, // 最后一条消息的时间
});

// 群消息表
var GroupMsgSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' }, // 群ID
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, // 用户ID
  message: { type: String }, // 发送消息内容
  types: { type: String }, // 发送消息内容的类型（0文字；1图片链接；2音频链接...）
  time: { type: Date }, // 加入时间
});

module.exports = db.model('User', UserSchema);    // 把表共享出去
module.exports = db.model('Friend', FriendSchema);
module.exports = db.model('Message', MessageSchema);
module.exports = db.model('Group', GroupSchema);
module.exports = db.model('GroupUser', GroupUserSchema);
module.exports = db.model('GroupMsg', GroupMsgSchema);