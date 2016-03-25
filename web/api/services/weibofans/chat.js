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
        //去掉了数字以外的字符
        var height = parseInt(text.replace(/[^0-9]/ig,""));
        if (isNaN(height)) {
          cb('您输入的身高数据有误，请重新输入');
          return;
        } else if (height > 226) {
          cb('你比姚明还高！幸会幸会，请输入真实身高');
          return;
        } else if (height > 3 && height < 100) {
          cb('你得努力长高后再来，婆婆得对其他人负责呀！请输入你努力后的身高');
          return;
        } else if (height <= 3) {
          cb('您输入的身高数据有误，请重新输入');
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
          cb('您需要发送一张图片，保存到您的个人相册');
          return;
        }
        if (user.photos.length >= 1 && !image){
          if (text === '0') {
            if (user.description) {
              this.state = 'verify';
            }
            break;
          }
          cb('您需要发送一张图片，保存到您的个人相册');
          return;
        }
        if (image) {
          // 最多保存5张照片
          CloudImage.addByUrl(image, user.id, function(err, record) {
            if (err) {
              cb('图片保存失败:' + err);
              return;
            }
          });
          user.photos.push(image);
          if (user.photos.length === 1) {
            cb('您最多可上传五张照片，回复0结束上传');
            return;
          } else if (user.photos.length <= 4) {
            //必须要回复空串，否则服务器会重新尝试发送消息
            cb(' ');
          }
          if (user.photos.length === 5) {
            if (user.description) {
              this.state = 'verify';
            }
            break;
          }
          return;
        }
      case 'description':
        if (text === null) {
          cb ('请用文字描述一下自己或者自己喜欢的人');
          return;
        } else {
          if (text.length < 10) {
            cb ('您的描述过于简单，请您再想想');
            return;
          } else {
            user.description = text;
          }
        }
        this.save();
        this.state = 'verify';
        break;
      case 'confirm':
        if (!text) {
          cb ('请输入正确的序号');
          return;
        }
        if (text) {
          if (text === '1') {
            this.state = 'start';
            break;
          }
          //用户可以重新上传照片
          if (text === '2') {
            //Trying to empty user.photos
            CloudImage.deleteImage (user.id);
            user.photos.length = 0;
            break;
          }
          //用户可以重新输入个人介绍
          if (text === '3') {
            user.description = null;
            break;
          }
          //用户重新进行个人资料录入流程
          if (text === '4') {
            user.gender = null;
            user.birthday = null;
            user.height = null;
            user.location = null;
            user.description = null;
            //Trying to empty user.photos
            CloudImage.deleteImage (user.id);
            user.photos.length = 0;
            break;
          }
          else {
            cb('请输入正确的序号');
            return;
          }
        }
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
        cb('感谢你的耐心，资料已被确认，王婆正在线下帮你牵线...');
        return;
      }
      cb({
        'display_name': matched.nickname,
        'summary': '生日：' + (util.toBirthdayString(matched.birthday)) +
                   '；身高：' + matched.height + '公分' +
                   '；所在地：' + util.areaCodeToCity(matched.location) +
                   (matched.description ? '；个人介绍：' + matched.description : ''),
        //Ques:需要弄清楚下面的photo是不是不带s
        'image': matched.photo + '?facecrop/560x310',
        'url': matched.photo
      });
    });
  },

  checkUser: function(user) {
    console.log("Line 242 : this.state = " + this.state);
    // 用户修改过资料，让用户确认最终资料
    if (this.state == 'verify') {
      console.log("Hi, I'm verified!");
      this.state = 'confirm';
      return ('您的资料如下。' +
            '性别: ' + (user.gender == 1 ? '男' : '女') +
            ';' + '生日：' + (util.toBirthdayString(user.birthday)) +
            '；身高：' + user.height + '公分' +
            '；所在地：' + util.areaCodeToCity(user.location) +
            (user.description ? '；个人介绍：' + user.description : '') +
            '回复1，确认个人资料；' + 
            '回复2，重新上传个人照片；' +
            '回复3，修改个人介绍；' +
            '回复4，重新输入全部个人资料。');
    }
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
      return '请上传一张最近的照片，您上传的第一张照片将作为您的默认头像';
    } else if (!user.description) {
      this.state = 'description';
      return '请简单描述一下自己或者自己喜欢的人，让朋友们了解你';
    } else if (this.state != 'start') {
      this.state = 'start';
    } else {
      return null;
    }
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
