/**
 * Created by Frank on 2017/4/22.
 */
const path = require('path')
const fs = require('fs')
const os = require('os')
const express = require('express')
const app = express()
const formidable = require('formidable')

function getLocalIP() {
  var ifaces = os.networkInterfaces();
  console.log(ifaces);
  for (var dev in ifaces) {
    if (dev.indexOf('eth0') != -1) {
      var tokens = dev.split(':');
      var dev2 = null;
      if (tokens.length == 2) {
        dev2 = 'eth1:' + tokens[1];
      } else if (tokens.length == 1) {
        dev2 = 'eth1';
      }
      if (null == ifaces[dev2]) {
        continue;
      }
      // 找到eth0和eth1分别的ip
      var ip = null, ip2 = null;
      ifaces[dev].forEach(function (details) {
        if (details.family == 'IPv4') {
          ip = details.address;
        }
      });
      ifaces[dev2].forEach(function (details) {
        if (details.family == 'IPv4') {
          ip2 = details.address;
        }
      });
      if (null == ip || null == ip2) {
        continue;
      }
      // 将记录添加到map中去
      if (ip.indexOf('10.') == 0 ||
        ip.indexOf('172.') == 0 ||
        ip.indexOf('192.') == 0) {
        return ip2;
      } else {
        return ip;
      }
    }
  }
}
const ip = getLocalIP()


app.get('/', function (req, res) {
  res.sendfile(path.join(__dirname, 'index.html'))
})

app.post('/upload', function (req, res) {
  //只适合通过表单上传文件
  var form = new formidable.IncomingForm()

  // 指定本次文件上传的路径（默认保存到操作系统的临时目录了）
  form.uploadDir = path.join(__dirname, 'upload/')

  // 指定本次上传的文件保持扩展名（默认是false，没有扩展名）
  form.keepExtensions = true
  form.parse(req, function (err, fields, files) {
    console.log(fields)
    console.log(files)
    //文件重命名 保持原有的命名
    fs.rename(files.photo.path, path.join(__dirname, 'upload/', files.photo.name), function (err) {
      if (!err) {
        res.status(200).json({
          message: 'success'
        })
      }
    })

  })

})

//添加localhost或者127.0.0.1后只能在本地访问
const server = app.listen(3000, function () {
  const host = server.address().address //0.0.0.0  本地和局域网内都可以访问
  const port = server.address().port//3000
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})