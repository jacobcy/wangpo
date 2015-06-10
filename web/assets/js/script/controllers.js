'use strict';

var myAppControllers = angular.module('myApp.controllers', [
  'datatables', //表格样式
  'datatables.tabletools', //下载表格
  'datatables.bootstrap', //bootstrap样式
  'datatables.columnfilter', //数据过滤
]);

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
  .controller('PostCtrl', function ($scope) {
  })

//消息界面
  .controller('MsgCtrl', function ($scope, msgList) {
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
  .controller('UserCtrl',
  function (DTOptionsBuilder, DTColumnBuilder, $scope, $compile, userList, userDetail ) {
    var vm = this;
    vm.alert = 'hide';
    vm.message = '';
    vm.dtInstance = {};

    //手动刷新表格数据
    vm.reloadData = reloadData;
    function reloadData() {
      var resetPaging = false;
      vm.dtInstance.reloadData(callback, resetPaging);
    };
    function callback(json) {
      vm.alert = 'alert-success';
      vm.message = '更新表格内容';
    };

    //编辑用户数据
    vm.edit = edit;
    function edit(userId) {
      vm.alert = "alert-warning";
      vm.message = '编辑用户数据 ID: ' + userId;
      vm.type = false;
      vm.user = userDetail.show({id:userId});
    };
    vm.updateUser = function () {
      userDetail.update(vm.user);
      vm.dtInstance.reloadData();
    };

    //删除用户数据
    vm.delete = deleteRow;
    function deleteRow(userId) {
      vm.alert = 'alert-danger'
      vm.message = '删除用户数据 ID: ' + userId;
      userDetail.delete({id:userId});
      vm.dtInstance.reloadData();
    };

    //创建用户数据
    vm.create = function () {
      vm.alert = 'alert-info'
      vm.message = '创建用户数据';
      vm.type = true;
      vm.user = {};
    };
    vm.createUser = function () {
      userList.create(vm.user);
      vm.dtInstance.reloadData();
    };

    //填入表格数据
    vm.dtOptions = DTOptionsBuilder.fromSource(userList.query)
    //vm.dtOptions = DTOptionsBuilder.fromSource($resource('/weibouser').get)
    //vm.dtOptions = DTOptionsBuilder.fromSource($sails.get('/weibouser'))
    /*
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
      return $resource('/weibouser/').query().$promise
    })*/
      //实时更新数据
      .withOption('stateSave', true)
      //设置翻页效果
      .withPaginationType('full')
      //设置默认行数
      .withDisplayLength(10)
      //绑定angular控件
      .withOption('createdRow', createdRow)
      // 展开、收起表格
      .withOption('responsive', true)
      // 使用bootstrap样式
      //.withBootstrap()
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
    //绑定angular元素
    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    };

    //显示表格数据
    vm.dtColumns = [
      DTColumnBuilder.newColumn('innerId').withTitle('ID').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('userName').withTitle('昵称').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('gender').withTitle('性别').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('userLocation').withTitle('地址').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
        .renderWith(actionsHtml),
      // 展开显示数据
      DTColumnBuilder.newColumn('userBirthday').withTitle('年龄').withOption('defaultContent', '-').withClass('none'),
      DTColumnBuilder.newColumn('height').withTitle('身高').withOption('defaultContent', '-').withClass('none')
    ];

    //编辑、删除按钮
    function actionsHtml(data, type, full, meta) {
      return '<button data-target="#myModal" data-toggle="modal" class="btn btn-warning" ng-click="showCase.edit(' + data.id + ')">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger" ng-click="showCase.delete(' + data.id + ')">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    };
  });
