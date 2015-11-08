'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:DataCtrl
 * @description
 * # DataCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('DataCtrl', ['$resource', 'DTOptionsBuilder', 'DTColumnBuilder',
    function ($resource, DTOptionsBuilder, DTColumnBuilder) {

    var dt = this

    dt.dtInstance = {}

      dt.dtOptions = DTOptionsBuilder

        // json方式获取数据
        //.fromSource( $resource('/weibouser').query)

        // Promise方式获取数据
        /* .fromFnPromise(function () {
         return $resource('/weibouser').query({lock: 'false'}).$promise
         })*/

        // 服务器端分页
          .newOptions()
          .withOption('ajax', {
          dataSrc: 'data',
          url: '/weibouser/list',
          type: 'GET',
          // 过滤服务器数据
          data: {
            lock: false
          }
        })
        .withOption('processing', true)
        .withOption('serverSide', true)

        // 过滤数据（有冲突未生效，导致翻页时无法获得设置的URL）
/*        .withColumnFilter({
          aoColumns: [
            {
              type: 'text'
            }, {
              type: 'text'
            }]
        })
        //保持过滤状态
        .withOption('stateSave', true)*/

        .withPaginationType('full')
        .withDisplayLength(5);

    dt.dtColumns = [
      DTColumnBuilder.newColumn('nickname').withTitle('昵称'),
      DTColumnBuilder.newColumn('height').withTitle('身高')
    ];

  }]);
