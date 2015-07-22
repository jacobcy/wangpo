'use strict';

angular.module('myApp.controllers', [
  'datatables',  //表格
  'datatables.columnfilter'   //表格数据过滤
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
  .controller('PostController', function ($resource,$scope, $modal) {

    // Pre-fetch an external template populated with a custom scope
    var myOtherModal = $modal({scope: $scope, template: '/templates/userform.html', show: false});
    // Show when some event occurs (use $promise property to ensure the template has been loaded)
    $scope.showModal = function() {
      myOtherModal.$promise.then(myOtherModal.show);
    };
    $scope.hideModal = function() {
      myOtherModal.$promise.then(myOtherModal.hide);
    };

    var post = this;
    post.token = '2.00mxMdbDM2ItgBb84742f5edSeR2aC';
    post.url = 'jacobcy';
    post.check = $resource('https://api.weibo.com/2/users/domain_show.json').get({
      domain: post.url,
      access_token: post.token
    }, function (data) {
      console.log(data);
      post.id = data.id,
        post.nickname = data.screen_name
    }, function (error) {
      post.error = error
    })
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
  .controller('UserController', ['DTOptionsBuilder', 'DTColumnBuilder', '$scope', '$compile', '$filter', '$modal', 'userFactory', 'userSails','filters',
    function (DTOptionsBuilder, DTColumnBuilder, $scope, $compile, $filter, $modal, userFactory, userSails, filters) {
      var user = this;
      user.dtInstance = {};

      function alert(obj, type, message) {
        obj.alert = {
          'type': type,
          'message': message
        }
      }

      alert(user, 'hide');

      // Pre-fetch an external template populated with a custom scope
      var myOtherModal = $modal({scope: $scope, template: '/templates/userform.html', show: false});
      // Show when some event occurs (use $promise property to ensure the template has been loaded)
      $scope.showModal = function() {
        myOtherModal.$promise.then(myOtherModal.show);
      };
      $scope.hideModal = function() {
        myOtherModal.$promise.then(myOtherModal.hide);
      };

      user.sex = [{
        value: 1,
        title: '男'
      }, {
        value: 2,
        title: '女'
      }, {
        value: 0,
        title: '未知'
      }];

      //创建用户数据
      user.create = function () {
        alert(user, 'alert-success', '创建新用户');
        user.newbie = true;
        user.city = false;
        user.detail = {};
        $scope.showModal();
      }

      user.save = function () {
        user.detail.birthday = filters.date(user.date);
        /*
         // ajax方法
         userFactory.save(user.detail, function () {
         user.dtInstance.reloadData()
         }, function (error) {
         alert(user, 'alert-danger', '更新失败' + error);
         });
         */
        userSails.save(user.detail).success(function () {
          alert(user, 'alert-success', '成功创建【' + user.detail.nickname + '】的个人资料');
          user.reloadData();
          $scope.hideModal();
        })
      }

      //编辑用户数据
      user.edit = function (id) {
        user.newbie = false;
        userSails.get(id).success(
          function (data) {
            user.detail = data;
            user.city = filters.city(user.detail.location);
            alert(user, 'alert-info', '编辑【' + user.detail.nickname + '】的个人资料');
            $scope.showModal();
          });
        /*
         // ajax方法
         userFactory.get({id: id}, function () {
         console.log($filter('age')(user.detail.userBirthday));
         });
         */
      }

      user.addPhoto = function () {
        user.detail.photos.push(user.photo);
        user.photo = null;
      }

      user.removePhoto = function(id){
        user.detail.photos.splice(id, 1);
      }

      user.update = function (id) {
        if (!user.detail.photos) {
          user.detail.photos = [];
        }
        if(user.date){
          user.detail.birthday = filters.date(user.date);
        }
        //console.log(user.detail.photos);
        userSails.update(id, user.detail).success(function () {
          if(user.date){
            user.detail.birthday = filters.date(user.date);
          };
          alert(user, 'alert-info', '成功更新【' + user.detail.nickname + '】的个人资料');
          user.reloadData();
          user.date = null;
          $scope.hideModal();
        })
      };

      //删除用户数据
      user.delete = function (id) {
        alert(user, 'alert-danger', '删除【' + user.detail.nickname + '】的个人资料');
        userSails.remove(id).success(
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
        $scope.hideModal();
      };

      //锁定用户数据
      user.lock = function (id) {
        userSails.get(id).success(
          function (data) {
            user.detail = data;
            alert(user, 'alert-warning', '锁定【' + user.detail.nickname + '】的个人资料');
          });
        userSails.lock(id).success(
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

      //恢复用户数据
      user.unlock = function (id) {
        userSails.get(id).success(
          function (data) {
            user.detail = data;
            alert(user, 'alert-success', '解锁【' + user.detail.nickname + '】的个人资料');
          });
        userSails.unlock(id).success(
          function () {
            user.reloadData();
          });
      };

      //TODO: 用userSails引入数据
      //填入表格数据
      //user.dtOptions = DTOptionsBuilder.fromSource(userFactory.query)
      user.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
        return userFactory.query({lock: 'false'}).$promise
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
        DTColumnBuilder.newColumn('weiboId').withTitle('ID').withOption('width', '20%').withOption('defaultContent', '-'),
        DTColumnBuilder.newColumn('nickname').withTitle('昵称').withOption('width', '20%').withOption('defaultContent', '-'),
        DTColumnBuilder.newColumn('gender').withTitle('性别').withOption('width', '10%').renderWith(function (data) {
          return $filter('sex')(data);
        }),
        DTColumnBuilder.newColumn('birthday').withTitle('年龄').withOption('width', '10%').withOption('defaultContent', '-').renderWith(function (data) {
          return $filter('age')(data);
        }),
        DTColumnBuilder.newColumn('height').withTitle('身高').withOption('width', '10%').withOption('defaultContent', '-'),
        DTColumnBuilder.newColumn('location').withTitle('地址').withOption('width', '15%').withOption('defaultContent', '-').renderWith(function (data) {
          return filters.city(data);
        }),
        DTColumnBuilder.newColumn('id').withTitle('Actions').withOption('width', '15%').notSortable().renderWith(function (data, type, full, meta) {
          return filters.button(data, type, full, meta);
        }),
        // 展开显示数据
        DTColumnBuilder.newColumn('photos').withTitle('照片').withOption('width', '100%').withOption('defaultContent', '-').withClass('none').renderWith(function (data) {
          return filters.image(data);
        }),
        DTColumnBuilder.newColumn('description').withTitle('个人说明').withOption('defaultContent', '-').withClass('none')
      ];

      //显示锁定的用户数据
      user.lockbutton = false;
      user.lockPromise = function () {
        user.lockbutton = true;
        return userFactory.query({lock: 'true'}).$promise
      }

      //显示未锁定的用户数据
      user.unlockPromise = function () {
        user.lockbutton = false;
        return userFactory.query({lock: 'false'}).$promise
      }

      //刷新表格数据
      user.reloadData = function () {
        user.dtInstance.reloadData(function () {
          //alert(user, 'alert-success', '数据已更新');
        }, false);
      }

    }]);

