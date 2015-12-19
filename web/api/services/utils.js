var qiniu = require('qiniu');
var md5 = require('md5');
var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

var getEtag = require('./qiniu/qetag.js');

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

/*
 * 将图片内容保存到七牛云并且在本地备份
 *
 * @param {Buffer | ReadableStream} content 文件内容
 * @param {String} mimeType 图片mimeType, 可以是image/png, image/jpeg, image/jpg,
 *   或者image/gif
 * @param {Function} function(err, { hash: String, url: String }),
 *   第二个参数返回七牛服务器上图片文件的hash和URL
 *
 * 本地文件备份到upload/qiniu/目录，文件名是图片hash值
 * 七牛SDK 参考 http://developer.qiniu.com/docs/v6/sdk/nodejs-sdk.html
 */
function saveCloudImage(content, mimeType, cb) {
  var putPolicy = new qiniu.rs.PutPolicy(sails.config.qiniu.bucket);
  var uptoken = putPolicy.token();
  var extra = new qiniu.io.PutExtra();
  extra.mimeType = mimeType;
  // 计算文件七牛hash值，避免上传重复文件
  getEtag(content, function(name) {
    // 上传文件前在本地备份文件
    createLocalImage(name, content, function(err) {
      if (err) {
        cb(err);
        return;
      }
      // 检查是否有相同的远程文件
      CloudImage.findOne({ remoteUrl: { '!': '' }, hash: name }).exec(function(err, found) {
        if (err) {
          cb(err);
          return;
        }
        if (found) {
          cb(null, {
            hash: name,
            url: found.remoteUrl
          });
          return;
        }

        // 上传七牛文件
        qiniu.io.put(uptoken, name, content, extra, function(err, ret) {
          if (err) {
            // 上传失败, 处理返回代码
            console.error('Failed to upload qiniu file: ' + err);
            cb(err);
            // http://developer.qiniu.com/docs/v6/api/reference/codes.html
            return;
          }

          if (ret.hash != name) {
            console.error('Qiniu file hash not match. ' + name + ' != ' + ret.hash);
            cb('hash not match');
            return;
          }
          // 上传成功
          cb(null, {
            hash: ret.hash,
            url: IMAGE_SERVER_URL + ret.key
          });
        });
      });
    });
  });
}

/*
 * 创建本地图片备份，如果图片已经存在直接返回。
 * @param {String} hash
 */
function createLocalImage(hash, content, cb) {
  var filePath = './upload/images/qiniu/' + hash;
  mkdirp(path.dirname(filePath), function (err) {
    if (err) {
      cb(err);
      return;
    }
    if (fs.exists(filePath)) {
      cb(null);
      return;
    }
    fs.writeFile(filePath, content, cb);
  })
}

function getImageContent(record, cb) {
  // 从本地文件读取图片
  if (record.localPath) {
    fs.readFile(record.localPath, function(err, data) {
      if (err) {
        cb(err);
        return;
      }
      cb(null, data);
    });
    return;
  }

  // 从URL读取图片
  request({
    url: record.sourceUrl,
    encoding: null
  }, function (err, r, body) {
    if (err) {
      console.error('[getImageContent] Failed to get image ' + record.sourceUrl + ' with error: ' + err);
      cb(err);
      return;
    }
    record.mimeType = r.headers['content-type'];
    // TODO: 大图需要压缩成小图片
    // 图片大小限制(单位M)
    if (body.length > UPLOAD_LIMIT_IN_MBYTES * 1024 * 1024) {
      cb('图片应小于' + UPLOAD_LIMIT_IN_MBYTES + 'M');
      return;
    }
    cb(null, body);
  });
}

var saving = false;
// 定时上传图片到七牛云
setInterval(function() {
  if (saving) {
    return;
  }
  saving = true;

  function increaseRetries(record) {
    CloudImage.update({ id: record.id }, { retries: record.retries + 1 }).exec(function(err, updated) {
      saving = false;
      if (err) {
        console.warn('Failed to update CloudImage record: ' + err);
        return;
      }
    });
  }

  CloudImage.findOne({
    where: { remoteUrl: '', retries: { '<': 3 } },
    sort: 'updatedAt'
  }).exec(function(err, found) {
    if (err || !found) {
      err && console.warn(err);
      saving = false;
      return;
    }
    if (!found.sourceUrl && !found.localPath) {
      console.error('Invalid CloudImage record with empty source.');
      // 删除无效数据
      CloudImage.destroy({ remoteUrl: '', localPath: '' }).exec(function(err) {
        saving = false;
        if (err) {
          console.log('Failed to delete invalid CloudImage records: ' + err);
        }
      });
      return;
    }
    getImageContent(found, function(err, content) {
      if (err) {
        console.error('Failed to CloudImage data: ' + err);
        increaseRetries(found);
        return;
      }
      saveCloudImage(content, found.mimeType, function(err, result) {
        if (err) {
            console.warn('Failed to save qiniu image: ' + err);
            increaseRetries(found);
            return;
          }
          // 图片上传成功，保存图片hash和URL
          CloudImage.update(
            { id: found.id },
            { hash: result.hash, remoteUrl: result.url, retries: found.retries + 1 }).exec(function(err, updated) {
            saving = false;
            if (err) {
              console.warn('Failed to update CloudImage record: ' + err);
            }
          });
      });
    });
  });
}, 5000);

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
