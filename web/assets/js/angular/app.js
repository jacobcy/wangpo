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
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
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
      .when('/post', {
        templateUrl: 'views/post.html',
        controller: 'PostCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
