var dbserver = require('./dbsever');

module.exports = function(io) {
  var users = {} // socket注册用户
  io.on('connection', (socket) => {
    console.log('开启成功');
    // 用户登陆注册
    socket.on('login', (id) => {
      // console.log(socket);
      // 回复客户端
      socket.name = id;
      users[id] = socket.id;
      socket.emit('login', id);
    });

    // 好友一对一消息
    socket.on('msg', (msg, fromid, toid) => {
      // console.log(msg);

      // 存入数据库
      // 修改消息的最后时间
      dbserver.upFriendLastTime({ uid: fromid, fid: toid });
      // console.log(toid);
      // 存储消息
      dbserver.insertMsg(fromid, toid, msg.message, msg.types)

      // 回复客户端
      // 发送给对方 (0)
      if (users[toid]) {
        socket.to(users[toid]).emit('msg', msg, fromid, 0);
      }
      // 自己拿到数据(1)
      socket.emit('msg', msg, toid, 1);
    });

    // 用户离开
    socket.on('disconnecting', () => {
      // console.log(users);
      if (users.hasOwnProperty(socket.name)) {
        delete users[socket.name];
      };
      console.log('离开');
    });


    // 加入群
    socket.on('group', (data) => {
      socket.join(data);
    });

    // 接收群消息
    socket.on('groupMsg', (msg, fromid, gid, name, img) => {

// 存入数据库
      // 修改消息的最后时间
      // dbserver.upFriendLastTime({ uid: fromid, fid: toid });
      // 存储消息
      dbserver.insertGroupMsg(fromid, gid, msg.message, msg.types)

      
      // 群内广播消息
      socket.to(gid).emit('groupMsg', msg, fromid, gid, name, img,0)
      socket.emit('groupMsg', msg, fromid, gid, name, img,1)
    });



    // 告知离开当前聊天页面
    socket.on('leaveChatr',(uid,fid)=>{
      socket.emit('leavechatr', uid,fid)
    })
  })
}