var request = require('request');

// 微博粉服平台获取微博用户基本信息的URL
// 详见 http://open.weibo.com/wiki/获取用户基本信息
var WEIBO_USER_INFO_URL = 'https://api.weibo.com/2/eps/user/info.json?access_token=' +
                          sails.config.weibo.access_token +
                          '&uid=';
var WeiboUser = {

  attributes: {
    // e.g. "0001"
    innerId: {type: 'string'},
    // e.g. "李小敏"
    userName: {type:  'string'},
    // e.g. "1978.03.15"
    userBirthday: {type: 'date'},
    // e.g. "男"
    gender: {type: 'string'},
    // e.g. "175", 单位厘米
    height: {type: 'integer'},
    // e.g. "北京"
    userLocation: {type: 'string'},
    description: {type: 'string'},
    lock: {type: 'boolean'},
    avatar: {type: 'string'}
  },

  beforeCreate: function(user, next) {
    if (user.userName) {
      next();
      return;
    }
    // 通过微博uid获取微博用户详细信息
    request({
      url: WEIBO_USER_INFO_URL + user.innerId,
      json: true
    }, function(err, res, json) {
      if (err || json.error) {
        console.error("Failed to access Weibo user info: " + (err || json.error));
        next();
        return;
      }
      user.userName = json.nickname;
      if (!user.gender && json.sex !== 0) {
        user.gender = json.sex === 1 ? "男" : "女";
      }
      next();
    });
  }
};

module.exports = WeiboUser;
