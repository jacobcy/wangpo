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

      dt.dtOptions = DTOptionsBuilder.newOptions()

        // json方式获取数据
        //.fromSource( $resource('/weibouser').query)

        // Promise方式获取数据
        /*
         .fromFnPromise(function () {
         return $resource('/weibouser').query({lock: 'false'}).$promise
         })
         */

        // 服务器端分页
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('sAjaxSource', "/weibouser/list")

        // 过滤数据
        .withColumnFilter({
          aoColumns: [
            {type: 'text'},
            {type: 'number'}
          ]
        })
      // 保持过滤状态
      // .withOption('stateSave', true)

      // .withPaginationType('full')
      // .withDisplayLength(10);

      dt.dtColumns = [
        DTColumnBuilder.newColumn('nickname').withTitle('昵称'),
        DTColumnBuilder.newColumn('height').withTitle('身高')
      ];

    }]);
