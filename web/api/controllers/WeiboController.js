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

    // 验证URL
    if (!verify(req, res)) {
      console.error('[Weibo] Failed to verify.');
      return res.send('check signature error');
    }
    var echostr = req.param('echostr');
    if (echostr) {
      return res.send(echostr);
    }

    // 接受消息
    var type = req.param('type');
    var receiver_id = req.param('receiver_id') || 0;
    var sender_id = req.param('sender_id') || 0;
    var created_at = req.param('created_at');
    var text = req.param('text') || '';
    var data = req.param('data');
    return onReceiveMessage(type, receiver_id, sender_id, created_at, text, data, res);
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

var helpMessage = '您好，您现在使用的是王婆速配交友服务，帮您找到喜欢的人，您可以向对方表示好感，如果对方也向您表示好感，你们将成为好友，获得对方的联系方式。您可以回复date进行速配，回复help进入帮助和设置，回复party了解最新活动您还可以回复me查看个人资料，回复list查看好友，回复“#+内容”给婆婆留言，回复close关闭我的资料，不再进行速配。';

var partyMessage = '抱歉暂时没有活动！';

// 处理收到的微博消息
function onReceiveMessage(type, receiver_id, sender_id, created_at, text, data, res) {
  switch(type) {
    case 'text':
      console.info('Weibo message received: ' + text);
      if (text.indexOf('party') != -1) {
        return replay(sender_id, receiver_id, partyMessage, res);
      }
      return replay(sender_id, receiver_id, helpMessage, res);
    default:
      console.warn('Known message type ' + type);
      break;
  }
  return res.json({
    todo: 'callback() is not implemented yet!'
  });
}

function replay(receiver_id, sender_id, text, res) {
  var msg = {
    result: true,
    receiver_id: receiver_id.toString(),
    sender_id: sender_id.toString(),
    type: 'text',
    data: encodeURI(JSON.stringify({ text: text }))
  };
  return res.send(JSON.stringify(msg));
}
