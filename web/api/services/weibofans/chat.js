var util = require('./util');

var Chat = function(weibo_id) {
  this.id = weibo_id;
  // @type WeiboUser
  this.weiboUser = null;
  this.state = 'start';
  this.createTimestamp = Date.now();
};

Chat.ERROR_MESSAGE = '王婆生病了，正在恢复中，暂时不能为您服务，请原谅。';

// 待保存的微博用户信息
Chat.pendingWeiboUsers = [];

var saving = false;
// 定时保存缓存中的WeiboUser数据
setInterval(function() {
  var now = Date.now();
  for (var id in ChatSessions) {
    // 每个chat设置1800秒的超时时间，超时自动结束
    if (now - ChatSessions[id].createTimestamp > 1800 * 1000) {
      delete ChatSessions[id];
      console.log('chat timeout with weiboId ' + id);
    }
  }

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
}, 5000);

Chat.prototype = {
  init: function(cb) {
    this.state = 'start';
    console.log('chat init with weiboId ' + this.id);
    WeiboUser.findOne({ weiboId: this.id }).populate('photos').exec(function(err, found) {
      if (err) {
        console.log(err);
        cb(Chat.ERROR_MESSAGE);
        return;
      }
      if (found) {
        this.weiboUser = found;
        this.handleMessage(null, null, cb);
        return;
      }
      WeiboUser.create({ weiboId: this.id }).exec(function(err, created) {
        if (err) {
          console.log(err);
          cb(Chat.ERROR_MESSAGE);
          return;
        }
        this.weiboUser = created;
        this.handleMessage(null, null, cb);
      }.bind(this));
    }.bind(this));
  },

  /**
   * @param {Function} cb function(replyMessage: String) 通过callback返回回复用户的消息内容。
   */
  handleMessage: function(text, image, cb) {
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
        if (!util.areaCodeToCity(text)) {
          cb('没有找到您输入的区号对应的城市，请重新输入');
          return;
        }
        user.location = text;
        this.save();
        break;
      case 'photos':
        if (user.photos.length === 0 && !image) {
          cb('请上传一张最近的照片');
          return;
        }
        if (image) {
          // 最多保存5张照片
          if (user.photos.length < 5) {
            CloudImage.addByUrl(image, user.id, function(err, record) {
              if (err) {
                cb('图片保存失败:' + err);
                return;
              }
            });
            user.photos.push(image);
            break;
          }
          if (user.photos.length >= 5) {
            cb('简单描述一下自己或者自己喜欢的人');
            return;
          }
        }
        if (text) {
          user.description = text;
          this.state = 'description';
        }
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
    WeiboUser.getMatchedUser(this.weiboUser, function(matched) {
      if (!matched) {
        cb('感谢您提供资料，王婆正在线下帮您牵线...');
        return;
      }
      cb({
        'display_name': matched.nickname,
        'summary': '生日：' + (util.toBirthdayString(matched.birthday)) +
                   '；身高：' + matched.height + '公分' +
                   '；所在地：' + util.areaCodeToCity(matched.location) +
                   (matched.description ? '；个人介绍：' + matched.description : ''),
        'image': matched.photo + '?facecrop/560x310',
        'url': matched.photo
      });
    });
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
    } else if (user.photos.length === 0) {
      this.state = 'photos';
      return '请上传一张最近的照片';
    }
    if (this.state == 'photos') {
      return '您可以继续上传照片，也可以简单描述一下自己或者自己喜欢的人';
    }
    if (this.state != 'start') {
      this.state = 'start';

      // 用户修改过资料，让用户确认最终资料
      return '您的资料如下。' +
             '性别: ' + (user.gender == 1 ? '男' : '女') +
             '；生日：' + (util.toBirthdayString(user.birthday)) +
             '；身高：' + user.height + '公分' +
             '；所在地：' + util.areaCodeToCity(user.location) +
             (user.description ? '；个人介绍：' + user.description : '') +
             '。如果您需要修改资料，请私信婆婆。回复date开始速配。';
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
    chat.handleMessage(null, null, cb);
  },

  /**
   * @param {Function} cb function(replyMessage: String) 通过callback返回回复用户的消息内容。
   */
  process: function(weibo_id, text, image, cb) {
    var chat = ChatSessions[weibo_id];
    if (!chat) {
      cb('');
      return;
    }
    chat.handleMessage(text, image, cb);
  }
};

module.exports = {
  ChatManager: ChatManager
};
