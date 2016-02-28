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

const WEIBO_USER_PROPERTIES = ['weiboId', 'gender', 'lock', 'hide', 'nickname', 'avatar', 'createdAt', 'updatedAt', 'id', 'birthday', 'height', 'location'];

module.exports = {
  list: function (req, res) {
    WeiboUser.count().exec(function (err, count) {
      if (err) {
        res.serverError('Database error: ' + err);
        return;
      }

      //TODO：传统模式下服务器端分页采用sEcho、iDisplayStart、iDisplayLength参数，目前未增加过滤功能

      var drawCounter = parseInt(req.param('sEcho') || '0');
      //var drawCounter = parseInt(req.param('draw') || '0');
      if (isNaN(drawCounter)) {
        drawCounter = 0;
      }

      var pageStart = parseInt(req.param('iDisplayStart') || '0');
      //var pageStart = parseInt(req.param('start') || '0');
      if (isNaN(pageStart)) {
        pageStart = 1;
      }

      var pageLength = parseInt(req.params.all()['iDisplayLength'] || '10');
      //var pageLength = parseInt(req.params.all()['Length'] || '10');
      if (isNaN(pageLength)) {
        pageLength = 10;
      }

      WeiboUser.find({
        skip: pageStart,
        sort: 'updatedAt DESC',
        limit: pageLength
      }).populate('photos').exec(function (err, found) {
        if (err) {
          res.json({
            draw: drawCounter,
            error: err
          });
          return;
        }

        var list = [];
        for (var index = 0; index < found.length; index++) {
          var user = found[index];
          var item = {};
          WEIBO_USER_PROPERTIES.forEach(function(p) {
            item[p] = user[p];
          });
          item.photos = [];
          var photos = user.photos;
          for (var i = 0; i < photos.length; i++) {
            item.photos.push({
              id: photos[i].id,
              image: photos[i].getDisplayableUrl()
            });
            // item.photos.push(photos[i].getDisplayableUrl());
          }
          list.push(item);
        }
        res.json({
          draw: drawCounter,
          recordsTotal: count,
          recordsFiltered: count,
          data: list
        });
      });
    });
  },

  /*
   * 通过weiboUserId获取一条WeiboUser数据
   *
   * @param id weboUserId
   */
  fetchOneById: function(req, res) {
    var id = req.param('id');
    if (!id) {
      res.json(500, {
        error: 'Invalid weiboUserId'
      });

      return;
    }
    WeiboUser.findOne({
      id: id
    }).populate('photos').exec(function (err, found) {
      if (err) {
        res.json(500, {
          error: err
        });
        return;
      }

      var result = {};
      WEIBO_USER_PROPERTIES.forEach(function(p) {
        result[p] = found[p];
      });
      result.photos = [];
      var photos = found.photos;
      for (var i = 0; i < photos.length; i++) {
        result.photos.push({
          id: photos[i].id,
          image: photos[i].getDisplayableUrl()
        });
      }
      res.json(result);
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


