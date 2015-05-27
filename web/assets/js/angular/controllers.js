'use strict';

/* Controllers */

var myAppControllers = angular.module('myApp.controllers', []);

myAppControllers
  .controller('NavCtrl', function ($scope, $location) {
    $scope.isActive = function (route){
      return route === $location.path();
    };
  });

myAppControllers
  .controller('MainCtrl', function ($scope) {
    $scope.test = '欢迎进入后台管理系统！';
  });

myAppControllers
  .controller('UserCtrl1', ['$scope', 'userList', 'userFactory', '$location',
    function($scope, userList, userFactory, $location){

      // callback for ng-click 'editUser':
      $scope.editUser = function (userId) {
        $location.path('/user-detail/' + userId);
      };

      // callback for ng-click 'deleteUser':
      $scope.deleteUser = function (userId) {
        userFactory.delete({ id: userId });
      };

      // callback for ng-click 'createUser':
      $scope.createNewUser = function () {
        $location.path('/user-creation');
      };

      $scope.users = userList.query();

    }]);

myAppControllers
  .controller('UserCreationCtrl', ['$scope', 'userList', '$location',
    function ($scope, userList, $location) {

      // callback for ng-click 'createNewUser':
      $scope.createNewUser = function () {
        userList.create($scope.user);
        $location.path('/user');
      };

      // callback for ng-click 'cancel':
      $scope.cancel = function () {
        $location.path('/user');
      };

    }]);

myAppControllers
  .controller('UserDetailCtrl', ['$scope', '$routeParams', 'userFactory', '$location',
    function ($scope, $routeParams, userFactory, $location) {

      // callback for ng-click 'updateUser':
      $scope.updateUser = function () {
        userFactory.update($scope.user);
        $location.path('/user');
      };

      // callback for ng-click 'cancel':
      $scope.cancel = function () {
        $location.path('/user');
      };

      $scope.user = userFactory.show({id: $routeParams.id});
    }]);

myAppControllers
  .controller('MsgCtrl',['$scope', 'msgList',
    function ($scope, msgList) {
      msgList.success(function(data){
        $scope.msgs = data;
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

myAppControllers
  .controller('PostCtrl',['$scope',
    function ($scope) {
    }]);


myAppControllers
  .controller('UserCtrl',  ['$scope','$sails',
    function($scope, $sails) {
      console.log('use sails');
      $scope.users = [];
      $scope.lookup ={};

      (function() {
        $sails.get("/weibouser")
          .success(function (response) {
            $scope.users = response;
            $scope.lookup = {};
            for (var i in $scope.users) {
              $scope.lookup[$scope.users[i].id] = i;
              console.log(  $scope.lookup[$scope.users[i].id] );
            };
        })
          .error(function (response) {
            console.log('error');});

        $sails.on('users', function ( message ) {
          console.log('sails published a message for item: '+message.verb);
          switch (message.verb)
          {
            case 'created':
              console.log("pushing "+JSON.stringify(message.data));
              $scope.users.push(message.data);
              $scope.lookup = {};
              for (var i in $scope.users)
              {
                $scope.lookup[$scope.users[i].id] = i;
              }
              break;
            case 'destroyed':
              $scope.users = $scope.users.filter(function(item) {
                return item.id != message.id;
              });
              $scope.lookup = {};
              for (var i in $scope.users)
              {
                $scope.lookup[$scope.users[i].id] = i;
              }
              break;
            case 'addedTo':
              var idx = $scope.lookup[message.id];
              $sails.get("/task/"+message.addedId).success(function (aTask) {
                $scope.users[idx].tasks.push(aTask);
              }).error(function (aTask) { console.log('error');});
              break;
            case 'removedFrom':
              var idx = $scope.lookup[message.id];
              $scope.users[idx].tasks = $scope.users[idx].tasks.filter(function(task) {
                return task.id != message.removedId;
              });
              break;
          }
        });

      })();
      ///////////

    }]);
