'use strict';

angular.module('sbAdminApp')

    .controller('UserCtrl',
    ['DTOptionsBuilder', 'DTColumnBuilder', 'userList', 'userInfo', 'utils', '$scope', '$compile', '$uibModal',
        function (DTOptionsBuilder, DTColumnBuilder, userList, userInfo, utils, $scope, $compile, $uibModal) {
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
                var modalInstance = $uibModal.open({
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
                userInfo.get({id: id}, function (data) {
                    user.detail = data;
                    alert('编辑【' + data.nickname + '】的个人资料');
                    openForm();
                }, function (error) {
                    console.error(error);
                });
            }

            //锁定用户数据
            user.lock = function (id) {
                userList.save({id: id, lock: true}, function () {
                    user.dtInstance.reloadData()
                }, function (error) {
                    console.error(error);
                });
            }

            //恢复用户数据
            user.unlock = function (id) {
                userList.save({id: id, lock: false}, function () {
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
            user.dtOptions = DTOptionsBuilder.newOptions()

                //开启服务器端分页模式
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withOption('sAjaxSource', "weibouser/list")

                //早期版本服务器端分页设置
                /*
                 .withFnServerData(function (sSource, aoData, fnCallback, oSettings) {
                 oSettings.jqXHR = $.ajax({
                 dataType: 'json',
                 type: "POST",
                 url: sSource,
                 data: aoData,
                 // Todo:通过Bearer Token获取后台数据
                 // beforeSend: function(xhr){
                 // xhr.setRequestHeader('Authorization', 'Bearer ' + sails.config.token)},
                 success: fnCallback,
                 error: function (error) {
                 console.log(error)
                 }
                 });
                 })
                 */

                //最新版本的服务器端分页设置
                /*
                 .withOption('ajax', {
                 url: '/weibouser/list',
                 type: 'POST',
                 dataSrc: 'data',
                 sAjaxSource: '/weibouser/list',
                 data: {
                 lock: false
                 }
                 })
                 */
                //.withDataProp('data')

                //设置分页模式和数量
                .withPaginationType('full')
                .withDisplayLength(10)

                // 展开、收起表格
                .withOption('responsive', true)

            /**
             //过滤表格数据(传统服务器端分页模式下生效)
             .withColumnFilter({
          aoColumns: [
            null,
            null, {
              type: 'select',
              values: ['男', '女', '未知']
            }, {
              type: 'number-range'
            }, {
              type: 'number-range'
            }, {
              type: 'text'
            }]
        })
             **/
                //绑定angular控件，进行行操作
                .withOption('createdRow', createdRow);

            function createdRow(row, data, dataIndex) {
                // Recompiling so we can bind Angular directive to the DT
                $compile(angular.element(row).contents())($scope);
            }

            //显示表格数据
            user.dtColumns = [
                DTColumnBuilder.newColumn('avatar').withTitle('头像').withOption('width', '12%').notSortable().renderWith(function (data) {
                    return utils.avatar(data);
                }),
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

        }]);
