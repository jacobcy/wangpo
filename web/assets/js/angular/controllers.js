'use strict';

/* Controllers */

var myAppControllers = angular.module('myApp.controllers', []);

//导航栏当前页高亮效果
myAppControllers
  .controller('NavCtrl', function ($scope, $location) {
    $scope.isActive = function (route){
      return route === $location.path();
    };
  });

//欢迎界面
myAppControllers
  .controller('MainCtrl', function ($scope) {
    $scope.test = '欢迎进入后台管理系统！';
  });

//微博收发界面
myAppControllers
  .controller('PostCtrl',['$scope',
    function ($scope) {
    }]);

//消息界面
myAppControllers
  .controller('MsgCtrl',['$scope', 'msgList',
    function ($scope, msgList) {
      msgList.success(function(data){
        $scope.msgs = data;

        //获得消息人列表
        var msgers= [];
        for( var i in data){
          var msgFrom = data[i].from;
          if( !inArray( msgers, msgFrom) ){
            msgers.push(msgFrom);
          };
        };
        $scope.msgers = msgers;
      });

      // 判断数组中是否包含字符串
      function inArray(arr, item) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] == item) {
            return true;
          };
        };
        return false;
      };
    }]);

//通过socket实现用户列表
myAppControllers
  .controller('UserCtrl',  ['$scope','$sails', '$location', 'userFactory',
    function($scope, $sails, $location, userFactory) {

      void function() {
        var lookup = {};

        //get userlist
        $sails.get("/weibouser")
          .success(function (data) {
            $scope.users = data.reverse();
            for (var i in $scope.users){
              lookup[$scope.users[i].id] = i;
            };
          })
          .error(function (res) {
            console.log('errors: '+res);});

        // callback for ng-click 'deleteUser':
        $scope.deleteUser = function (userId) {
          var idx = lookup[userId];
          $sails.delete('/weibouser',{id:userId})
            .success(function(){
              $scope.users.splice(idx,1);
              for (var i in $scope.users){
                lookup[$scope.users[i].id] = i;
              };
            })
            .error(function(res){
              console.log('errors: '+res);
            })
        };

        //watch userlist change
        $sails.on('weibouser', function ( message ) {
          console.log("pushing "+JSON.stringify(message));
          var idx = lookup[message.id];
          switch (message.verb){
            case 'created':
              $scope.users.unshift(message.data);
              for (var i in $scope.users){
                lookup[$scope.users[i].id] = i;
              };
              break;
            case 'destroyed':
              $scope.users.splice(idx,1);
              for (var i in $scope.users){
                lookup[$scope.users[i].id] = i;
              };
              break;
            case 'updated':
              $scope.users.splice([idx],1,message.data) ;
              break;
          };
        });

      }();



      // callback for ng-click 'createUser':
      $scope.createNewUser = function () {
        $location.path('/user-creation');
      };

      // callback for ng-click 'editUser':
      $scope.editUser = function (userId) {
        $location.path('/user-detail/' + userId);
      };


    }]);

//创建用户页
myAppControllers
  .controller('UserCreationCtrl', ['$scope', '$sails','userFactory', '$location',
    function ($scope, $sails, userFactory, $location) {

      // callback for ng-click 'createNewUser':
      $scope.createNewUser = function () {
        $sails.post("/weibouser/", $scope.user)
          .success( function(){
            $location.path('/user')
          })
          .error( function(res){
            console.log('create user errors: '+ res);
          })
      };

      // callback for ng-click 'cancel':
      $scope.cancel = function () {
        $location.path('/user');
      };

    }]);

//用户详情页
myAppControllers
  .controller('UserDetailCtrl', ['$scope', '$routeParams', 'userFactory', '$location',
    function ($scope, $routeParams, userFactory, $location) {

      // callback for ng-click 'updateUser':
      $scope.updateUser = function () {
        userFactory.user.update($scope.user);
        $location.path('/user');
      };

      // callback for ng-click 'cancel':
      $scope.cancel = function () {
        $location.path('/user');
      };

      $scope.user = userFactory.user.show({id: $routeParams.id});
    }]);
