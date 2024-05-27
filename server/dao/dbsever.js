var bcrypt = require('../dao/bcrypt'); // 加密文件
var dbmodel = require('../model/dbmodel');
var mongoose = require('mongoose'); // 引入mongoose
var User = dbmodel.model('User');
var Friend = dbmodel.model('Friend');
var Group = dbmodel.model('Group');
var GroupUser = dbmodel.model('GroupUser');
var Message = dbmodel.model('Message');
var GroupMsg = dbmodel.model('GroupMsg');
// token
var jwt = require('../dao/jwt');

// 注册（新建用户）
exports.buildUser = (name, mail, pwd, res) => {
  // 密码加密
  var password = bcrypt.encryption(pwd);

  // data中插入的信息要和 dbmodel.js 中保持一致
  var data = {
    name: name,
    email: mail,
    psw: password,
    time: new Date(),
  }

  var user = new User(data);

  user.save()
    .then(result => {
      res.send({ status: 200 });
    })
    .catch(err => {
      res.send({ status: 500 });
    });
}

// 匹配用户表元素个数
exports.countUserValue = (data, type, res) => {
  var wherestr = {};
  wherestr[type] = data; // wherestr = {'type': data}

  User.countDocuments(wherestr)
    .then(result => {
      // 成功
      res.send({ status: 200, result: result })
    })
    .catch(err => {
      // 失败
      res.send({ status: 500, err: err })
    });
}

// 用户验证
exports.userMatch = (data, pwd, res) => {
  var wherestr = { $or: [{ 'name': data }, { 'email': data }] }; // 前端输入的用户名或者邮箱 在数据库进行搜索
  var out = { 'name': 1, 'imgurl': 1, 'psw': 1 }; // 搜索到输出的内容（0代表不输出，1代表输出）

  User.find(wherestr, out)
    .then(result => {
      if (result == '') {
        // res.send({ status: 400 });
        res.send({ status: 400 })
      }
      result.map((e) => {
        var pwdMatch = bcrypt.verification(pwd, e.psw);
        if (pwdMatch) {
          var token = jwt.generateToken(e._id);
          var back = {
            id: e._id,
            name: e.name,
            imgurl: e.imgurl,
            token: token,
          }
          res.send({ status: 200, back });
        } else {
          res.send({ status: 400 })
        }
      })

    })
    .catch(err => {
      // res.send({ status: 500 + err });
      res.send({ status: 500 })
    });
}

// 搜索页面搜索好友
exports.searchUser = (data, res) => {
  var wherestr;
  if (data == 'yun') {
    wherestr = {}
  } else {
    wherestr = { $or: [{ 'name': { $regex: data } }, { 'email': { $regex: data } }] };
  }
  var out = {
    'name': 1,
    'email': 1,
    'imgurl': 1,
  }
  // 搜索好友
  User.find(wherestr, out)
    .then(result => {
      res.send({ status: 200, result })
    })
    .catch(err => {
      res.send({ status: 500 })
    });
}
// 判断是否为好友
exports.isFriend = (uid, fid, res) => {
  var wherestr = { 'userID': uid, 'friendID': fid, 'state': 0 }
  Friend.findOne(wherestr)
    .then(result => {
      if (result) {
        // 是好友
        res.send({ status: 200, result: result })
      } else {
        // 不是好友
        res.send({ status: 400 })
      }
    })
    .catch(err => {
      res.send({ status: 500 })
    });
}
// 搜索群
exports.searchGroup = (data, res) => {
  var wherestr;
  if (data == 'yun') {
    wherestr = {}
  } else {
    wherestr = { 'name': { $regex: data } };
  }
  var out = {
    'name': 1,
    'imgurl': 1,
  }
  // 搜索好友
  Group.find(wherestr, out)
    .then(result => {
      res.send({ status: 200, result })
    })
    .catch(err => {
      res.send({ status: 500 })
    });
}
// 判断是否在群内
exports.isInGroup = (uid, gid, res) => {
  var wherestr = { 'userID': uid, 'groupID': gid }
  GroupUser.findOne(wherestr)
    .then(result => {
      if (result) {
        // 在群内
        res.send({ status: 200 })
      } else {
        // 不在群内
        res.send({ status: 400 })
      }
    })
    .catch(err => {
      res.send({ status: 500 })
    });
}

// 用户详情
exports.userDetial = (id, res) => {
  var wherestr = { '_id': id };
  var out = { 'psw': 0 };
  User.findOne(wherestr, out)
    .then(result => {
      res.send({ status: 200, result })
    })
    .catch(err => {
      res.send({ status: 500 })
    });
}

// 用户详情修改
function update(data, update, res) {
  User.findByIdAndUpdate(data, update)
    .then(resu => {
      // 修改成功
      res.send({ status: 200 })
    })
    .catch(err => {
      // 修改失败
      res.send({ status: 500 })
    });
}

exports.userUpdate = (data, res) => {
  var updatestr = {};
  var wherestr = { '_id': data.id };
  var out = { 'psw': 1 };
  // 判断是否有密码项
  if (typeof (data.pwd) !== 'undefined') {
    // 有密码（需要匹配）
    User.find(wherestr, out)
      .then(result => {
        if (result == '') {
          // res.send({ status: 400 });
          res.send({ status: 400 })
        }
        result.map((e) => {
          var pwdMatch = bcrypt.verification(data.pwd, e.psw);
          // console.log('12312');
          if (pwdMatch) {
            // 密码验证成功
            // 如果修改密码需要加密
            if (data.type === 'psw') {
              // (修改密码）密码加密
              var password = bcrypt.encryption(data.data);
              updatestr[data.type] = password;
              update(data.id, updatestr, res);
            } else {
              // 邮箱匹配（修改邮箱）
              updatestr[data.type] = data.data;
              User.countDocuments(updatestr)
                .then(result => {
                  // 成功
                  if (result == 0) {
                    // 匹配不上邮箱（可以修改）
                    update(data.id, updatestr, res);
                  } else {
                    // 邮箱存在（不可修改）
                    res.send({ status: 400, title: '邮箱存在（不可修改）' })
                  }
                })
                .catch(err => {
                  // 失败
                  res.send({ status: 400, err: err })
                });
            }
          } else {
            // 密码验证失败
            res.send({ status: 400, title: '密码验证失败' })
          }
        })
      })
      .catch(err => {
        // res.send({ status: 500 + err });
        res.send({ status: 500, err: err })
      });
  } else {
    // 没有密码(一般修改)
    updatestr[data.type] = data.data;
    update(data.id, updatestr, res)
  }
}
// 获取好友昵称
exports.getMarkName = (data, res) => {
  var wherestr = { 'userID': data.uid, 'friendID': data.fid };
  var out = { 'markname': 1 };
  Friend.findOne(wherestr, out)
    .then(result => {
      // 获取成功
      res.send({ status: 200, result: result })
    })
    .catch(err => {
      // 获取失败
      res.send({ status: 500 })
    });
}
// 好友备注修改
exports.updateMarkName = (data, res) => {
  var wherestr = { 'userID': data.uid, 'friendID': data.fid };
  var updatestr = { 'markname': data.name };
  Friend.updateOne(wherestr, updatestr)
    .then(result => {
      // 修改成功
      res.send({ status: 200 })
    })
    .catch(err => {
      // 修改失败
      res.send({ status: 500 })
    });
}

// 好友申请和拒绝
// 添加好友表
exports.buildFriend = (uid, fid, state, res) => {
  var data = {
    userID: uid,
    friendID: fid,
    state: state, // 状态
    time: new Date(),
    lastTime: new Date(),
  }
  var friend = new Friend(data);

  friend.save()
    .then(result => {
      // 处理成功逻辑
    })
    .catch(err => {
      console.log('申请好友表失败');
    });
}
// 最后一条消息的时间（包括发送好友申请）
exports.upFriendLastTime = (data) => {
  var wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] };
  var updatestr = { 'lastTime': new Date() };
  Friend.updateMany(wherestr, updatestr)
    .then(result => {
      // res.send({ status: 200 })
    })
    .catch(err => {
      console.log('好友最后一条消息更新失败');
    })
}
// 添加好友之间一对一消息表
exports.insertMsg = (uid, fid, msg, type, res) => {
  var data = {
    userID: uid,
    friendID: fid,
    message: msg,
    types: type,
    time: new Date(),
    state: 1,
  }
  var message = new Message(data);

  message.save()
    .then(result => {
      if (res) {
        res.send({ status: 200 })
      }
    })
    .catch(err => {
      if (res) {
        res.send({ status: 500 })
      }
    })
}
// 好友申请
exports.applyFriend = (data, res) => {
  // 判断是否为第一次发送申请
  var wherestr = { 'userID': data.uid, 'friendID': data.fid };
  Friend.countDocuments(wherestr)
    .then(result => {
      if (result == 0) {
        // 未申请过好友（第一次申请）
        this.buildFriend(data.uid, data.fid, 2);
        this.buildFriend(data.fid, data.uid, 1);
      } else {
        // 申请过好友
        this.upFriendLastTime(data);
      }
      // 添加消息
      this.insertMsg(data.uid, data.fid, data.msg, 0, res);
    })
    .catch(err => {
      res.send({ status: 500 + '申请失败：查询不到用户' + err })
    })
}
// 更新好友状态（同意）
exports.updateFriendState = (data, res) => {
  // 修改项
  var wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] };
  Friend.updateMany(wherestr, { 'state': 0 })
    .then(result => {
      res.send({ status: 200 })
    })
    .catch(err => {
      res.send({ status: 500 })
    })
}
//  拒绝或删除好友
exports.deleteFriend = (data, res) => {
  // 修改项
  var wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] };
  Friend.deleteMany(wherestr)
    .then(result => {
      res.send({ status: 200 })
    })
    .catch(err => {
      res.send({ status: 500 + err })
    })
}

// 获取好友列表
exports.getUsers1 = (data, res) => {
  return new Promise(function(resolve, reject) {
    var query = Friend.find({});
    // 查询条件
    query.where({ 'userID': data.uid, 'state': data.state });
    // 查找friendID关联的user对象
    query.populate('friendID');
    // 排序方式 (根据最后消息时间倒序)
    query.sort({ 'lastTime': -1 });
    // 查询结果
    query.exec()
      .then(e => {
        var result = e.map((ver) => {
          return {
            id: ver.friendID._id,
            name: ver.friendID.name,
            markname: ver.markname,
            imgurl: ver.friendID.imgurl,
            lastTime: ver.lastTime,
            type: 0,
          };
        });
        resolve({ status: 200, result });
      })
      .catch(err => {
        reject({ status: 500 });
      });
  }).then(function onFulfilled(value) {
    res.send(value);
  })
}
// 获取一条一对一消息(最后一条)
exports.getOneMsg = (data, res) => {
  var query = Message.findOne({});
  // 查询条件
  query.where({ $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] });
  // 排序方式 (根据最后消息时间倒序)
  query.sort({ 'time': -1 });
  // 查询结果
  query.exec()
    .then(ver => {
      var result = {
        message: ver.message,
        time: ver.time,
        types: ver.types,
      }
      res.send({ status: 200, result });
    })
    .catch(err => {
      res.send({ status: 500 + err });
    })
}
// 汇总一对一消息数量(未读)
exports.unreadMsg = (data, res) => {
  var wherestr = { 'userID': data.fid, 'friendID': data.uid, 'state': 1 };
  Message.countDocuments(wherestr)
    .then(result => {
      res.send({ status: 200, result })
    })
    .catch(err => {
      res.send({ status: 500, err })
    })
}



// 获取好友列表
function getUser(data) {
  return new Promise(function(resolve, reject) {
    var query = Friend.find({});
    // 查询条件
    query.where({ 'userID': data.uid, 'state': data.state });
    // 查找friendID关联的user对象
    query.populate('friendID');
    // 排序方式 (根据最后消息时间倒序)
    query.sort({ 'lastTime': -1 });
    // 查询结果
    query.exec()
      .then(function(e) {
        var result = e.map((ver) => {
          return {
            id: ver.friendID._id,
            name: ver.friendID.name,
            markname: ver.markname,
            imgurl: ver.friendID.imgurl,
            lastTime: ver.lastTime,
            type: 0,
          }
        })
        resolve({ status: 200, result });
      })
      .catch(err => {
        reject({ status: 500 });
      })
  })
}

// 获取一条一对一消息(最后一条)
function getOneMsg1(uid, fid) {
  // console.log('1');
  return new Promise(function(resolve, reject) {
    var query = Message.findOne({});
    // 查询条件
    query.where({ $or: [{ 'userID': uid, 'friendID': fid }, { 'userID': fid, 'friendID': uid }] });
    // 排序方式 (根据最后消息时间倒序)
    query.sort({ 'time': -1 });
    // 查询结果
    query.exec()
      .then(function(ver) {
        var result = {
          message: ver.message,
          time: ver.time,
          types: ver.types,
        }
        resolve({ status: 200, result });
      })
      .catch(function(err) {
        reject({ status: 500, err });
      })
  })
}
// 汇总一对一消息数量(未读)
function unreadMsg1(uid, fid) {
  return new Promise(function(resolve, reject) {
    var wherestr = { 'userID': fid, 'friendID': uid, 'state': 1 };
    Message.countDocuments(wherestr)
      .then(function(result) {
        resolve({ status: 200, result })
        // console.log(result,'1');
      })
      .catch(function(err) {
        reject({ status: 500, err })
      })
  })
}

// async/await联合查询好友以及最后一条消息
async function doIt(data, res) {
  var result, msg, tipNum, err; // result好友列表；msg好友消息；tipNum未读消息数
  // console.log('1');
  [err, result] = await getUser(data).then(data => [null, data]).catch(err => [err, null]);
  // console.log([err, result]);
  for (var i = 0;i < result.result.length;i++) {
    // console.log('3');
    [err, msg] = await getOneMsg1(data.uid, result.result[i].id).then(data => [null, data]).catch(err => [err, null]);
    if (msg.types == 0) {
      // 文字
    } else if (msg.types == 1) {
      // 图片
      msg.message = '[图片]'
    } else if (msg.types == 2) {
      // 语音
      msg.message = '[语音]'
    }
    else if (msg.types == 3) {
      // 位置
      msg.message = '[位置]'
    };
    // console.log([err, msg]);
    result.result[i].msg = msg.result.message;
    [err, tipNum] = await unreadMsg1(data.uid, result.result[i].id).then(data => [null, data]).catch(err => [err, null]);
    // console.log([err, tipNum]);
    result.result[i].tip = tipNum.result;
  }
  if (err) {
    res.send({ err })
  } else {
    res.send({ status: 200, result })
  }
  // console.log(result);
}


// 好友列表
exports.getUsers = (data, res) => {
  doIt(data, res)
}











// 一对一消息状态修改
exports.updateMsg = (data, res) => {
  var wherestr = { 'userID': data.fid, 'friendID': data.uid, 'state': 1 };
  // 修改内容
  var updatestr = { 'state': 0 };
  Message.updateMany(wherestr, updatestr)
    .then(result => {
      res.send({ status: 200 })
    })
    .catch(err => {
      res.send({ status: 500 })
    })
}


// 添加群成员
exports.insertGroupUser = (data, res) => {
  var groupuser = new GroupUser(data);
  groupuser.save()
    .then(result => {
      // console.log('成功');
    })
    .catch(err => {
      res.send({ status: 500 })
    })
}

// 新建群
exports.createGroup = (data, res) => {
  var groupData = {
    userID: data.uid,
    name: data.name,
    imgurl: data.imgurl,
    time: new Date(),
  }

  var group = new Group(groupData);

  group.save()
    .then(results => {
      var wherestr = { 'userID': data.uid };
      var out = { '_id': 1 };
      Group.find(wherestr, out)
        .then(resu => {
          resu.map((gid) => {
            var udata = {
              groupID: gid._id,
              userID: data.uid,
              time: new Date(),
              lastTime: new Date(),
            }
            this.insertGroupUser(udata, res)


            for (var i = 0;i < data.user.length;i++) {
              var fdata = {
                groupID: gid._id,
                userID: data.user[i],
                time: new Date(),
                lastTime: new Date(),
              }
              this.insertGroupUser(fdata, res)
            }
          })
          res.send({ status: 200, resu, message: '创建群成功' });
        })
        .catch(err => {
          res.send({ status: 500 })
        })
    })
    .catch(err => {
      res.send({ status: 500, to: '创建失败' })
    })
}



// 获取群列表(自己在的群)

// // 获取好友列表
// function getGroup(data) {
//   return new Promise(function(resolve, reject) {
//     var query = GroupUser.find({});
//   // 查询条件
//   query.where({ 'userID': data.uid });
//   // 查找groupID关联的user对象
//   query.populate('groupID');
//   // 排序方式 (根据最后消息时间倒序)
//   query.sort({ 'lastTime': -1 });
//     // 查询结果
//     query.exec()
//       .then(function(e) {
//         var result = e.map((ver) => {
//           return {
//             id: ver.groupID._id,
//             name: ver.groupID.name,
//             // markname: ver.name,
//             imgurl: ver.groupID.imgurl,
//             lastTime: ver.lastTime,
//             tip: ver.tip,
//             type: 1,
//           }
//         })
//         resolve({ status: 200, result });
//       })
//       .catch(err => {
//         reject({ status: 500 });
//       })
//   })
// }

// // 获取群消息(最后一条)
// function getOneGroupMsg(gid) {
//   // console.log('1');
//   return new Promise(function(resolve, reject) {
//     var query = GroupMsg.findOne({});
//     // 查询条件
//     query.where({ 'groupID': gid  });
//     // 排序方式 (根据最后消息时间倒序)
//     query.sort({ 'time': -1 });
//     // 查询结果
//     query.exec()
//       .then(function(ver) {
//         var result = {
//           message: ver.message,
//           time: ver.time,
//           types: ver.types,
//         }
//         resolve({ status: 200, result });
//       })
//       .catch(function(err) {
//         reject({ status: 500, err });
//       })
//   })
// }
// // 汇总一对一消息数量(未读)
// function unreadMsg1(uid, fid) {
//   return new Promise(function(resolve, reject) {
//     var wherestr = { 'userID': fid, 'friendID': uid, 'state': 1 };
//     Message.countDocuments(wherestr)
//       .then(function(result) {
//         resolve({ status: 200, result })
//         // console.log(result,'1');
//       })
//       .catch(function(err) {
//         reject({ status: 500, err })
//       })
//   })
// }

// // async/await联合查询好友以及最后一条消息
// async function doIt(data, res) {
//   var result, msg, tipNum, err; // result好友列表；msg好友消息；tipNum未读消息数
//   // console.log('1');
//   [err, result] = await getUser(data).then(data => [null, data]).catch(err => [err, null]);
//   // console.log([err, result]);
//   for (var i = 0;i < result.result.length;i++) {
//     // console.log('3');
//     [err, msg] = await getOneMsg1(data.uid, result.result[i].id).then(data => [null, data]).catch(err => [err, null]);
//     if (msg.types == 0) {
//       // 文字
//     } else if (msg.types == 1) {
//       // 图片
//       msg.message = '[图片]'
//     } else if (msg.types == 2) {
//       // 语音
//       msg.message = '[语音]'
//     }
//     else if (msg.types == 3) {
//       // 位置
//       msg.message = '[位置]'
//     };
//     // console.log([err, msg]);
//     result.result[i].msg = msg.result.message;
//     [err, tipNum] = await unreadMsg1(data.uid, result.result[i].id).then(data => [null, data]).catch(err => [err, null]);
//     // console.log([err, tipNum]);
//     result.result[i].tip = tipNum.result;
//   }
//   if (err) {
//     res.send({ err })
//   } else {
//     res.send({ status: 200, result })
//   }
//   // console.log(result);
// }








// exports.getGroup = (data, res) => {
//   doIt(data, res)
// }











exports.getGroup = (uid, res) => {
  var query = GroupUser.find({});
  // 查询条件
  query.where({ 'userID': uid });
  // 查找groupID关联的user对象
  query.populate('groupID');
  // 排序方式 (根据最后消息时间倒序)
  query.sort({ 'lastTime': -1 });
  // 查询结果
  query.exec()
    .then(e => {
      // console.log(e);
      var result = e.map((ver) => {
        return {
          id: ver.groupID._id,
          name: ver.groupID.name,
          // markname: ver.name,
          imgurl: ver.groupID.imgurl,
          lastTime: ver.lastTime,
          tip: ver.tip,
          type: 1,
        }
      })
      res.send({ status: 200, result });
    })
    .catch(err => {
      res.send({ status: 500 });
    })
}

// 添加群消息表
exports.insertGroupMsg = (uid, gid, msg, type, res) => {
  var data = {
    userID: uid,
    groupID: gid,
    message: msg,
    types: type,
    time: new Date(),
    state: 1,
  }
  var gmessage = new GroupMsg(data);

  gmessage.save()
    .then(result => {
      if (res) {
        res.send({ status: 200 })
      }
    })
    .catch(err => {
      if (res) {
        res.send({ status: 500 })
      }
    })
}


// 获取群最后一条消息
exports.getOneGroupMsg = (gid, res) => {
  var query = GroupMsg.findOne({});
  // 查询条件
  query.where({ 'groupID': gid });
  // 关联的user对象
  query.populate('userID');
  // 排序方式 (根据最后消息时间倒序)
  query.sort({ 'time': -1 });
  // 查询结果
  query.exec()
    .then(ver => {
      var result = {
        message: ver.message,
        time: ver.time,
        types: ver.types,
        name: ver.userId.name,
      }
      res.send({ status: 200, result });
    })
    .catch(err => {
      res.send({ status: 500 + err });
    })
}
// 群消息状态修改
exports.updateGroupMsg = (data, res) => {
  var wherestr = { 'userID': data.uid, 'groupID': data.gid };
  // 修改内容
  var updatestr = { 'tip': 0 };
  Message.updateOne(wherestr, updatestr)
    .then(result => {
      res.send({ status: 200 })
    })
    .catch(err => {
      res.send({ status: 500 })
    })
}


// 消息操作
// 分页获取数据一对一聊天数据
exports.msg = (data, res) => {
  var skipNum = data.nowPage * data.pageSize; // 跳过的条数
  var query = Message.find({});
  // 查询条件
  query.where({ $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] });
  // 查找userID关联的user对象
  query.populate('userID');
  // 排序方式 (根据最后消息时间倒序)
  query.sort({ 'time': -1 });
  // 跳过的条数
  query.skip(skipNum);
  // 一页的条数
  query.limit(data.pageSize);
  // 查询结果
  query.exec()
    .then(e => {
      var result = e.map((ver) => {
        return {
          id: ver._id,
          message: ver.message,
          types: ver.types,
          time: ver.time,
          fromId: ver.userID._id,
          imgurl: ver.userID.imgurl,
        }
      })
      res.send({ status: 200, result });
    })
    .catch(err => {
      res.send({ status: 500 });
    })
}



// 分页获取群聊天数据
exports.Groupmsg = (data, res) => {
  // console.log(data);
  var skipNum = data.nowPage * data.pageSize; // 跳过的条数
  var query = GroupMsg.find({});
  // 查询条件
  query.where({ 'groupID': data.gid });
  // 查找userID关联的user对象
  query.populate('userID');
  // 排序方式 (根据最后消息时间倒序)
  query.sort({ 'time': -1 });
  // 跳过的条数
  query.skip(skipNum);
  // 一页的条数
  query.limit(data.pageSize);
  // 查询结果
  query.exec()
    .then(e => {
      // console.log(e);
      var result = e.map((ver) => {
        return {
          id: ver._id,
          message: ver.message,
          types: ver.types,
          time: ver.time,
          fromId: ver.userID._id,
          imgurl: ver.userID.imgurl,
        }
      })
      res.send({ status: 200, result });
    })
    .catch(err => {
      res.send({ status: 500 });
    })
}


