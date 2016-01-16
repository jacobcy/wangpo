/**
* CloudImage.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var path = require('path');

module.exports = {
  schema: true,

  attributes: {
    weiboUser: {
      model: 'WeiboUser'
    },

    id: {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },

    /*
     * 文件hash值
     * 按照七牛云存储方式计算hash值，详见 https://github.com/qiniu/qetag。
     * 算法大体如下：
     *   如果你能够确认文件 <= 4M，那么
     *   hash = UrlsafeBase64([0x16, sha1(FileContent)])。
     *   也就是，文件的内容的sha1值（20个字节），前面加一个byte（值为0x16），
     *   构成 21 字节的二进制数据，然后对这 21 字节的数据做 urlsafe 的 base64 编码。
     *   如果文件 > 4M，则
     *   hash = UrlsafeBase64([0x96, sha1([sha1(Block1), sha1(Block2), ...])])，
     *   其中 Block 是把文件内容切分为 4M 为单位的一个个块，
     *   也就是 BlockI = FileContent[I*4M:(I+1)*4M]。
     */
    hash: {
      type: 'string',
      defaultsTo: '',
      size: 128
    },

    mimeType: {
      type: 'string',
      defaultsTo: 'image/jpg',
      size: 16
    },

    // 原始图片URL
    sourceUrl: {
      type: 'string',
      defaultsTo: '',
      size: 1024
    },

    // 本地文件地址，不是文件备份地址
    localPath: {
      type: 'string',
      defaultsTo: '',
      size: 1024
    },

    // 远程URL
    remoteUrl: {
      type: 'string',
      defaultsTo: '',
      size: 1024
    },

    retries: {
      type: 'integer',
      defaultsTo: 0
    },

    /**
     * 获取可以显示的URL
     * 优先使用remoteUrl, 然后是localPath, 最后是sourceUrl
     */
    getDisplayableUrl: function() {
      if (!this.remoteUrl) {
        return this.remoteUrl;
      }
      if (this.sourceUrl) {
        return this.sourceUrl;
      }
      var base = path.resolve('./upload/images');
      var local = this.localPath;
      if (local.indexOf(base) === 0) {
        local = local.substr(base.length);
      }

      return '/upload/images' + local;
    }
  },

  /**
   * 批量获取可以显示的URL
   */
  getDisplayableUrls: function(ids, cb) {
    CloudImage.find({ id: ids }).exec(function (err, records) {
      if (err) {
        cb(err);
        return;
      }
      var urls = [];
      for (var i = 0; i < records.length; i++) {
        urls.push(records[i].getDisplayableUrl());
      }
      cb(null, urls);
    });
  },

  /**
   * 通过URL备份和上传一个七牛云照片
   */
  addByUrl: function(url, cb) {
    CloudImage.findOrCreate(
      { sourceUrl: url },
      { sourceUrl: url }).exec(function (err, record) {
      if (err) {
        cb(err);
        return;
      }

      cb(null, record);
    });
  },

  /**
   * 备份一个本地图片文件，并上传至七牛云
   */
  addByLocalFile: function(localPath, mimeType, cb) {
    CloudImage.findOrCreate(
      { localPath: localPath },
      { localPath: localPath, mimeType: mimeType }).exec(function (err, record) {
      if (err) {
        cb(err);
        return;
      }

      cb(null, record);
    });
  }
};

