'use strict';

/* Services */

var myAppServices = angular.module('myApp.services', []);

myAppServices
  .service('userFactory', function ($resource) {

    this.list = $resource('http://localhost:1337/weibouser/',{},{
      create: { method: 'POST' }
    });

    this.user = $resource('http://localhost:1337/weibouser/:id', {}, {
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
