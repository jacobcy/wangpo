'use strict';

var myAppServices = angular.module('myApp.services', [
  'ngResource',//angular-resource
  'ngSails' // angular-sails
]);

// WebSocket方法取后端数据
myAppServices
  .factory('userSails', function ($sails) {
    var userUrl = '/weibouser/';

    return {
      query: $sails.get(userUrl),
      create: function (data) {
        $sails.post(userUrl, data);
      },
      get: function (id) {
        $sails.get(userUrl + id);
      },
      delete: function (id) {
        $sails.delete(userUrl + id);
      },
      update: function (id, data) {
        $sails.put(userUrl + id, data);
      }
    };
  })

  .factory('user', function ($resource) {
    return $resource('/weibouser/:id', {id: '@id'})
  });

myAppServices
  .service('msgList', function ($http) {
    return $http.get('http://www.meiroom.com/msg/')
  });
