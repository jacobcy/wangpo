var request = require('request');

const COUNT_PER_PAGE = 30;
function dateToString(date) {
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
}

// 微博粉服平台获取微博用户基本信息的URL
// 详见 http://open.weibo.com/wiki/获取用户基本信息
var WEIBO_USER_INFO_URL = sails.config.weibo.infoUrl +
  sails.config.weibo.access_token +
  '&uid=';

// 微博粉服平台通过个性化域名获取微博用户基本信息
var WEIBO_USER_DOMAIN_URL = sails.config.weibo.domainUrl +
  sails.config.weibo.access_token +
  '&domain=';

module.exports = {
  list: function (req, res) {
    WeiboUser.count().exec(function (err, count) {
      if (err) {
        res.serverError('Database error: ' + err);
        return;
      }

      var drawCounter = parseInt(req.param('draw') || '0');
      if (isNaN(drawCounter)) {
        drawCounter = 0;
      }

      var pageStart = parseInt(req.param('start') || '0');
      if (isNaN(pageStart)) {
        pageStart = 1;
      }

      var pageLength = parseInt(req.params.all()['length'] || '25');
      if (isNaN(pageLength)) {
        pageLength = 25;
      }

      WeiboUser.find({
        skip: pageStart,
        sort: 'updatedAt DESC',
        limit: pageLength
      }).exec(function (err, found) {
        if (err) {
          res.json({
            draw: drawCounter,
            error: err
          });
          return;
        }

        res.json({
          draw: drawCounter,
          recordsTotal: count,
          recordsFiltered: count,
          data: found
        });
      });
    });
  },

  /*
   * 访问方式 http://iwangpo.com/weibouser/userInfo?weiboId=1430236477
   *
   * 输入微博ID，通过 https://api.weibo.com/2/eps/user/info.json
   * 获取微博用户资料.
   * @param weiboId
   * @return JSON格式的用户信息，格式如下：
   * {
   "follow": 1,
   "subscribe": 1,
   "id": 1430236477,
   "nickname": "袁徐磊",
   "sex": 1,
   "language": "zh-cn",
   "city": "朝阳",
   "province": "北京",
   "country": "中国",
   "headimgurl": "http://XXX",
   "headimgurl_large": "http://XXX",
   "headimgurl_hd": "http://XXX",
   "subscribe_time": 1428325761
   }
   */
  userInfo: function (req, res) {
    var weiboId = req.param('weiboId');
    if (!weiboId) {
      res.json(500, {
        error: 'Invalid weiboId'
      });
      return;
    }
    request({
      url: WEIBO_USER_INFO_URL + weiboId,
      json: true
    }, function (err, r, json) {
      if (err || json.error) {
        console.error("Failed to access Weibo user info: " + (err || json.error));
        res.json(500, {
          error: err || json.error
        })
        return;
      }
      res.json(json);
    });
  },

  userByUrl: function (req, res) {
    var domain = req.param('domain');
    if (!domain) {
      res.json(500, {
        error: 'Invalid weiboUrl'
      });
      return;
    }
    request({
      url: WEIBO_USER_DOMAIN_URL + domain,
      json: true
    }, function (err, r, json) {
      if (err || json.error) {
        console.error("Failed to access Weibo user info: " + (err || json.error));
        res.json(500, {
          error: err || json.error
        })
        return;
      }
      res.json(json);
    });
  }
};


