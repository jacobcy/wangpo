'use strict';

/* Directives */

angular.module('sbAdminApp')
    .directive('userForm', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/userform.html'
        }
    });
