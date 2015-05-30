'use strict';

/* Services */

var myAppServices = angular.module('myApp.services', []);

myAppServices
  .factory('myServer', ['$sails', '$resource',
    function ($sails, $resource) {

      var userUrl = '/weibouser/';

      // WebSocket方法取后端数据
      return {
        userList: $sails.get(userUrl),
        userCreat: function (id, data) {
          $sails.post(userUrl, data);
        },
        userGet: function (id) {
          $sails.get(userUrl + id);
        },
        userDelete: function (id) {
          $sails.delete(userUrl + id);
        },
        userUpdate: function (id, data) {
          $sails.put(userUrl + id, data);
        }
      };

      /* AJAX方法取后端数据
       return {
       userListAjax : $resource(userUrl),
       userAjax : $resource(userUrl + ':id', {id: '@id'})
       };
       */
    }]);

myAppServices
  .factory('userFactory', ['$sails', 'myServer',
    function ($sails, myServer) {

      //webSocket方法
      return {
        //获得用户列表
        query: function (callback) {
          myServer.userList
            .success(function (res) {
              callback(res);
            })
            .error(function (res) {
              console.log(res)
            })
        },

        //获得用户资料
        get: function (id, callback) {
          myServer.userGet(id)
            .success(function (res) {
              callback(res)
            })
            .error(function (res) {
              console.log(res)
            })
        },

        //删除用户资料
        delete: function (id) {
          myServer.userDelete(id);
        },

        //更新用户资料
        update: function (id, req) {
          myServer.userUpdate(id, req);
        },

        //创建用户
        create: function (id, req) {
          myServer.userCreat(id, req);
        }
      };

      /*AJAX方法

       //获得用户列表
       this.userList = function(callback){
       myServer.userListAjax.get(function(data) {
       callback(data)
       });
       };

       //创建用户 未验证
       this.userCreate = function(data){
       myServer.userListAjax.$save(data);
       };

       //获得用户资料
       this.userDetail = function(userId){
       myServer.userAjax.get({id:userId}).then(
       function(data){
       callback(data)
       })
       };
       */

    }]);


myAppServices
  .service('msgList', ['$http', function ($http) {
    return $http.get('http://www.meiroom.com/msg/')
      .success(function (data) {
        return data;
      })
      .error(function (data) {
        return data;
      });
  }]);
