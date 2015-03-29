var SHA1 = require('crypto-js').SHA1;
/**
 * WeiboController
 *
 * @description :: Server-side logic for managing Weiboes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `WeiboController.callback()`
   */
  callback: function (req, res) {
    console.log('Weibo callback: ' + req.url);
    if (!verify(req, res)) {
      console.error('[Weibo] Failed to verify.');
      return res.send('check signature error');
    }
    var echostr = req.param('echostr');
    if (echostr) {
      return res.send(echostr);
    }
    return res.json({
      todo: 'callback() is not implemented yet!'
    });
  }
};

// 验证消息真实性
function verify(req, res) {
  // 验证算法如下(http://open.weibo.com/wiki/新手接入指南)：
  // 将开发者的appsecret，timestamp参数，nonce参数进行字典排序后，
  // 将三个参数字符串拼接成一个字符串进行sha1加密 校验参数：
  // appsercret=xyz123xyz timestamp=1397022061823  nonce=57155157
  // 加密结果：
  // 拼接后的字符串为：139702206182357155157xyz123xyz
  // sha1签名后的结果为：90e4c22c90a58f26526c2dd5b6c56c8822edeaa1
  // 验证url有效性请求的样例为：
  // http://yoururl?nonce=57155157&
  //                timestamp=1397022061823&
  //                echostr=dnPdpTZz85&
  //                signature=90e4c22c90a58f26526c2dd5b6c56c8822edeaa1
  // 此时如果返回的是echostr的值（此样例中为dnPdpTZz85）则通过url验证。

  var signature = req.param('signature');
  var timestamp = req.param('timestamp');
  var nonce = req.param('nonce');
  var appsecret = sails.config.weibo.appsecret;
  var str = [appsecret, timestamp, nonce].sort().join('');
  var hash = SHA1(str).toString();
  return hash === signature;
}
