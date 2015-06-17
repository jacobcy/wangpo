'use strict';

/**
 * @ngdoc overview
 * @name myApp
 * @description
 * # myApp
 *
 * Main module of the application.
 */
angular.module('myApp', [
  'ngRoute', //angular-route
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
])
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider) {
      //去掉url中的#，但是导致sails的路由处理错误
      //$locationProvider.html5Mode(true);
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainController'
        })
        .when('/user', {
          templateUrl: 'views/user.html',
          controller: 'UserController as showCase'
        })
        .when('/msg', {
          templateUrl: 'views/msg.html',
          controller: 'MsgController'
        })
        .when('/post', {
          templateUrl: 'views/post.html',
          controller: 'PostController'
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);

