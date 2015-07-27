var request = require('request');

// 微博粉服平台获取微博用户基本信息的URL
// 详见 http://open.weibo.com/wiki/获取用户基本信息
var WEIBO_USER_INFO_URL = 'https://api.weibo.com/2/eps/user/info.json?access_token=' +
                          sails.config.weibo.access_token +
                          '&uid=';
var WeiboUser = {

  attributes: {
    // e.g. "0001"，必须，唯一
    weiboId: {
      type: 'integer',
      size: 16,
      required: true,
      unique: true
    },
    // e.g. "李小敏"，必须
    nickname: {
      type: 'string',
      size: 32
    },
    // e.g. "1：男 2：女 0：未知"
    gender: {
      type: 'integer',
      size: 1,
      enum: '[1,2,0]',
      defaultsTo: 0
    },
    // e.g. "1978.03.15"
    birthday: {
      type: 'date'
    },
    // e.g. "175", 单位厘米
    height: {
      type: 'integer',
      size: 3
    },
    // e.g. "010：北京"
    location: {
      type: 'string',
      size: 4
    },
    // 用户头像url
    avatar: {
      type: 'string',
      size: 128
    },
    // 用户照片url
    photos: {
      type: 'array'
    },
    // 用户描述
    description: {
      type: 'string',
      size: 512
    },
    // 锁定用户资料，不再匹配
    lock: {
      type: 'boolean',
      defaultsTo: false
    },
    // 隐藏用户资料，不再匹配
    hide: {
      type: 'boolean',
      defaultsTo: false
    }
  },

  beforeCreate: function(user, next) {
    if (user.nickname) {
      next();
      return;
    }
    // 通过微博uid获取微博用户详细信息
    request({
      url: WEIBO_USER_INFO_URL + user.weiboId,
      json: true
    }, function(err, res, json) {
      if (err || json.error) {
        console.error("Failed to access Weibo user info: " + (err || json.error));
        next();
        return;
      }
      user.nickname = json.nickname;
      if (!user.avatar) {
        user.avatar = json.headimgurl;
      }
      next();
    });
  }
};

module.exports = WeiboUser;
