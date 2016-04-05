'use strict';

angular.module('sbAdminApp')

    .controller('ModalInstanceCtrl',
    ['$uibModalInstance', 'weiboUser', 'userList', 'userPhoto', 'items', 'msgs', 'dataServer',
        function ($uibModalInstance, weiboUser, userList, userPhoto, items, msgs, dataServer) {

            var modal = this;
            modal.alert = msgs;
            modal.user = items;
            if (!modal.user.birthday.isDate) {
                modal.user.birthday = new Date(modal.user.birthday);
            }
            modal.user.photos = items.photos || {};

            //根据微博URL获取用户资料
            modal.getuserList = function () {
                weiboUser.getInfo(modal.user.weiboId).then(
                    function (data) {
                        modal.user = data;
                    }, function (error) {
                        console.error(error.toSource());
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
                    modal.user.birthday = new Date('1990/01/01');
                }
                $event.preventDefault();
                $event.stopPropagation();
                modal.opened = true;
            }

            if (modal.user.photos.length >= 5) {
                modal.photoLimit = true;
            }

            //增加用户照片
            modal.addPhoto = function () {
                if (/https?:\/\/[^\s]+/.test(modal.photo)) {
                    userPhoto.add.get({
                        access_token: dataServer.token(),
                        weiboUserId: modal.user.id,
                        url: modal.photo
                    }, function (data) {
                        //console.log(data.toSource());
                        modal.photoInfo = data.error || '照片已上传';
                        // modal.user.photos.push(modal.photo);
                        userList.get({
                            //access_token: dataServer.token()
                            id: modal.user.id
                        }, function (data) {
                            modal.user = data;
                        }, function (error) {
                            console.error(error.toSource());
                        })
                        if (modal.user.photos.length >= 5) {
                            modal.photoLimit = true;
                        }
                        modal.photo = null;
                    }, function (error) {
                        console.error(error.toSource());
                        modal.photoInfo = error.error
                    })
                } else {
                    modal.photoInfo = '您输入的URL不正确'
                }
            }

            //删除用户照片
            modal.removePhoto = function (index) {
                userPhoto.delete.get({
                    access_token: dataServer.token(),
                    id: modal.user.photos[index].id
                }, function (data) {
                    //console.log(data.toSource());
                    modal.photoInfo = data.error || '照片已删除';
                    modal.user.photos.splice(index, 1);
                }, function (error) {
                    console.error(error.toSource());
                    modal.photoInfo = error.error
                })
            }

            //保存用户数据
            modal.save = function () {
                if (angular.isString(modal.user.birthday)) {
                    modal.user.birthday = new Date(modal.user.birthday);
                }
                //modal.user.access_token = dataServer.token();
                userList.save(modal.user, function () {
                    modal.ok();
                }, function (error) {
                    console.error(error.toSource());
                });
            }

            //修改用户数据
            modal.update = function () {
                if (angular.isString(modal.user.birthday)) {
                    modal.user.birthday = new Date(modal.user.birthday);
                }
                //modal.user.access_token = dataServer.token();
                userList.update(modal.user, function () {
                    modal.ok();
                }, function (error) {
                    console.error(error.toSource());
                });
            }

            //删除用户数据
            modal.delete = function (id) {
                userList.remove({
                    //access_token: dataServer.token(),
                    id: id
                }, function () {
                    modal.ok();
                }, function (error) {
                    console.error(error.toSource());
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
