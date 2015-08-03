'use strict';

angular.module('sbAdminApp')

  .controller('ModalInstanceCtrl', function ($modalInstance, weiboUser, userFactory, userPhoto, items, msgs) {
    var modal = this;
    modal.user = items;
    modal.alert = msgs;

    modal.getUserInfo = function () {
      weiboUser.getInfo(modal.user.weiboId).then(
        function (data) {
          modal.user = data;
        }, function (error) {
          modal.errorInfo = error;
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
    modal.openDatePicker = function ($event) {
      if (!modal.user.birthday) {
        modal.user.birthday = new Date('1990-01-01');
      }
      $event.preventDefault();
      $event.stopPropagation();

      modal.opened = true;
    }

    //增加用户照片
    //Todo:通过七牛云存储保存用户照片
    modal.addPhoto = function () {
      if (!angular.isArray(modal.user.photos)) {
        modal.user.photos = []
      }
      if (/https?:\/\/[^\s]+/.test(modal.photo)) {
        userPhoto.get({url: modal.photo}, function (data) {
          if (data.url) {
            modal.user.photos.push(data.url);
            modal.photo = null;
          } else {
            console.log(data.toSource());
            modal.photoInfo = data.error;
          }
        }, function (error) {
          console.log(error.toSource())
        })
      }
    }

    //删除用户照片
    modal.removePhoto = function (id) {
      modal.user.photos.splice(id, 1);
    }

    //保存用户数据
    modal.save = function () {
      if (angular.isString(modal.user.birthday)) {
        modal.user.birthday = new Date(modal.user.birthday);
      }
      userFactory.save(modal.user, function () {
        modal.ok();
      }, function (error) {
        console.error(error);
      });
    }

    //删除用户数据
    modal.delete = function (id) {
      userFactory.remove({id: id}, function () {
        modal.ok();
      }, function (error) {
        console.error(error);
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

  .controller('UserCtrl', ['DTOptionsBuilder', 'DTColumnBuilder', 'userFactory', 'utils', '$scope', '$compile', '$modal',
    function (DTOptionsBuilder, DTColumnBuilder, userFactory, utils, $scope, $compile, $modal) {
      var user = this;
      user.dtInstance = {};

      //处理提示信息
      function alert(message) {
        user.alert = {
          message: message
        }
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
          user.dtInstance.reloadData()
        });
      }

        //创建用户数据
        user.create = function () {
          alert('创建新用户');
          user.detail = {
            location: '010'
          };
          openForm();
        }

        //编辑用户数据
        user.edit = function (id) {
          userFactory.get({id: id}, function (data) {
            user.detail = data;
            alert('编辑【' + data.nickname + '】的个人资料');
            openForm();
          }, function (error) {
            console.error(error);
          });
        }

        //锁定用户数据
        user.lock = function (id) {
          userFactory.save({id: id, lock: true}, function () {
            user.dtInstance.reloadData()
          }, function (error) {
            console.error(error);
          });
        }

        //恢复用户数据
        user.unlock = function (id) {
          userFactory.save({id: id, lock: false}, function () {
            user.dtInstance.reloadData()
          }, function (error) {
            console.error(error);
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
            return utils.codeToCity(data);
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

      }
      ])
