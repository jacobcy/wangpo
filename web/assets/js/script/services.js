'use strict';

angular.module('myApp.services', [
  'ngResource',//angular-resource
  'ngSails' // angular-sails
])

// WebSocket方法取后端数据
  .factory('userSails', ['$sails', function ($sails) {
    var userUrl = '/weibouser/';
    return {
      query: function () {
        return $sails.get(userUrl)
      },
      get: function (id) {
        return $sails.get(userUrl + id);
      },
      save: function (data) {
        return $sails.post(userUrl, data);
      },
      update: function (id, data) {
        return $sails.put(userUrl + id, data);
      },
      remove: function (id) {
        return $sails.delete(userUrl + id);
      },
      lock: function (id) {
        return $sails.post(userUrl + id, {lock: true})
      },
      unlock: function (id) {
        return $sails.post(userUrl + id, {lock: false})
      }
    }
  }])

  .factory('userFactory', ['$resource', function ($resource) {
    return $resource('/weibouser/:id', {id: '@id'})
  }])

  .service('msgService', ['$http', function ($http) {
    return $http.get('http://www.meiroom.com/msg/')
  }]);
