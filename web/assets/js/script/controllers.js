'use strict';

angular.module('myApp.controllers', [
  //表格样式
  'datatables',
  //数据过滤
  'datatables.columnfilter'
  //下载表格
  //'datatables.tabletools',
  //bootstrap样式
  //'datatables.bootstrap'
])

//导航栏当前页高亮效果
  .controller('NavController', ['$location', function ($location) {
    var vm = this;
    vm.isActive = function (route) {
      return route === $location.path();
    }
  }])

//欢迎界面
  .controller('MainController', function () {
    var main = this;
    main.test = '欢迎进入后台管理系统！';
  })

//微博收发界面
  .controller('PostController', function () {
  })

//消息界面
  .controller('MsgController', ['msgService', function (msgService) {
    var msg = this;
    msgService.success(function (data) {
      msg.msgs = data;

      //获得消息人列表
      var msgers = [];
      for (var i in data) {
        var msgFrom = data[i].from;
        if (!inArray(msgers, msgFrom)) {
          msgers.push(msgFrom);
        }
      }
      msg.msgers = msgers;
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

  //通过dataTable插件来处理数据
  .controller('UserController', ['DTOptionsBuilder', 'DTColumnBuilder', '$scope', '$compile', '$filter', '$timeout', 'userFactory', 'userSails',
    function (DTOptionsBuilder, DTColumnBuilder, $scope, $compile, $filter, $timeout, userFactory, userSails) {
      var user = this;

      user.dtInstance = {};
      //刷新表格数据
      user.reloadData = function () {
        user.dtInstance.reloadData(function () {
          alert(user, 'alert-success', '数据已更新');
        }, false);
      };

      function alert(obj, type, message) {
        obj.alert = {
          'type': type,
          'message': message
        }
      }

      alert(user, 'hide');

      //TODO：如何正确使用$timeout
      //$timeout(alert(user,'alert-info','I am back'),3000);

      //创建用户数据
      user.create = function () {
        alert(user, 'alert-info', '创建用户数据');
        user.newbie = true;
        user.detail = {};
      };

      user.save = function () {
        /*
         // ajax方法
         userFactory.save(user.detail, function () {
         user.dtInstance.reloadData()
         }, function (error) {
         alert(user, 'alert-danger', '更新失败' + error);
        });
         */
        userSails.save(user.detail).then(function () {
          user.reloadData();
        })
      };

      //编辑用户数据
      user.edit = function (id) {
        alert(user, 'alert-warning', '更新用户数据 ID: ' + id);
        user.newbie = false;
        userSails.get(id).success(
          function (data) {
            user.detail = data
          });
        /*
         // ajax方法
         userFactory.get({id: id}, function () {
         console.log($filter('age')(user.detail.userBirthday));
         });
         */
      };

      user.update = function (id) {
        userSails.update(id, user.detail).then(function () {
          user.reloadData();
        })
      };

      //删除用户数据
      user.delete = function (id) {
        alert(user, 'alert-danger', '删除用户数据 ID: ' + id);
        userSails.remove(id).then(
          function () {
            user.reloadData();
          });
        /*
         // ajax方法
         userFactory.remove({id: id},
         function () {
         user.dtInstance.reloadData()
         }, function () {
         alert(user, 'alert-danger', '删除失败');
         });
         */
      };

      //TODO: 用userSails引入数据
      //填入表格数据
      //user.dtOptions = DTOptionsBuilder.fromSource(userFactory.query)
      user.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
        return userFactory.query().$promise
      })
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
      user.dtColumns = [
        DTColumnBuilder.newColumn('innerId').withTitle('ID').withOption('width', '20%').withOption('defaultContent', '-'),
        DTColumnBuilder.newColumn('userName').withTitle('昵称').withOption('width', '20%').withOption('defaultContent', '-'),
        DTColumnBuilder.newColumn('gender').withTitle('性别').withOption('width', '10%').withOption('defaultContent', '-'),
        DTColumnBuilder.newColumn('userBirthday').withTitle('年龄').withOption('width', '10%').withOption('defaultContent', '-').renderWith(function (data) {
          return $filter('age')(data);
        }),
        DTColumnBuilder.newColumn('height').withTitle('身高').withOption('width', '10%').withOption('defaultContent', '-'),
        DTColumnBuilder.newColumn('userLocation').withTitle('地址').withOption('width', '15%').withOption('defaultContent', '-'),
        DTColumnBuilder.newColumn('id').withTitle('Actions').withOption('width', '15%').notSortable()
          .renderWith(function (data) {
            return $filter('button')(data);
          }),
        // 展开显示数据
        DTColumnBuilder.newColumn('avatar').withTitle('头像').withOption('defaultContent', '-').withClass('none').renderWith(function (data) {
          return $filter('image')(data, 150);
        }),
        DTColumnBuilder.newColumn('description').withTitle('个人说明').withOption('defaultContent', '-').withClass('none')
      ];
    }]);
