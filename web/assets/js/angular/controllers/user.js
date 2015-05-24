'use strict';

/**
 * @ngdoc function
 * @name angularViqunApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the angularViqunApp
 */
angular.module('angularViqunApp')
  .controller('UserCtrl', ['$scope', 'userList', 'userFactory', '$location', function($scope, userList, userFactory, $location){

    // callback for ng-click 'editUser':
    $scope.editUser = function (userId) {
      $location.path('/user-detail/' + userId);
    };

    // callback for ng-click 'deleteUser':
    $scope.deleteUser = function (userId) {
      userFactory.delete({ id: userId });
      userList.query();
      $location.path('/user-list');
    };

    // callback for ng-click 'createUser':
    $scope.createNewUser = function () {
      $location.path('/user-creation');
    };

    $scope.users = userList.query();

  }]);

