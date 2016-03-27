var SHA1 = require('crypto-js').SHA1;
var ChatManager = require('./chat.js').ChatManager;

var WeiboFans = {
  /**
   * 验证消息真实性
   * @param {String} signature
   * @param {String} timestamp
   * @param {String} nonce
   * @returns {Boolean}
   */
  verify: function(signature, timestamp, nonce) {
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

    var appsecret = sails.config.weibo.appsecret;
    var str = [appsecret, timestamp, nonce].sort().join('');
    var hash = SHA1(str).toString();
    return hash === signature;
  },

  /**
   * 接受原始消息（包括 普通消息 和 事件推送), 处理后异步返回需要回复的消息
   * @param {String} type
   * @param {number} sender_id
   * @param {Date} created_at
   * @param {String} text
   * @param {Object} data
   * @param {Function} cb function(replyMessage: String)
   */
  onReceiveMessage: function(type, sender_id, created_at, text, data, cb) {
    switch(type) {
      case 'text':
        handleTextMessage(sender_id, text, cb);
        break;
      case 'image':
        handleImageMessage(sender_id, data.tovfid, cb);
        break;
      case 'event':
        handleEventMessage(sender_id, text, cb);
        break;
      default:
        console.warn('Unknown message type ' + type);
        cb('');
        break;
    }
  },
};

module.exports = WeiboFans;

var ReplyMessages = {
  help: '您好，您现在使用的是王婆速配交友服务，帮您找到喜欢的人，您可以向对方表示好感，如果对方也向您表示好感，你们将成为好友，获得对方的联系方式。您可以回复date进行速配，回复help进入帮助和设置，回复party了解最新活动您还可以回复me查看个人资料，回复list查看好友，回复“#+内容”给婆婆留言，回复close关闭我的资料，不再进行速配。',
  party: '抱歉暂时没有活动！',
  follow: '感谢关注，回复date开始速配，回复party了解最新活动，回复help查看帮助信息'
};

/**
 * 处理文本格式的私信
 * @param {Function} cb function(replyMessage: String) 处理结束后通过callback返回
 * 回复用户的消息内容。
 */
function handleTextMessage(sender_id, text, cb) {
  text = text.trim();
  switch (text.toLowerCase()) {
    case 'party':
      cb(ReplyMessages.party);
      return;
    case 'help':
      cb(ReplyMessages.help);
      return;
    case 'date':
      ChatManager.create(sender_id, cb);
      return;
    case 'me':
      break;
  }
  ChatManager.process(sender_id, text, null, function(msg) {
    if (!msg) {
      // 默认情况显示帮助信息
      msg = ReplyMessages.help;
    }
    cb(msg);
  });
}

/**
 * 处理图片格式的私信
 * @param {Function} cb function(replyMessage: String) 处理结束后通过callback返回
 * 回复用户的消息内容。
 */
function handleImageMessage(sender_id, tovfid, cb) {
  var imageUrl = 'https://upload.api.weibo.com/2/mss/msget?access_token=' + sails.config.weibo.access_token +
                '&fid=' + tovfid;
  ChatManager.process(sender_id, null, imageUrl, function(msg) {
    if (!msg) {
      // 默认情况显示帮助信息
      msg = ReplyMessages.help;
    }
    cb(msg);
  });
}

/**
 * 处理微博事件(关注/取消关注)
 * @param {String} type 事件类型, "关注事件消息" 或 "取消关注事件消息"
 * @param {Function} cb function(replyMessage: String) 处理结束后通过callback返回
 * 回复用户的消息内容。
 */
function handleEventMessage(sender_id, type, cb) {
  switch (type) {
    case '关注事件消息':
      cb(ReplyMessages.follow);
      break;
    case '取消关注事件消息':
      cb('');
      break;
    default:
      console.warn('Unknown event: ' + type);
      cb('');
      break;
  }
}
