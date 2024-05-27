// 导入发送邮件插件
var nodemailer = require('nodemailer');
// 引入证书文件
var credentials = require('../config/credentials');

// 创建传输方式
var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: credentials.qq.user,
    pass: credentials.qq.pass,
  }
});


// 注册发送邮件给用户
exports.emailSignup = (email, res) => {
  // 发送信息
  var options = {
    from: '2450349920@qq.com',
    to: email,
    subject: '欢迎加入云聊界',
    html: '<span>恭喜你注册成功！！！</span><a href="http://localhost:8080/">点击</a>',
  };

  // 发送邮件
  transporter.sendMail(options, (err, msg) => {
    if (err) {
      res.send(err); //返回错误给前端
      console.log(err);
    } else {
      res.send('邮箱发送成功！');//返回成功给前端
      console.log('邮箱发送成功！');
    }
  })
};