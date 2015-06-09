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
  .controller('PostCtrl',function ($scope) {
    })

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

myAppControllers

  //通过dataTable插件来处理数据
  .controller('UserCtrl',
  function (DTOptionsBuilder, DTColumnBuilder, $resource, $scope, $compile) {
    $scope.side=false;
    var vm = this;
    vm.message = '';
    vm.dtInstance = {};

    vm.edit = edit;
    function edit(id) {
      vm.message = 'You are trying to edit the row with ID: ' + id;
      // Edit some data and call server to make changes...
      $scope.user = $resource('/weibouser/'+id).get();
      $scope.side = true;
      // Then reload the data so that DT is refreshed
      vm.dtInstance.reloadData();
    };
    // callback for ng-click 'updateUser':
    $scope.updateUser = function (id) {
      $resource('/weibouser/'+id).update($scope.user);
    };

    vm.delete = deleteRow;
    function deleteRow(id) {
      vm.message = 'You are trying to remove the row with ID: ' + id;
      // Delete some data and call server to make changes...
      $resource('/weibouser/'+id).delete();
      // Then reload the data so that DT is refreshed
      vm.dtInstance.reloadData();
    };

    vm.createUser = function(){
      $scope.user = {}
      $scope.side = !$scope.side;
    };

    $scope.createUser = function () {
      $resource.post("/weibouser/", $scope.user)
        .success(function () {
          $location.path('/user')
        })
        .error(function (res) {
          console.log('create user errors: ' + res);
        })
    };

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    };

    //手动刷新表格数据
    vm.reloadData = reloadData;
    function reloadData() {
      vm.dtInstance.reloadData();
    };

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
      return $resource('/weibouser/').query()
        //$sails.get('/weibouser')
        .$promise
    })
      //设置翻页效果
      .withPaginationType('full')
      //设置默认行数
      .withDisplayLength(10)
      //新建数据
      .withOption('createdRow', createdRow)
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

    function actionsHtml(data, type, full, meta) {
      return '<button class="btn btn-warning" ng-click="showCase.edit(' + data.id + ')">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger" ng-click="showCase.delete(' + data.id + ')">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    };
  });



