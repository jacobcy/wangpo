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
  'mgcrea.ngStrap',   //实现bootstrap效果
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
])
  .config(['$routeProvider',
    function ($routeProvider) {
      //去掉url中的#，但是导致sails的路由处理错误
      //$locationProvider.html5Mode(true);
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainController as main'
        })
        .when('/user', {
          templateUrl: 'views/user.html',
          controller: 'UserController as user'
        })
        .when('/msg', {
          templateUrl: 'views/msg.html',
          controller: 'MsgController as msg'
        })
        .when('/post', {
          templateUrl: 'views/post.html',
          controller: 'PostController as post'
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);

