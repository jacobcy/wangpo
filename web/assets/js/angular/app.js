'use strict';

/**
 * @ngdoc overview
 * @name angularViqunApp
 * @description
 * # angularViqunApp
 *
 * Main module of the application.
 */
angular
  .module('angularViqunApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/angular.html', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/user', {
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
      .when('/msg-detail/:id', {
        templateUrl: 'views/msg-detail.html',
        controller: 'MsgDetailCtrl'
      })
      .when('/post', {
        templateUrl: 'views/post.html',
        controller: 'PostCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
