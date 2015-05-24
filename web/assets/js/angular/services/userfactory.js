'use strict';

/**
 * @ngdoc service
 * @name angularViqunApp.userFactory
 * @description
 * # userFactory
 * Service in the angularViqunApp.
 */
angular.module('angularViqunApp')
  .factory('userFactory', function ($resource) {
    return $resource('http://www.meiroom.com/user/:id', {}, {
      show: { method: 'GET' },
      update: { method: 'PUT', params: {id: '@id'} },
      delete: { method: 'DELETE', params: {id: '@id'} }
    })
  });

