'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
    .directive('header', function () {
        return {
            //templateUrl:'scripts/directives/header/header.html',
            template: '<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="index.html">王婆速配粉丝服务后台</a></div><header-notification></header-notification><sidebar></sidebar></nav>',
            restrict: 'E',
            replace: true
        }
    });


