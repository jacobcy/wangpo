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
          "userSexual":  "男",
          "userHight": "1.75",
          "userLocation": "北京"
        },
        {
          "innerId": "0002",
          "userName": "黄鹏",
          "userBirthday": "1987.06.15",
          "userSexual":  "男",
          "userHight": "1.79",
          "userLocation": "广州"
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
