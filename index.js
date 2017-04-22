/**
 * Created by Frank on 2017/4/22.
 */
const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const formidable = require('formidable')

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
  console.log('ip',server.address().address)
  console.log('port',server.address().port)
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


const server = app.listen(3000, function () {
  const host = server.address().address
  const port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})