var express = require('express');  // 引入express
var bodyarser = require('body-parser'); // 引入解析req.body插件
const { header } = require('express/lib/request'); // 导入响应头

// token
var jwt = require('./dao/jwt');
var app = express();
var cors = require('cors'); // 导入 cors 解决跨域
const bodyParser = require('body-parser');
const { Socket } = require('socket.io');
app.use(cors()); // 之后每个响应头都会被设置允许跨域
var port = 3000; // 端口

// socket.io
var server = app.listen(8082);
var io = require('socket.io')(server);
require('./dao/socket')(io);



// 解析前端数据
app.use(bodyParser.json({ limit: '5000mb', extended: true })); // ltmit 文件上传的最大大小
app.use(bodyParser.json({ limit: '5000mb' }));
// 获取静态路径
app.use(express.static(__dirname + '/data'));

// token 判断
app.use((req, res, next) => {
  if (typeof (req.body.token) != 'undefined') {
    // token 匹配
    var token = req.body.token;
    var tokenMatch = jwt.verifyToken(token);
    if (tokenMatch == 1) {
      // 验证通过
      next()
    } else {
      // 验证不通过
      res.send({ result: 300 })
    }
  } else {
    next()
  }
})


// 引入自己写的路由
require('./router/index')(app);
require('./router/files')(app);

// 404页面
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 出现错误处理
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
  console.log(err.message);
})

app.listen(port, () => {
  console.log(`Example app listening on ore ${port}!`);
});