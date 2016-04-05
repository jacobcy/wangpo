'use strict';

angular.module('sbAdminApp')

    .controller('UserCtrl',
    ['DTOptionsBuilder', 'DTColumnBuilder', '$scope', '$compile', '$uibModal', 'dataServer', 'userList', 'utils',
        function (DTOptionsBuilder, DTColumnBuilder, $scope, $compile, $uibModal, dataServer, userList, utils) {
            var user = this;
            user.dtInstance = {};

            //保存提示信息
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
                    user.refresh()
                });
            }

            //创建用户数据
            user.create = function () {
                alert('创建新用户');
                user.alert.create = true;
                user.detail = {
                    birthday: new Date('1990/01/01'),
                    height: 170,
                    location: '010',
                    photos: {}
                };
                openForm();
            }

            //编辑用户数据
            user.edit = function (id) {
                userList.get({
                    //access_token: dataServer.token(),
                    id: id
                }, function (data) {
                    user.detail = data;
                    alert('编辑【' + data.nickname + '】的个人资料');
                    user.alert.create = false;
                    openForm();
                }, function (error) {
                    console.error(error);
                });
            }

            //锁定用户数据
            user.lock = function (id) {
                userList.update({
                    //access_token: dataServer.token(),
                    id: id,
                    lock: true
                }, function () {
                    user.refresh()
                }, function (error) {
                    console.error(error);
                });
            }

            //恢复用户数据
            user.unlock = function (id) {
                userList.update({
                    //access_token: dataServer.token()
                    id: id,
                    lock: false
                }, function () {
                    user.refresh()
                }, function (error) {
                    console.error(error);
                });
            }

            //刷新用户数据
            user.refresh = function () {
                var resetPaging = false;
                user.dtInstance.reloadData(false);
            }


            var url = dataServer.url + '/weibouser/list';

            //填入表格数据
            user.dtOptions = DTOptionsBuilder

                .newOptions()

                //开启服务器端分页模式
                .withOption('processing', true)
                .withOption('serverSide', true)
                //刷新需要此URL
                .withOption('ajax', {
                    url: url,
                    dataSrc: 'data'
                })
                //过滤需要此URL
                .withFnServerData(function (sSource, aoData, fnCallback, oSettings) {
                    aoData.push({name: 'access_token', value: dataServer.token()});
                    //console.log(aoData.toSource());
                    oSettings.jqXHR = $.ajax({
                        url: url,
                        type: 'POST',
                        dataType: 'json',
                        data: aoData,
                        success: fnCallback
                    })
                })

                //设置分页模式和数量
                .withPaginationType('full')
                .withDisplayLength(20)
                .withOption('autoWidth', true)

                // 展开、收起表格
                .withOption('responsive', true)

                //绑定angular控件，进行行操作
                .withOption('createdRow', createdRow)

            /**
             //过滤表格数据 Ligther ColumnFilter
             .withLightColumnFilter({
                            '0': {},
                            '1': {
                                type: 'text'
                            },
                            '2': {
                                type: 'select',
                                values: [{
                                    value: '1', label: '男'
                                }, {
                                    value: '2', label: '女'
                                }, {
                                    value: '3', label: '未知'
                                }]
                            },
                            '3': {
                                type: 'text'
                            },
                            '4': {
                                type: 'text'
                            }
                        })
             **/

                //过滤表格数据 columnFilter
                .withColumnFilter({
                    sRangeFormat: "From {from} To {to}",
                    aoColumns: [
                        null,
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        }, {
                            type: 'select',
                            bRegex: false,
                            values: ['男', '女', '未知']
                        }, {
                            type: 'number-range'
                        }, {
                            type: 'number-range'
                        }, {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        }]
                });

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

            function createdRow(row, data, dataIndex) {
                // Recompiling so we can bind Angular directive to the DT
                $compile(angular.element(row).contents())($scope);
            }

        }]);
