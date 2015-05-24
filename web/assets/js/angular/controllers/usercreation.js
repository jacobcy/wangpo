'use strict';

/**
 * @ngdoc function
 * @name angularViqunApp.controller:UserCreationCtrl
 * @description
 * # UserCreationCtrl
 * Controller of the angularViqunApp
 */
angular.module('angularViqunApp')
  .controller('UserCreationCtrl', ['$scope', 'userList', '$location',
    function ($scope, userList, $location) {

      // callback for ng-click 'createNewUser':
      $scope.createNewUser = function () {
        userList.create($scope.user);
        userList.query();
        $location.path('/user');
      };

      // callback for ng-click 'cancel':
      $scope.cancel = function () {
        $location.path('/user');
      };

    }]);
