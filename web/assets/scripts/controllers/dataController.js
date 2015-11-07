'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:DataCtrl
 * @description
 * # DataCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('DataCtrl', ['$scope','utils','userFactory','DTOptionsBuilder','DTColumnBuilder',
    function ($scope,utils,userFactory,DTOptionsBuilder,DTColumnBuilder) {

    var dt = this

    dt.dtInstance = {}

      dt.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
        return userFactory.query({lock: 'false'}).$promise
      })

    dt.dtColumns = [
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
      })
    ];

  }]);
