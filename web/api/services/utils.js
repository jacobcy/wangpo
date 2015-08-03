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

function saveQiniuImageFromUrl(url, cb) {
  request({
    url: url,
    encoding: null
  }, function (err, r, body) {
    if (err) {
      console.error('[saveImage] Failed to get image ' + url + ' with error: ' + err);
      cb({
        error: err
      });
      return;
    }
    type = r.headers['content-type'];
    if (type.indexOf('image') === -1) {
      // 传入的不是图片
      cb({
        error: '输入的文件不是图片，格式为: ' + type
      });
      return;
    }
    // 图片大小限制(单位M)
    if (body.length > UPLOAD_LIMIT_IN_MBYTES * 1024 * 1024) {
      cb({
        error: '图片应小于' + UPLOAD_LIMIT_IN_MBYTES + 'M'
      });
      return;
    }
    var name = md5(url + Date.now());
    upload_qiniu_file(name, body, type, function(err, url) {
      if (err) {
        cb({
          error: err
        });
        return;
      }
      cb({
        url: url
      });
    });
  });
}

module.exports = {
  saveQiniuImageFromUrl: saveQiniuImageFromUrl
};
