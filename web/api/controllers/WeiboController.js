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

    var WeiboFans = sails.services.weibo.WeiboFans;

    // 验证URL
    var signature = req.param('signature');
    var timestamp = req.param('timestamp');
    var nonce = req.param('nonce');
    if (!WeiboFans.verify(signature, timestamp, nonce)) {
      console.error('[Weibo] Failed to verify.');
      res.send('check signature error');
      return;
    }
    var echostr = req.param('echostr');
    if (echostr) {
      res.send(echostr);
      return;
    }

    // 接受消息
    var type = req.param('type');
    var receiver_id = req.param('receiver_id') || 0;
    var sender_id = req.param('sender_id') || 0;
    var dateString = req.param('created_at');
    var date = dateString ? new Date(dateString) : new Date();
    var created_at = date;
    var text = req.param('text') || '';
    var data = req.param('data') || {};
    WeiboFans.onReceiveMessage(type, sender_id, created_at, text, data, function(replyMessage) {
      // 发送被动响应消息（直接回复用户消息），接口详见
      // http://open.weibo.com/wiki/发送被动响应消息
      var msg = {
        result: true,
        receiver_id: sender_id.toString(),
        sender_id: receiver_id.toString(),
        type: 'text',
        data: encodeURI(JSON.stringify({ text: replyMessage }))
      };
      return res.send(JSON.stringify(msg));
    });
  }
};
