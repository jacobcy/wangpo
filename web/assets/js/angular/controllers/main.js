'use strict';

/**
 * @ngdoc function
 * @name angularViqunApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularViqunApp
 */
angular.module('angularViqunApp')
  .controller('MainCtrl', function ($scope, $location) {
    $scope.test = "Just for fun";
    $scope.isActive = function (route){
      return route === $location.path();
    };
  });
