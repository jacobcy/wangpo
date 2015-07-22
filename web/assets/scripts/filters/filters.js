'use strict';

/* Filters */

angular.module('myApp.filters', [])

//返回userDataTable中的用户性别
  .filter('sex', function () {
    return function (data) {
      switch (data) {
        case 1:
          return '男';
        case 2:
          return '女';
        default:
          return '-';
      }
    }
  })

//返回userDataTable中的用户年龄
  .filter('age', function () {
    return function (data) {
      var nowDate = new Date();
      var birthDate = new Date(data);
      var myAge = nowDate.getFullYear() - birthDate.getFullYear();
      return myAge;
    }
  });



