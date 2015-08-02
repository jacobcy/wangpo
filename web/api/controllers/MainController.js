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
    sails.services.utils.saveQiniuImageFromUrl(url, function(json) {
      res.json(json);
    });
  }
};
