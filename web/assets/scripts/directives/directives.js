'use strict';

/* Directives */

angular.module('sbAdminApp.directives',[])
  .directive('userForm', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/userform.html'
    }
  });
