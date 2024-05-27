// 文件传输交互
var multer = require('multer'); // 附件上传文件
var mkdir = require('../dao/mkdir');  // 新建路径目录文件
// var urls;
// 控制文件存储
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // 文件路径
    var url = req.body.url;
    // console.log(url);
    mkdir.mkdirs('../data/' + url, err => {
      console.log(err);
    });
    cb(null, './data/' + url) // 文件存储的位置
  },
  filename: function(req, file, cb) {
    // 对 file.originalname 进行正则匹配后缀名
    var type = file.originalname.replace(/.+\./, "."); // file.originalname 上传文件的文件名称（01.jpg）
    var name = req.body.name;
    // urls = req.body.url;
    // console.log(req.body);
    // console.log(type);
    cb(null, name + type) // 文件的名字
  }
})

var upload = multer({ storage: storage })

module.exports = (app) => {
  // 文件上传
  app.post('/files/upload', upload.array('file', 9), (req, res, next) => {
    // photos 最多上传9张图片
    var url = req.body.url
    // 获取文件信息
    var data = req.files[0].filename;
    // 返回给前端
    var imgurl = '/' + url + '/' + data
    // console.log(data);
    res.send(imgurl)
  })
}