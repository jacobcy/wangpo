'use strict';

/* Controllers */

var myAppControllers = angular.module('myApp.controllers', []);

//TODO：需要改写为directive
//导航栏当前页高亮效果
myAppControllers
  .controller('NavCtrl', function ($scope, $location) {
    $scope.isActive = function (route) {
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
  .controller('PostCtrl', ['$scope',
    function ($scope) {
    }]);

//消息界面
myAppControllers
  .controller('MsgCtrl', ['$scope', 'msgList',
    function ($scope, msgList) {
      msgList.success(function (data) {
        $scope.msgs = data;

        //获得消息人列表
        var msgers = [];
        for (var i in data) {
          var msgFrom = data[i].from;
          if (!inArray(msgers, msgFrom)) {
            msgers.push(msgFrom);
          }
        }
        $scope.msgers = msgers;
      });

      // 判断数组中是否包含字符串
      function inArray(arr, item) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] == item) {
            return true;
          }
        }
        return false;
      }
    }]);

//创建用户页
myAppControllers
  .controller('UserCreationCtrl', ['$scope', '$sails', 'userFactory', '$location',
    function ($scope, $sails, userFactory, $location) {

      // callback for ng-click 'createNewUser':
      $scope.createUser = function () {
        $sails.post("/weibouser/", $scope.user)
          .success(function () {
            $location.path('/user')
          })
          .error(function (res) {
            console.log('create user errors: ' + res);
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

myAppControllers
  .controller('UserTable',
  function (DTOptionsBuilder, DTColumnBuilder, $resource, userFactory) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {

      console.log('ajax =' + $resource('/weibouser').query());
      console.log('sails = '+ userFactory.query());

      return $resource('/weibouser').query().$promise;
    }).withPaginationType('full_numbers');

    vm.dtColumns = [
      DTColumnBuilder.newColumn('innerId').withTitle('ID'),
      DTColumnBuilder.newColumn('userName').withTitle('Name'),
      DTColumnBuilder.newColumn('userLocation').withTitle('Location').notVisible()
    ];
  });

myAppControllers
  .controller('UserCtrl', ['$scope', '$location', 'userFactory',
    function ($scope, $location, userFactory) {

      //Websocket方法
      //为用户列表编号
      var lookup = {};
      var line = function (arr) {
        var arr = new Array;
        var obj = new Object;
        for (var i in arr) {
          obj[arr[i].id] = i;
        }
        ;
        console.log(obj);
        return obj;
      };

      //获得用户列表
      userFactory.query(function (data) {
        $scope.users = data;
        //lookup = line($scope.users);
        for (var i in $scope.users) {
          lookup[$scope.users[i].id] = i
        }
        console.log(lookup);
      });

      //获得用户资料
      $scope.getUser = function (id) {
        userFactory.get(id, function (data) {
          $scope.user = data;
        });
      };

      // 删除用户数据
      $scope.deleteUser = function (id) {
        userFactory.delete(id);
      };

      //更新用户数据
      $scope.updateUser = function (id) {
        userFactory.update(id, $scope.user);
      };

      //创建用户
      $scope.createUser = function (id) {
        userFactory.create(id, $scope.user);
        $scope.users.unshift($scope.user);
        $scope.user = {};
      };

      /* 通过Websocket返回值监控页面刷新
       void function () {
       var lookup = {};
       $sails.on('weibouser', function (message) {
       console.log("pushing " + JSON.stringify(message));
       var idx = lookup[message.id];
       switch (message.verb) {
       case 'created':
       $scope.users.unshift(message.data);
       for (var i in $scope.users) {
       lookup[$scope.users[i].id] = i;
       }
       ;
       break;
       case 'destroyed':
       $scope.users.splice(idx, 1);
       for (var i in $scope.users) {
       lookup[$scope.users[i].id] = i;
       }
       ;
       break;
       case 'updated':
       $scope.users.splice([idx], 1, message.data);
       break;
       };
       });
       }();
       */

      /* AjAX方法 页面不跳转

       //get user list
       $scope.users = userFactory.userList.$query();

       // callback for ng-click 'createUser': 未验证
       $scope.createUser = userFactory.userCreate($scope.user);


       // get user detail
       $scope.editUser = function (userId) {
       userFactory.userDetail(userId)
       .then(function(data){
       $scope.user = data;
       })
       };
       */

      /*
       /* AJAX方法 通过页面跳转

       // callback for ng-click 'createUser':
       $scope.createUser = function () {
       $location.path('/user-creation');
       };

       // callback for ng-click 'editUser':
       $scope.editUser = function (userId) {
       $location.path('/user-detail/' + userId);
       };
       */

    }]);


