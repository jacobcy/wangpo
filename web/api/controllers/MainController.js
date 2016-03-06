var validator = require('validator');

/**
 * MainControllerController
 *
 * @description :: Server-side logic for managing Maincontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
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
   * Get bearer access token.
   *
   * Looks up a user using the supplied identifier (email or username) and then
   * attempts to find a local Passport associated with the user. If a Passport is
   * found, its password is checked against the password.
   *
   * @param {string}   identifier
   * @param {string}   password
   */
  accessToken: function (req, res) {
    var identifier = req.param('identifier');
    if (!identifier) {
      res.json({ error: 'Identifier is required.' });
      return;
    }

    var password = req.param('password');
    if (!password) {
      res.json({ error: 'Password is required.' });
      return;
    }

    var isEmail = validator.isEmail(identifier)
      , query   = {};

    if (isEmail) {
      query.email = identifier;
    }
    else {
      query.username = identifier;
    }

    User.findOne(query, function (err, user) {
      if (err) {
        res.json({ error: err });
        return;
      }

      if (!user) {
        if (isEmail) {
          res.json({ error: 'Error.Passport.Email.NotFound' });
        } else {
          res.json({ error: 'Error.Passport.Username.NotFound' });
        }

        return;
      }

      Passport.findOne({
        protocol : 'local'
      , user     : user.id
      }, function (err, passport) {
        if (!passport) {
          res.json({ error: 'Error.Passport.Password.NotSet' });
          return;
        }
        passport.validatePassword(password, function (err, result) {
          if (err) {
            res.json({ error: err });
            return;
          }

          if (!result) {
            res.json({ error: 'Error.Passport.Password.Wrong' });
            return;
          }

          res.json({ token: passport.accessToken });
        });
      });
    });
   },

  /**
   * 转存网络图片到七牛服务器接口
   * /main/saveImage?url=[URL]
   * @param url 待存储图片的地址
   * @return 成功返回 {id: CloudImage ID}, 失败返回 {error: 错误信息}
   */
  saveImage: function(req, res) {
    var url = req.param('url') || '';
    if (!url) {
      return res.json({
        error: 'URL不能为空'
      });
    }
    CloudImage.addByUrl(url, function (err, record) {
      if (err) {
        res.json({ error: err });
        return;
      }
      res.json({ id: record.id });
    });
  },

  /**
   * 通过id获取可显示的CloudImage URL.
   * /main/cloudImage?id=[id]
   * @param id CloudImage id
   * @return 成功返回 {url: CloudImage URL}, 失败返回 {error: 错误信息}
   */
  cloudImage: function(req, res) {
    var id = req.param('id');
    CloudImage.findOne({ id: id }).exec(function(err, found) {
      if (err) {
        res.json({ error: err });
        return;
      }
      res.json({ url: found.getDisplayableUrl() });
    });
  }
};
