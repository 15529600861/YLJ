var dbserver = require('../dao/dbsever');
var email = require('../dao/emailsever'); // 引入发送邮件 

// 用户注册
exports.signUp = (req, res) => {
  var name = req.body.name;
  var mail = req.body.mail;
  var pwd = req.body.pwd;
  // res.send({ name, mail, pwd })
  // 发送邮件
  email.emailSignup(mail, res);

  dbserver.buildUser(name, mail, pwd, res);
};

// 用户或邮箱是否占用判断
exports.judgeValue = (req, res) => {
  var data = req.body.data;
  var type = req.body.type;
  // res.send({data, type});
  dbserver.countUserValue(data, type, res);
}