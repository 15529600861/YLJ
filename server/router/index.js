var dbserver = require('../dao/dbsever');
var emailsever = require('../dao/emailsever'); // 引入邮箱发送方法
var singup = require('../server/singup'); // 引入注册页面服务
var singin = require('../server/singin'); // 引入登录页面服务
var search = require('../server/search'); // 引入搜索页面服务
var detial = require('../server/userdetial'); // 引入用户详情页面服务
var friend = require('../server/friend'); // 引入好友操作页面服务
var index = require('../server/index'); // 引入好友操作页面服务
var chat = require('../server/chat'); // 引入聊天页面服务
var group = require('../server/group'); // 引入建群页面服务
module.exports = function(app) {
  app.get('/test', (req, res) => {
    // res.send('这里是test页面');
    res.send('aaaatest')
    // dbserver.findUser(res);
  });
  // 邮箱测试
  app.post('/mail', (req, res) => {
    var mail = req.body.mail;
    emailsever.emailSignup(mail, res);
    res.send(mail);
    // console.log(mail);
  });

  // 注册页面
  // 注册
  app.post('/singup/add', (req, res) => {
    singup.signUp(req, res);
  });

  // 用户或邮箱是否占用判断
  app.post('/singup/judge', (req, res) => {
    singup.judgeValue(req, res);
  })

  // 登录页面
  app.post('/singin/match', (req, res) => {
    singin.singIn(req, res);
  })

  // 搜索页面
  // 搜索用户
  app.post('/search/user', (req, res) => {
    search.searchUser(req, res);
  })
  // 判断是否为好友
  app.post('/search/isfriend', (req, res) => {
    search.isFriend(req, res);
  })
  // 搜索群
  app.post('/search/group', (req, res) => {
    search.searchGroup(req, res);
  })
  // 判断好友是否在群里
  app.post('/search/isingroup', (req, res) => {
    search.isInGroup(req, res);
  })

  // 用户详情
  // 详情
  app.post('/user/detial', (req, res) => {
    detial.userDetial(req, res);
  })
  // 用户详情修改
  app.post('/user/update', (req, res) => {
    detial.userUpdate(req, res);
  })
  // 好友备注修改
  app.post('/user/updatemarkname', (req, res) => {
    detial.updateMarkName(req, res);
  })
  // 好友昵称获取
  app.post('/user/getmarkname', (req, res) => {
    detial.getMarkName(req, res);
  })

  // 好友操作
  // 申请好友
  app.post('/friend/applyfriend', (req, res) => {
    friend.applyFriend(req, res);
  })
  // 好友状态更新
  app.post('/friend/updatefriendstate', (req, res) => {
    friend.updateFriendState(req, res);
  })
  //删除或拒绝好友
  app.post('/friend/deletefriend', (req, res) => {
    friend.deleteFriend(req, res);
  })

  // 主页
  // 获取好友
  app.post('/index/getfriend', (req, res) => {
    index.getFriend(req, res);
  })
  // 获取最后一条消息
  app.post('/index/getlastmsg', (req, res) => {
    index.getLastMsg(req, res);
  })
  // 获取好友未读消息数
  app.post('/index/unreadmsg', (req, res) => {
    index.unreadMsg(req, res);
  })
  // 好友消息修改为已读
  app.post('/index/updatemsg', (req, res) => {
    index.updateMsg(req, res);
  })


  // 获取群列表
  app.post('/index/getgroup',(req,res)=>{
    index.getGroup(req,res)
  })
   // 获取群最后一条消息
   app.post('/index/getlastgroupmsg',(req,res)=>{
    index.getLastGroupMsg(req,res)
  })
  // 获取群未读消息数
  app.post('/index/unreadgroupmsg', (req, res) => {
    index.unreadGroupMsg(req, res);
  })
   // 群内消息已读
   app.post('/index/updategroupmsg',(req,res)=>{
    index.updateGroupMsg(req,res)
  })


   // 聊天页面
   app.post('/chat/msg',(req,res)=>{
    chat.msg(req,res)
  })
  app.post('/chat/groupmsg',(req,res)=>{
    chat.Groupmsg(req,res)
  })


  // 新建群
  app.post('/group/creategroup',(req,res)=>{
    group.createGroup(req,res)
  })

  // token匹配测试
  // app.post('/singin/test', (req, res) => {
  //   res.send('1123')
  // })


}