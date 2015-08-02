/**
 * MainControllerController
 *
 * @description :: Server-side logic for managing Maincontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var qiniu = require('qiniu');
var md5 = require('md5');
var request = require('request');

qiniu.conf.ACCESS_KEY = sails.config.qiniu.AccessKey;
qiniu.conf.SECRET_KEY = sails.config.qiniu.SecretKey;

const QINIU_BUCKET = sails.config.qiniu.bucket;
const IMAGE_SERVER_URL = 'http://' + QINIU_BUCKET + '.qiniudn.com/';
const UPLOAD_LIMIT_IN_MBYTES = sails.config.qiniu.uploadLimitInMbytes;

function upload_qiniu_file(name, content, type, cb) {
  var putPolicy = new qiniu.rs.PutPolicy(sails.config.qiniu.bucket);
  var uptoken = putPolicy.token();
  var extra = new qiniu.io.PutExtra();
  extra.mimeType = type;
  qiniu.io.put(uptoken, name, content, extra, function(err, ret) {
    if(!err) {
      // 上传成功
      cb(null, IMAGE_SERVER_URL + ret.key);
    } else {
      // 上传失败, 处理返回代码
      console.log('Failed to upload qiniu file: ' + err);
      cb(err, null);
      // http://developer.qiniu.com/docs/v6/api/reference/codes.html
    }
  });
}

module.exports = {
  index: function(req, res) {
    return res.view('index', {
      layout: 'layout'
    });
  },

  admin: function(req, res) {
    return res.view('angular', {
      layout: 'main-layout'
    });
  },

  /**
   * 转存网络图片到七牛服务器接口
   * /main/saveImage?url=[URL]
   * @param url 待存储图片的地址
   * @return 成功返回 {url: 七牛服务器图片URL}, 失败返回 {error: 错误信息}
   */
  saveImage: function(req, res, body) {
    var url = req.param('url') || '';
    if (!url) {
      return res.json({
        error: 'URL不能为空'
      });
    }
    request({
      url: url,
      encoding: null
    }, function (err, r, body) {
      if (err) {
        console.error('[saveImage] Failed to get image ' + url + ' with error: ' + err);
        res.json({
          error: err
        });
        return;
      }
      type = r.headers['content-type'];
      if (type.indexOf('image') === -1) {
        // 传入的不是图片
        return res.json({
          error: '输入的文件不是图片，格式为: ' + type
        });
      }
      // 图片大小限制(单位M)
      if (body.length > UPLOAD_LIMIT_IN_MBYTES * 1024 * 1024) {
        return res.json({
          error: '图片应小于' + UPLOAD_LIMIT_IN_MBYTES + 'M'
        });
      }
      var name = md5(url + Date.now());
      upload_qiniu_file(name, body, type, function(err, url) {
        if (err) {
          res.json({
            error: err
          });
          return;
        }
        res.json({
          url: url
        });
      });
    });
  }
};
