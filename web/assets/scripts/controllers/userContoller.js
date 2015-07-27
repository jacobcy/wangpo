'use strict';

angular.module('sbAdminApp')

  .controller('ModalInstanceCtrl', function ($modalInstance, items, msgs, userFactory, weiboUser) {
    var modal = this;
    modal.user = items;
    modal.alert = msgs;

    modal.getUserInfo = function (id) {
      var regName = /weibo\.com\/(\w*)/i;
      var regId = /weibo\.com\/u\/(\d*)/i;

      var result = id.match(/\d{9,11}/);
      if (!result) {
        modal.userError = true;
        modal.user.nickname = '您输入的链接有误';
        return;
      } else {
        id = result[0];
        modal.user.weiboId = id;
      }
      weiboUser.get({weiboId: id}, function (data) {
        if (data.follow) {
          modal.user.nickname = data.nickname;
          modal.user.avatar = data.headimgurl;
          modal.user.gender = data.sex;
          if (data.province = '北京') {
            modal.user.location = '010';
          }
        } else {
          modal.userError = true;
          modal.user.nickname = '此用户尚未关注您';
        }
      }, function () {
        modal.userError = true;
        modal.user.nickname = '无法获得此用户的信息';
      })
    }

    //选择性别
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

    // 打开日期选择器
    modal.openDatePicker = function () {
      modal.opened = true;
    }

    //增加用户照片
    modal.addPhoto = function () {
      modal.user.photos.push(modal.photo);
      modal.photo = null;
    }

    //删除用户照片
    modal.removePhoto = function (id) {
      modal.user.photos.splice(id, 1);
    }

    //保存用户数据
    modal.save = function () {
      if (!modal.user.photos) {
        modal.user.photos = [];
      }
      userFactory.save(modal.user, function () {
        modal.ok();
      }, function (error) {
        console.error(error);
      });
    }

    //删除用户数据
    modal.delete = function (id) {
      userFactory.remove({id: id},
        function () {
          modal.ok();
        });
    }

    //关闭弹出层
    modal.ok = function () {
      $modalInstance.close();
    }

    //取消弹出层
    modal.cancel = function () {
      $modalInstance.dismiss('cancel');
    }

  })

  .controller('UserCtrl', function (DTOptionsBuilder, DTColumnBuilder, userFactory, filters, $scope, $compile, $modal, $filter) {
    var user = this;
    user.dtInstance = {};

    //处理提示信息
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

    //弹出user form
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
        user.closeAlert();
      });
    }

    //创建用户数据
    user.create = function () {
      alert(user, 'success', '创建新用户');
      user.detail = {};
      openForm();
    }

    //编辑用户数据
    user.edit = function (id) {
      userFactory.get({id: id}, function (data) {
        user.detail = data;
        user.detail.birthday = new Date(user.detail.birthday);
        alert(user, 'info', '编辑【' + data.nickname + '】的个人资料');
        openForm();
      });
    }

    //锁定用户数据
    user.lock = function (id) {
      userFactory.save({id: id, lock: true},
        function () {
          user.dtInstance.reloadData()
        });
    }

    //恢复用户数据
    user.unlock = function (id) {
      userFactory.save({id: id, lock: false},
        function () {
          user.dtInstance.reloadData()
        });
    }

    user.refresh = function () {
      user.dtInstance.reloadData();
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
      DTColumnBuilder.newColumn('avatar').withTitle('头像').withOption('width', '15%').notSortable().withOption('defaultContent', '-').renderWith(function (data) {
        return filters.avatar(data);
      }), ,
      DTColumnBuilder.newColumn('nickname').withTitle('昵称').withOption('width', '20%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('gender').withTitle('性别').withOption('width', '10%').renderWith(function (data) {
        return $filter('sex')(data);
      }),
      DTColumnBuilder.newColumn('birthday').withTitle('年龄').withOption('width', '10%').withOption('defaultContent', '-').renderWith(function (data) {
        return $filter('age')(data);
      }),
      DTColumnBuilder.newColumn('height').withTitle('身高').withOption('width', '10%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('location').withTitle('地址').withOption('width', '15%').withOption('defaultContent', '-').renderWith(function (data) {
        return $filter('city')(data);
      }),
      DTColumnBuilder.newColumn('id').withTitle('Actions').withOption('width', '20%').notSortable().renderWith(function (data, type, full, meta) {
        return filters.button(data, type, full, meta);
      }),
      // 展开显示数据
      DTColumnBuilder.newColumn('photos').withTitle('照片').withOption('width', '100%').withOption('defaultContent', '-').withClass('none').renderWith(function (data) {
        return filters.photos(data);
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

  })
