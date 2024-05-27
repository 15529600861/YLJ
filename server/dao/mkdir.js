// 用来新建文件目录
var fs = require('fs');
var path = require('path');

exports.mkdirs = (pathname, callback) => {
  // 需要判断是否是绝对路径
  pathname = path.isAbsolute(pathname) ? pathname : path.join(__dirname, pathname);
  // 获取相对路径
  pathname = path.relative(__dirname, pathname);
  var floders = pathname.split(path.sep); // path.spe 避免平台差异
  var pre = '';
  floders.forEach(floder => {
    try {
      // 没有异常，创建文件
      var _stat = fs.statSync(path.join(__dirname, pre, floder));
      var hasMkdir = _stat && _stat.isDirectory();
      if (hasMkdir) {
        callback // 文件${floder}已经存在，不能重复创建
      }
    } catch (error) {
      // 异常 ； 文件不存在则创建文件
      try {
        // 避免父文件还没有创建先创建出子文件，这里同步创建文件
        fs.mkdirSync(path.join(__dirname, pre, floder));
        callback && callback(null);
      } catch (error) {
        callback && callback(error);
      }
    }
    pre = path.join(pre, floder); // 拼合路径
  })
}