'use strict';

/**
 * @ngdoc service
 * @name angularViqunApp.userList
 * @description
 * # userList
 * Factory in the angularViqunApp.
 */
angular.module('angularViqunApp')
  .factory('userList', function ($resource) {
    return $resource('http://www.meiroom.com/user/',{},{
      query: { method: 'GET', isArray: true },
      create: { method: 'POST' }
    });
  });
