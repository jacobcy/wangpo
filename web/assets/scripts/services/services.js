'use strict';

angular.module('sbAdminApp')

  //获取用户资料列表
  .factory('userList', ['$resource', function ($resource) {
    return $resource('/weibouser/:id', {id: '@id'},{withCredentials : true})
  }])
  
  //获取单个用户资料
  .factory('userInfo', ['$resource', function ($resource) {
    return $resource('/weibouser/fetchOneById?id=:id', {id: '@id'},{withCredentials : true})
  }])  

  .factory('userPhoto', ['$resource', function ($resource) {
    return $resource('/main/saveImage/',{withCredentials : true})
  }])

  //通过微博用户ID或者用户主页URL查询用户资料
  .service('weiboUser', ['$q', '$resource', 'userList', 'utils',
    function ($q, $resource, userList, utils) {

      //根据微博用户ID，从微博后台获取用户资料
      //Todo:调试结束，替换为相对地址
      var searchId = $resource('/weibouser/userInfo/',{withCredentials : true});
      //根据微博用户个性化域名，从微博后台获取用户资料
      var searchUrl = $resource('/weibouser/userByUrl/',{withCredentials : true});
      var user = {};

      //根据微博数据结构，返回用户性别
      function getGender(data) {
        switch (data) {
          case "m":
            return 1;
            break;
          case"f":
            return 2;
            break;
          default:
            return 3;
        }
      }

      //根据weiboId，从用户后台获取已有用户的资料
      function getAdminUserInfo (id) {
        var deferred = $q.defer();

        //如果可以获得微博ID，查询数据库是否存在此用户
        if (angular.isDefined(id)) {
          userList.query({weiboId: id}, function (data) {
            // 如果存在2个或以上的微博ID，报错
            if (data.length > 1) {
              deferred.reject('存在' + data.length + '个重复的账号：' + id);
              // 如果微博ID已存在，返回该用户资料
            } else if (data.length === 1) {
              deferred.resolve(data);
              //如果微博ID不存在，返回空对象
            } else {
              deferred.resolve({});
            }
          }, function (error) {
            deferred.reject('数据库连接故障，请稍后再试！');
          });
        } else {
          deferred.reject('未获得用户的微博ID');
        }
        return deferred.promise;
      }

      //输入用户ID或者个性化域名，从微博后台返回用户基本资料
      function getWeiboUserInfo (data) {
        var deferred = $q.defer();
        var user = {};

        if (angular.isDefined(data)) {
          // Todo:通过个性化域名获得用户资料
          var regName = /weibo\.com\/(\w*?)[\/\?]?/i;
          var regId = /^.*?weibo\.com\/u\/(\d*?)[\/\?]?.*$'/i;

          //判断是否为个性化域名
          var resultUrl = data.match(/weibo\.com\/(\w{3,})/i);
          //如果是个性化域名，获得此域名
          if (resultUrl) {
            var weiboUrl = resultUrl[0];
            weiboUrl = weiboUrl.replace(/weibo\.com\//i, '');
            console.log('domain:' + weiboUrl);
            //取回微博用户资料
            searchUrl.get({domain: weiboUrl}, function (data) {
              console.log(data.toSource());
              user = {
                weiboId: data.id,
                nickname: data.screen_name,
                avatar: data.profile_image_url,
                gender: getGender(data.gender),
                location: utils.weiboCities(data.province, data.city)
              }
              deferred.resolve(user);
            }, function (error) {
              deferred.reject('无法获得该用户的微博ID')
            });

            //如果不是个性化域名，检查输入框中的数字
          } else {
            var resultId = data.match(/\d{3,}/);
            console.log('id:' + resultId);
            if (resultId) {
              var weiboId = resultId[0];
              //从微博后台取回用户资料
              searchId.get({weiboId: weiboId}, function (data) {
                console.log(data.toSource());
                user = {
                  weiboId: data.id,
                  nickname: data.screen_name,
                  avatar: data.profile_image_url,
                  gender: getGender(data.gender),
                  location: utils.weiboCities(data.province, data.city)
                }
                deferred.resolve(user);
              }, function (error) {
                deferred.reject(error.data.error);
              })
            } else {
              deferred.reject('无法识别，请输入微博用户的ID号或URL');
            }
          }
          //weiboId为空或者undefinded
        } else {
          deferred.reject('请输入微博ID或者用户URL');
        }
        return deferred.promise;
      }

      //从微博后台取回的数据，在用户后台检查是否已此用户
      //如果存在此用户，则修改此用户的资料
      //如过不存在此用户，则新建用户数据
      this.getInfo = function (data) {
        var deferred = $q.defer();
        getWeiboUserInfo(data).then(
          function (user) {
            getAdminUserInfo(user.weiboId).then(
              function (dt) {
                dt.weiboId = user.weiboId;
                dt.nickname = user.nickname;
                dt.avatar = user.avatar;
                dt.gender = dt.gender || user.gender;
                dt.location = dt.location || user.location;
                deferred.resolve(dt);
              }, function (error) {
                deferred.reject(error);
              })
          }, function (error) {
            deferred.reject(error);
          })
        return deferred.promise;
      }

    }]);

