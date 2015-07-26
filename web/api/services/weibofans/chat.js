var util = require('./util');

var Chat = function(weibo_id) {
  this.id = weibo_id;
  // @type WeiboUser
  this.weiboUser = null;
  this.state = 'start';
};

Chat.ERROR_MESSAGE = '王婆生病了，正在恢复中，暂时不能为您服务，请原谅。';

// 待保存的微博用户信息
Chat.pendingWeiboUsers = [];

var saving = false;
// 定时保存缓存中的WeiboUser数据
setInterval(function() {
  if (saving) {
    return;
  }
  var n = Chat.pendingWeiboUsers.length;
  if (Chat.pendingWeiboUsers.length === 0) {
    return;
  }
  saving = true;
  var user = Chat.pendingWeiboUsers.shift();
  user.save(function(err, saved){
    if (err) {
      console.error('Failed to save WeiboUser: ' + err);
      return;
    }
    ChatSessions[saved.weiboId].weiboUser = saved;
    saving = false;
  });
}, 1000);

Chat.prototype = {
  init: function(cb) {
    this.state = 'start';
    console.log('init');
    WeiboUser.findOne({ weiboId: this.id }).exec(function(err, found) {
      if (err) {
        console.log(err);
        cb(Chat.ERROR_MESSAGE);
        return;
      }
      if (found) {
        this.weiboUser = found;
        this.handleMessage(null, cb);
        return;
      }
      WeiboUser.create({ weiboId: this.id }).exec(function(err, created) {
        if (err) {
          console.log(err);
          cb(Chat.ERROR_MESSAGE);
          return;
        }
        this.weiboUser = created;
        this.handleMessage(null, cb);
      }.bind(this));
    }.bind(this));
  },

  /**
   * @param {Function} cb function(replyMessage: String) 通过callback返回回复用户的消息内容。
   */
  handleMessage: function(text, cb) {
    var user = this.weiboUser;
    switch (this.state) {
      case 'gender':
        if (text !== '1' && text !== '2') {
          cb('您输入的性别格式有误，请重新输入，男生回复1，女生回复2');
          return;
        }
        user.gender = parseInt(text);
        this.save();
        break;
      case 'birthday':
        var date = util.parseShortDate(text);
        if (!date) {
          cb('您输入的生日格式有误，请重新输入');
          return;
        }
        user.birthday = date;
        this.save();
        break;
      case 'height':
        var height = parseInt(text);
        if (isNaN(height) || height < 100 || height > 200) {
          cb('您您输入的身高数据有误，请重新输入');
          return;
        }
        user.height = height;
        this.save();
        break;
      case 'location':
        // 位置信息用区号表示，格式为3位或4位数字
        if (!/^[0-9]{3,4}$/.test(text)) {
          cb('您输入的区号有误，请重新输入');
          return;
        }
        var city = util.areaCodeToCity(text);
        if (!city) {
          cb('没有找到您输入的区号对应的城市，请重新输入');
          return;
        }
        user.location = city;
        this.save();
        break;
    }
    var msg = this.checkUser(user);
    if (msg) {
      cb(msg);
      return;
    }
    // 所有信息都全的时候开始速配
    this.handleMatch(cb);
  },

  /**
   * @param {Function} cb function(replyMessage: String) 通过callback返回回复用户的消息内容。
   */
  handleMatch:function(cb) {
    cb('感谢您提供资料，王婆正在线下帮您牵线...');
  },

  checkUser: function(user) {
    if (!user.gender) {
      this.state = 'gender';
      return '男生回复1，女生回复2';
    } else if (!user.birthday) {
      this.state = 'birthday';
      return '请回复您的生日，格式为yymmdd，例如860214';
    } else if (!user.height) {
      this.state = 'height';
      return '请回复您的身高，如果您的身高为176公分，回复176';
    } else if (!user.location) {
      this.state = 'location';
      return '请回复您目前所在地的区号，例如：您在北京，回复010';
    }
    this.state = 'checked';
    return null;
  },

  save: function() {
    if (Chat.pendingWeiboUsers.indexOf(this.weiboUser) === -1) {
      Chat.pendingWeiboUsers.push(this.weiboUser);
    }
  }
};

var ChatSessions = {
};

var ChatManager = {
  /**
   * 创建一个新的对话session.
   * @param {Function} cb function(replyMessage: String) 通过callback返回回复用户的消息内容。
   */
  create: function(weibo_id, cb) {
    var chat = ChatSessions[weibo_id];
    if (!chat) {
      chat = new Chat(weibo_id);
      ChatSessions[weibo_id] = chat;
      chat.init(cb);
      return;
    }
    chat.handleMessage(null, cb);
  },

  /**
   * @param {Function} cb function(replyMessage: String) 通过callback返回回复用户的消息内容。
   */
  process: function(weibo_id, text, cb) {
    var chat = ChatSessions[weibo_id];
    if (!chat) {
      cb('');
      return;
    }
    chat.handleMessage(text, cb);
  }
};

module.exports = {
  ChatManager: ChatManager
};
