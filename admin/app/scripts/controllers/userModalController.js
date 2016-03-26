'use strict';

angular.module('sbAdminApp')

  .controller('ModalInstanceCtrl',
  ['$uibModalInstance', 'weiboUser', 'userInfo', 'userPhoto', 'items', 'msgs',
    function ($uibModalInstance, weiboUser, userInfo, userPhoto, items, msgs) {
      var modal = this;
      modal.user = items;
      if (!modal.user.birthday.isDate) {
        modal.user.birthday = new Date(modal.user.birthday)
      }
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

      if (angular.isArray(modal.user.photos) && modal.user.photos.length >= 6) {
        modal.photoLimit = true;
      }

      //增加用户照片
      //Todo:通过七牛云存储保存用户照片
      modal.addPhoto = function () {
        if (!angular.isArray(modal.user.photos)) {
          modal.user.photos = []
        }
        if (/https?:\/\/[^\s]+/.test(modal.photo)) {
          userPhoto.get({url: modal.photo}, function (data) {
            if (data.id) {
              modal.user.photos.push(data.id);
              modal.photo = null;
              if (modal.user.photos.length >= 6) {
                modal.photoLimit = true;
              }
            } else {
              console.log(data.toSource());
              modal.photoInfo = data.error;
            }
          }, function (error) {
            console.log(error.toSource())
          })
        } else {
          modal.photoInfo = '请输入照片URL地址';
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
        userInfo.save(modal.user, function () {
          modal.ok();
        }, function (error) {
          console.error(error);
        });
      }

      //删除用户数据
      modal.delete = function (id) {
        userInfo.remove({id: id}, function () {
          modal.ok();
        }, function (error) {
          console.error(error);
        });
      }

      //关闭弹出层
      modal.ok = function () {
        $uibModalInstance.close();
      }

      //取消弹出层
      modal.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      }
    }]);
