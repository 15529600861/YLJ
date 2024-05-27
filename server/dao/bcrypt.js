var bcrypt = require('bcryptjs');

// 生成hash密码
exports.encryption = (e) => {
  var salt = bcrypt.genSaltSync(10); // 生成随机的salt

  // 生成hash密码
  var hash = bcrypt.hashSync(e, salt);

  return hash;
};


// 解密
exports.verification = (e, hash) => {
  var verif = bcrypt.compareSync(e, hash); // true/false

  return verif;
}