'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:DataCtrl
 * @description
 * # DataCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('DataCtrl', ['$resource', 'DTOptionsBuilder', 'DTColumnBuilder', 'dataServer', '$state',
        function ($resource, DTOptionsBuilder, DTColumnBuilder, dataServer, $state) {

            if (dataServer.token()) {

                var url = dataServer.url + '/main/latestPhotos';
                var dt = this;
                dt.dtInstance = {};

                dt.refresh = function () {
                    var resetPaging = false;
                    user.dtInstance.reloadData(false);
                }

                dt.dtOptions = DTOptionsBuilder

                    // Promise方式获取数据
                    //.fromFnPromise(function () {
                    //    return $resource(url).query().$promise
                    //})

                    // Ajax方式获取数据
                    //.fromSource( url)
                    //.withDataProp('data')

                    //server Side方式获取数据
                    .newOptions()
                    .withOption('processing', true)
                    .withOption('serverSide', true)
                    .withFnServerData(function (sSource, aoData, fnCallback, oSettings) {
                        oSettings.jqXHR = $.ajax({
                            'dataType': 'json',
                            'type': 'POST',
                            'url': url,
                            'data': aoData,
                            'success': fnCallback
                        })
                    })

                    .withDisplayLength(10)
                    .withPaginationType('full')
                    .withOption('autoWidth', true)
                    .withOption('stateSave', true)
                /**
                 // 过滤数据
                 .withColumnFilter({
                        aoColumns: [
                            {type: 'text'},
                            {type: 'text'}
                        ]
                    })
                 **/
                dt.dtColumns = [
                    DTColumnBuilder.newColumn('nickname').withTitle('昵称'),
                    DTColumnBuilder.newColumn('photo').withTitle('照片地址').withOption('defaultContent', '-'),
                ]
            } else {
                $state.go('dashboard.login')
            }
        }]);
