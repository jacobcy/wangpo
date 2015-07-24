'use strict';

angular.module('sbAdminApp')

  .controller('ModalInstanceCtrl', function ($modalInstance, items, msgs, userFactory, filters) {
    var modal = this;
    modal.user = items;
    modal.alert = msgs;

    modal.sex = [{
      value: 1,
      title: '男'
    }, {
      value: 2,
      title: '女'
    }, {
      value: 0,
      title: '未知'
    }];

    modal.addPhoto = function () {
      modal.user.photos.push(modal.photo);
      modal.photo = null;
    }

    modal.removePhoto = function (id) {
      modal.user.photos.splice(id, 1);
    }

    //更新用户数据
    modal.update = function (id) {
      if (!modal.user.photos) {
        modal.user.photos = [];
      }
      if (modal.date) {
        modal.user.birthday = filters.date(modal.date);
      }
      userFactory.save(modal.user, function () {
        modal.date = null;
        modal.ok();
      });
    }

    //删除用户数据
    modal.delete = function (id) {
      userFactory.remove({id: id},
        function () {
          modal.ok();
        });
    }

    modal.ok = function () {
      $modalInstance.close();
    }

    modal.cancel = function () {
      $modalInstance.dismiss('cancel');
    }
  })

  .controller('UserCtrl', function (DTOptionsBuilder, DTColumnBuilder, userFactory, $scope, $compile, $modal, $log, $filter, filters) {
    var user = this;
    user.dtInstance = {};

    function alert(obj, type, message) {
      obj.alert = {
        'type': type,
        'message': message,
        'display': true
      }
    }

    user.alert = {};
    user.alert.display = false;
    user.closeAlert = function () {
      user.alert.display = false;
    }


    function openForm() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'scripts/templates/userform.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: 'modal',
        //size: 'lg',
        resolve: {
          items: function () {
            return user.detail;
          },
          msgs: function () {
            return user.alert;
          }
        }
      });

      modalInstance.result.then(function () {
        user.dtInstance.reloadData();
        alert(user, 'hide');
      });
    }

    //创建用户数据
    user.create = function () {
      alert(user, 'success', '创建新用户');
      user.newbie = true;
      user.city = false;
      user.detail = {};
      openForm();
    }

    user.save = function () {
      user.detail.birthday = filters.date(user.date);
      userFactory.save(user.detail, function () {
        user.dtInstance.reloadData()
      }, function (error) {
        alert(user, 'danger', '更新失败' + error);
      });
    }

//编辑用户数据
    user.edit = function (id) {
      user.newbie = false;
      userFactory.get({id: id}, function (data) {
        user.detail = data;
        alert(user, 'info', '编辑【' + data.nickname + '】的个人资料');
        openForm();
      });
    }

//锁定用户数据
    user.lock = function (id) {
      userFactory.remove({id: id},
        function () {
          user.dtInstance.reloadData()
        }, function () {
          alert(user, 'danger', '删除失败');
        });
    }

//恢复用户数据
    user.unlock = function (id) {

    }


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
        //alert(user, 'uccess', '数据已更新');
      }, false);
    }
  })
