'use strict';

/* Directives */


angular.module('myApp.directives', [])
  .directive('alert', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<div class="col-md-4 col-md-offset-2 alert" ng-class="showCase.alert.type"><span ng-transclude></span></div>'
    };
  })

  .directive('userForm', function () {
    return {
      restrict: 'E',
      replace: true,
      link: function (scope, elem, attrs) {
      },
      templateUrl: 'templates/userform.html'
    };
  });
