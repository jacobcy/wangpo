'use strict';

/* Filters */

angular.module('myApp.filters', [])
  .filter('age', function () {
    return function (data) {
      var nowDate = new Date();
      var birthDate = new Date(data);
      var myAge = nowDate.getFullYear() - birthDate.getFullYear();
      return myAge;
    };
  })

  .filter('image', function () {
    return function (data, width) {
      return '<img src="' + data + '" style="width:' + width + 'px; height:auto" />'
    }
  });
