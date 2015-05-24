'use strict';

/**
 * @ngdoc function
 * @name angularViqunApp.controller:UserDetailCtrl
 * @description
 * # UserDetailCtrl
 * Controller of the angularViqunApp
 */
angular.module('angularViqunApp')
  .controller('UserDetailCtrl', ['$scope', '$routeParams', 'userFactory', '$location',
    function ($scope, $routeParams, userFactory, $location) {

      // callback for ng-click 'updateUser':
      $scope.updateUser = function () {
        userFactory.update($scope.user);
        userList.query();
        $location.path('/user');
      };

      // callback for ng-click 'cancel':
      $scope.cancel = function () {
        $location.path('/user');
      };

      $scope.user = userFactory.show({id: $routeParams.id});
    }]);

