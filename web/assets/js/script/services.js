'use strict';

var myAppServices = angular.module('myApp.services', [
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
/*
  .factory('userFactory', function ($resource) {
    var userUrl = '/weibouser/';

    return {
      query: $resource(userUrl).query(),
      create: function (data) {
        $resource(userUrl).save(data);
      },
      get: function (id) {
        $resource(userUrl + id).get()
          .success(function(data){
            return data
          });
      },
      delete: function (id) {
        $resource(userUrl + id).delete();
      },
      update: function (id, data) {
        $resourc(userUrl + id).save(data);
      }
    };
  })
*/
.factory('userList', function ($resource) {
  return $resource('/weibouser', {}, {
    query: { method: 'GET', isArray: true },
    create: { method: 'POST' }
  })
})

.factory('userDetail', function ($resource) {
  return $resource('/weibouser/:id', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  })
});


myAppServices
  .service('msgList', function ($http) {
    return $http.get('http://www.meiroom.com/msg/')
      /*
      .success(function (data) {
        return data;
      })
      .error(function (data) {
        return data;
      });
      */
  })
