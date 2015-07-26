/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  function createDummyWeiboUserData() {
    var dummyWeiboUserData = [
      {
        "weiboId": "0001",
        "nickname": "李小敏",
        "birthday": "1978-03-15",
        "gender":  1,
        "height": 175,
        "location": "010",
        "description": "这个人很懒，什么也没写",
        "photos": ["http://tp3.sinaimg.cn/3304467554/180/22869450874/0"]
      },
      {
        "weiboId": "0002",
        "nickname": "黄鹏",
        "birthday": "1987-06-15",
        "gender":  1,
        "height": 179,
        "location": "021",
        "description": "这个人很懒，什么也没写",
        "photos": ["http://tp3.sinaimg.cn/3304467554/180/22869450874/0"]
      }
    ];
    WeiboUser.count().exec(function(err, count) {
      if (err) return;
      if (count > 0) return;
      WeiboUser.create(dummyWeiboUserData).exec(function(err, created){
        if (err) {
          console.error('create failed:' + err);
          return;
        }
      });
    });
  }
  createDummyWeiboUserData();
  sails.services.passport.loadStrategies();
  cb();
};
