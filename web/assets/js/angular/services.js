'use strict';

/* Services */

var myAppServices = angular.module('myApp.services', []);

myAppServices
  .service('myServer', ['$sails', '$resource',
    function ($sails, $resource) {

      //调用WebSocket
      this.userList = $sails.get('/weibouser');

      this.userDelete = function (id) {
        $sails.delete('/weibouser/' + id
        )
      };

      //调用AJAX
      this.userListAjax = $resource('http://localhost:1337/weibouser/');

      this.userAjax = $resource('http://localhost:1337/weibouser/:id', {id: '@id'});
    }]);

myAppServices
  .service('userFactory', ['$sails', 'myServer', function ($sails, myServer) {

    //webSocket方法

    //获得用户列表
    this.query = function (callback) {

      myServer.userList.success(function (data) {
        callback(data);
      });
    };

    //删除用户资料 未验证
    this.delete = function (id) {
      myServer.userDelete(id);
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
      .success( function(data){
        return data;
      })
      .error ( function(data){
      return data;
    });
  }]);
