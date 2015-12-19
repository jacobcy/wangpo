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
