'use strict';

/* Controllers */

var myAppControllers = angular.module('myApp.controllers', [
  'datatables', //表格样式
  'datatables.tabletools', //下载表格
  'datatables.bootstrap', //bootstrap样式
  'datatables.columnfilter', //数据过滤
  'datatables.fixedheader' //冻结头部
]);

//TODO：需要改写为directive
//导航栏当前页高亮效果
myAppControllers
  .controller('NavCtrl', function ($scope, $location) {
    $scope.isActive = function (route) {
      return route === $location.path();
    };
  })

//欢迎界面
  .controller('MainCtrl', function ($scope) {
    $scope.test = '欢迎进入后台管理系统！';
  })

//微博收发界面
  .controller('PostCtrl', ['$scope',
    function ($scope) {
    }])

//消息界面
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
    }])

//创建用户页
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
    }])

//用户详情页
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
    }])

myAppControllers

  //通过dataTable插件来处理数据
  .controller('UserTable',
  function (DTOptionsBuilder, DTColumnBuilder, $resource, $sails) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
      return $resource('/weibouser').query()
        //$sails.get('/weibouser')
        .$promise
    })
      //设置翻页效果
      .withPaginationType('full')
      //设置默认行数
      .withDisplayLength(10)
      // 展开、收起表格
      .withOption('responsive', true)
      // 使用bootstrap样式
      /*
      .withBootstrap()
      .withBootstrapOptions({
        TableTools: {
          classes: {
            container: 'btn-group',
            buttons: {
              normal: 'btn btn-danger'
            }
          }
        },
        pagination: {
          classes: {
            ul: 'pagination pagination-sm'
          }
        }
      })*/

      //冻结表格首行
      .withFixedHeader({bottom: false})
      //允许下载表格
      .withTableTools('swf/copy_csv_xls_pdf.swf')
      .withTableToolsButtons([
        'copy',
        'print', {
          'sExtends': 'collection',
          'sButtonText': 'Save',
          'aButtons': ['csv', 'xls', 'pdf']
        }
      ])
      //过滤表格数据
      .withColumnFilter({
        aoColumns: [{
          type: 'numble'
        }, {
          type: 'text',
          bRegex: true,
          bSmart: true
        }, {
          type: 'select',
          bRegex: false,
          values: ['男', '女']
        }, {
          type: 'text',
          bRegex: true,
          bSmart: true
        }]
      });

    //手动刷新表格数据
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData() {
      var resetPaging = true;
      vm.dtInstance.reloadData(callback, resetPaging);
    }

    function callback(json) {
      console.log(json);
    }

    //显示表格数据
    vm.dtColumns = [
      DTColumnBuilder.newColumn('innerId').withTitle('ID').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('userName').withTitle('昵称').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('gender').withTitle('性别').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('userLocation').withTitle('地址').withOption('defaultContent', '-'),
      // 展开显示数据
      DTColumnBuilder.newColumn('userBirthday').withTitle('年龄').withOption('defaultContent', '-').withClass('none'),
      DTColumnBuilder.newColumn('height').withTitle('身高').withOption('defaultContent', '-').withClass('none')
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


