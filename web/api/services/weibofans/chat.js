var util = require('./util');

var Chat = function(weibo_id) {
  this.id = weibo_id;
  this.weiboUser = null;
  this.state = 'start';
};

Chat.ERROR_MESSAGE = '王婆生病了，正在恢复中，暂时不能为您服务，请原谅。';

Chat.prototype = {
  init: function(cb) {
    this.state = 'start';
    WeiboUser.findOne({ innerId: this.id }).exec(function(err, found) {
      if (err) {
        cb(Chat.ERROR_MESSAGE);
        return;
      }
      if (found) {
        this.weiboUser = found;
        cb(this.handleMessage(null));
        return;
      }
      WeiboUser.create({ innerId: this.id }).exec(function(err, created) {
        if (err) {
          cb(Chat.ERROR_MESSAGE);
          return;
        }
        this.weiboUser = created;
        cb(this.handleMessage(null));
      }.bind(this));
    }.bind(this));
  },

  handleMessage: function(text) {
    var user = this.weiboUser;
    switch (this.state) {
      case 'gender':
        if (text !== '1' && text !== '2') {
          return '您输入的性别格式有误，请重新输入，男生回复1，女生回复2';
        }
        user.userSexual = text === '1' ? '男' : '女';
        break;
      case 'birthday':
        var date = util.parseShortDate(text);
        if (!date) {
          return '您输入的生日格式有误，请重新输入';
        }
        user.userBirthday = date;
        break;
      case 'height':
        var height = parseInt(text);
        if (isNaN(height) || height < 100 || height > 200) {
          return '您您输入的身高数据有误，请重新输入';
        }
        user.userHight = height;
        break;
      case 'location':
        // 位置信息用区号表示，格式为3位或4位数字
        if (!/^[0-9]{3,4}$/.test(text)) {
          return '您输入的区号有误，请重新输入';
        }
        var city = util.areaCodeToCity(text);
        if (!city) {
          return '没有找到您输入的区号对应的城市，请重新输入';
        }
        user.userLocation = text;
        break;
    }
    var msg = this.checkUser(user);
    if (msg) {
      return msg;
    }
    // 所有信息都全的时候开始速配
    return this.handleMatch();
  },

  handleMatch:function() {
    return '感谢您提供资料，王婆正在线下帮您牵线...';
  },

  checkUser: function(user) {
    if (!user.userSexual) {
      this.state = 'gender';
      return '男生回复1，女生回复2';
    } else if (!user.userBirthday) {
      this.state = 'birthday';
      return '请回复您的生日，格式为yymmdd，例如860214';
    } else if (!user.userHight) {
      this.state = 'height';
      return '请回复您的身高，如果您的身高为176公分，回复176';
    } else if (!user.userLocation) {
      this.state = 'location';
      return '请回复您目前所在地的区号，例如：您在北京，回复010';
    }
    this.state = 'checked';
    return null;
  }
};

var ChatSessions = {
};

var ChatManager = {
  /**
   * 创建一个新的对话session.
   */
  create: function(weibo_id, cb) {
    var chat = ChatSessions[weibo_id];
    if (!chat) {
      chat = new Chat(weibo_id);
      ChatSessions[weibo_id] = chat;
    }
    chat.init(cb);
  },

  /**
   * @return {Boolean}
   */
  process: function(weibo_id, text) {
    var chat = ChatSessions[weibo_id];
    if (!chat) {
      return false;
    }
    return chat.handleMessage(text);
  }
};

module.exports = {
  ChatManager: ChatManager
};
