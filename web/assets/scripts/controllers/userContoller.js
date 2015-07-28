'use strict';

angular.module('sbAdminApp')

  .controller('ModalInstanceCtrl', function ($modalInstance, weiboUser, userFactory, items, msgs) {
    var modal = this;
    modal.user = items;
    modal.alert = msgs;

    modal.getUserInfo = function () {
      var regName = /weibo\.com\/(\w*)/i;
      var regId = /weibo\.com\/u\/(\d*)/i;

      //检查并获取输入框中的数字，作为微博ID
      var result = modal.user.weiboId.match(/\d+/);
      if (result) {
        modal.user.weiboId = result[0];
        var weiboId = modal.user.weiboId;

        //查看数据库是否存在该微博ID
        userFactory.query({weiboId: weiboId},
          function (data) {
            if (data.length >= 1) {
              modal.user = data[0];
              modal.userError = true;
              modal.infoError = '存在' + data.length + '个重复的账号，请检查';
              return;
            } else {
              modal.user = {weiboId: modal.user.weiboId};
            }
          }, function (error) {
            modal.userError = true;
            modal.infoError = '数据库异常';
            return;
          });

        // 从微博后台获取用户信息（在用户已关注的情况）
        weiboUser.get({weiboId: modal.user.weiboId}, function (data) {
          if (data.follow) {
            modal.user.nickname = data.nickname;
            modal.user.avatar = data.headimgurl;
            if (!modal.user.gender) {
              modal.user.gender = data.sex;
            }
            if (!modal.user.location) {
              if (data.province = '北京') {
                modal.user.location = '010';
              }
            }
            return;
          } else {
            modal.userError = true;
            modal.infoError = '此用户尚未关注您，请手动输入微博信息';
            return;
          }
        }, function (error) {
          modal.userError = true;
          modal.infoError = '无法获得此用户的信息';
          return;
        })
      } else {
        modal.infoError = '无法识别，请输入微博用户的ID号或URL';
        modal.userError = true;
        return;
      }
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
    modal.openDatePicker = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

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
      modal.user.birthday = new Date(modal.user.birthday);
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

  .controller('UserCtrl', function (DTOptionsBuilder, DTColumnBuilder, userFactory, utils, $scope, $compile, $modal) {
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

    //弹出用户资料编辑页 user Form
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

      // 关闭资料页时 刷新数据
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

    //刷新用户数据
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
      .withDisplayLength(25)
      //绑定angular控件
      .withOption('createdRow', createdRow)
      // 展开、收起表格
      .withOption('responsive', true)
      // 兼容Bootstrap
      //.withBootstrap()
      //过滤表格数据
      .withColumnFilter({
        aoColumns: [
          null, {
            type: 'text',
            bRegex: true,
            bSmart: true
          }, {
            type: 'select',
            bRegex: false,
            values: ['男', '女']
          }, {
            type: 'number-range'
          }, {
            type: 'number-range'
          }, {
            type: 'text'
          }]
      });
    //绑定angular元素
    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    //显示表格数据
    user.dtColumns = [
      DTColumnBuilder.newColumn('avatar').withTitle('头像').withOption('width', '12%').notSortable().renderWith(function (data) {
        return utils.avatar(data);
      }), ,
      DTColumnBuilder.newColumn('nickname').withTitle('昵称').withOption('width', '18%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('gender').withTitle('性别').withOption('width', '12%').renderWith(function (data) {
        return utils.gender(data);
      }),
      DTColumnBuilder.newColumn('birthday').withTitle('年龄').withOption('width', '12%').renderWith(function (data) {
        return utils.age(data);
      }),
      DTColumnBuilder.newColumn('height').withTitle('身高').withOption('width', '12%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('location').withTitle('地址').withOption('width', '14%').renderWith(function (data) {
        return utils.city(data);
      }),
      DTColumnBuilder.newColumn('id').withTitle('Actions').withOption('width', '20%').notSortable().renderWith(function (data, type, full, meta) {
        return utils.button(data, type, full, meta);
      }),
      // 展开显示数据
      DTColumnBuilder.newColumn('photos').withTitle('照片').withOption('width', '100%').withClass('none').renderWith(function (data) {
        return utils.photos(data);
      }),
      DTColumnBuilder.newColumn('description').withTitle('个人说明').withOption('defaultContent', '暂无介绍').withClass('none')
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
