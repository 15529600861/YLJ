// 用来连接mongoDB数据库
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://127.0.0.1:27017/yun', { useNewUrlParser: true, useUnifiedTopology: true });

db.on('error', console.error.bind(console, 'connection error:')); // 失败
db.once('open', () => {
  console.info('连接成功')
}); // 成功

module.exports = db;