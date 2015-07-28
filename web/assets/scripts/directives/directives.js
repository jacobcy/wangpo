'use strict';

/* Directives */

angular.module('sbAdminApp')
  .directive('userForm', function () {
    return {
      restrict: 'E',
      replace: true,
      link: function (scope, elem, attrs) {
      },
      templateUrl: 'templates/userform.html'
    }
  });
