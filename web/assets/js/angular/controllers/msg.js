'use strict';

/**
 * @ngdoc function
 * @name angularViqunApp.controller:MsgCtrl
 * @description
 * # MsgCtrl
 * Controller of the angularViqunApp
 */
angular.module('angularViqunApp')
  .controller('MsgCtrl',['$scope', 'msgList', function ($scope, msgList) {
    msgList.success(function(data){
      $scope.messages = data;
    });
  }]);


