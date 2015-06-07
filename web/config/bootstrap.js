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
        "innerId": "0001",
        "userName": "李小敏",
        "userBirthday": "1978.03.15",
        "gender":  "男",
        "height": 175,
        "userLocation": "北京",
        "description": "这个人很懒，什么也没写",
        "lock": false,
        "avatar": "http://tp3.sinaimg.cn/3304467554/180/22869450874/0"
      },
      {
        "innerId": "0002",
        "userName": "黄鹏",
        "userBirthday": "1987.06.15",
        "gender":  "男",
        "height": 179,
        "userLocation": "广州",
        "description": "这个人很懒，什么也没写",
        "lock": false,
        "avatar": "http://tp3.sinaimg.cn/3304467554/180/22869450874/0"
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
