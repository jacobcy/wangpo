'use strict';

var myAppControllers = angular.module('myApp.controllers', [
  //表格样式
  'datatables',
  //数据过滤
  'datatables.columnfilter'
  //下载表格
  //'datatables.tabletools',
  //bootstrap样式
  //'datatables.bootstrap'
]);

//导航栏当前页高亮效果
myAppControllers
  .controller('NavController', function ($scope, $location) {
    $scope.isActive = function (route) {
      return route === $location.path();
    };
  })

//欢迎界面
  .controller('MainController', function ($scope) {
    $scope.test = '欢迎进入后台管理系统！';
  })

//微博收发界面
  .controller('PostController', function ($scope) {
  })

//消息界面
  .controller('MsgController', function ($scope, msgList) {
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
    });

myAppControllers

  //通过dataTable插件来处理数据
  .controller('UserController',
  function (DTOptionsBuilder, DTColumnBuilder, $scope, $compile, user, $filter) {
    var vm = this;
    vm.dtInstance = {};
    function alert(type, message) {
      vm.alert = {
        'type': type,
        'message': message
      }
    }

    alert('hide');

    //手动刷新表格数据
    vm.reloadData = reloadData;
    function reloadData() {
      vm.dtInstance.reloadData(callback, false);
    }

    function callback() {
      alert('alert-success', '数据已更新');
    }

    //编辑用户数据
    vm.edit = edit;
    function edit(id) {
      alert('alert-warning', '更新用户数据 ID: ' + id);
      vm.type = false;
      vm.user = user.get({id: id}, function () {
        console.log($filter('age')(vm.user.userBirthday));
      });
    }
    vm.updateUser = function () {
      user.save(vm.user,
        function () {
          vm.dtInstance.reloadData();
        }, function () {
          alert('alert-danger', '更新失败');
        }
      );
    };

    //删除用户数据
    vm.delete = deleteRow;
    function deleteRow(id) {
      alert('alert-danger', '删除用户数据 ID: ' + id);
      user.remove({id: id},
        function () {
          vm.dtInstance.reloadData()
        }, function () {
          alert('alert-danger', '删除失败');
        });
    }

    //创建用户数据
    vm.create = create;
    function create() {
      alert('alert-info', '创建用户数据');
      vm.type = true;
      vm.user = {};
    }
    vm.createUser = function () {
      user.save(vm.user, function () {
        vm.dtInstance.reloadData()
      }, function (error) {
        alert('alert-danger', '创建失败' + error);
      });
    };

    //填入表格数据
    vm.dtOptions = DTOptionsBuilder.fromSource(user.query)
    /*
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
     return user.query().$promise；
    })*/
      //保持状态
      .withOption('stateSave', true)
      //设置翻页效果
      .withPaginationType('full')
      //设置默认行数
      .withDisplayLength(10)
      //绑定angular控件
      .withOption('createdRow', createdRow)
      // 展开、收起表格
      .withOption('responsive', true)
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
          type: 'numble'
        }, {
          type: 'numble'
        }, {
          type: 'text',
          bRegex: true,
          bSmart: true
        }]
      });
    //绑定angular元素
    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    //显示表格数据
    vm.dtColumns = [
      DTColumnBuilder.newColumn('innerId').withTitle('ID').withOption('width', '20%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('userName').withTitle('昵称').withOption('width', '20%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('gender').withTitle('性别').withOption('width', '10%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('userBirthday').withTitle('年龄').withOption('width', '10%').withOption('defaultContent', '-').renderWith(function (data) {
        return $filter('age')(data);
      }),
      DTColumnBuilder.newColumn('height').withTitle('身高').withOption('width', '10%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('userLocation').withTitle('地址').withOption('width', '15%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn(null).withTitle('Actions').withOption('width', '15%').notSortable()
        .renderWith(actionsHtml),
      // 展开显示数据
      DTColumnBuilder.newColumn('avatar').withTitle('头像').withOption('defaultContent', '-').withClass('none').renderWith(function (data) {
        return $filter('image')(data, 150);
      }),
      DTColumnBuilder.newColumn('description').withTitle('个人说明').withOption('defaultContent', '-').withClass('none')
    ];

    //编辑、删除按钮
    function actionsHtml(data, type, full, meta) {
      return '<button data-target="#myModal" data-toggle="modal" class="btn btn-warning" ng-click="showCase.edit(' + data.id + ')">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger" ng-click="showCase.delete(' + data.id + ')">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }
  });
