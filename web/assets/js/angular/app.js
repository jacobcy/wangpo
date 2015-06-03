'use strict';

/**
 * @ngdoc overview
 * @name angularViqunApp
 * @description
 * # angularViqunApp
 *
 * Main module of the application.
 */
angular.module('myApp', [
  'ngRoute', //angular-route
  'ngSails', // angular-sails
  'ngResource',//angular-resource
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
])
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      //去掉url中的#，但是导致sails的路由处理错误
      //$locationProvider.html5Mode(true);
      $routeProvider
        .when('/app', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .when('/app/user', {
          templateUrl: 'views/user-list.html',
          controller: 'UserCtrl'
        })
        .when('/user-detail/:id', {
          templateUrl: 'views/user-detail.html',
          controller: 'UserDetailCtrl'
        })
        .when('/user-creation', {
          templateUrl: 'views/user-creation.html',
          controller: 'UserCreationCtrl'
        })
        .when('/msg', {
          templateUrl: 'views/msg.html',
          controller: 'MsgCtrl'
        })
        .when('/post', {
          templateUrl: 'views/post.html',
          controller: 'PostCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);
