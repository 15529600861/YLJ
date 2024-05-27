// 新建群
var dbserver = require('../dao/dbsever');

exports.createGroup = (req, res) => {
  var data = req.body;
  dbserver.createGroup(data, res);
}