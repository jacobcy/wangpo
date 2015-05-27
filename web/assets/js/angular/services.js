'use strict';

/* Services */

var myAppServices = angular.module('myApp.services', []);

myAppServices
  .factory('userList', function ($resource) {
    return $resource('http://localhost:1337/weibouser/',{},{
      query: { method: 'GET', isArray: true },
      create: { method: 'POST' }
    });
  });

myAppServices
  .factory('userFactory', function ($resource) {
    return $resource('http://localhost:1337/weibouser/:id', {}, {
      show: { method: 'GET' },
      update: { method: 'PUT', params: {id: '@id'} },
      delete: { method: 'DELETE', params: {id: '@id'} }
    })
  });

myAppServices
  .service('msgList', ['$http', function ($http) {
    return $http.get('http://www.meiroom.com/msg/')
      .success( function(data){
        return data;
      })
      .error ( function(data){
      return data;
    });
  }]);
