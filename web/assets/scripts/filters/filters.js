'use strict';

/* Filters */

angular.module('sbAdminApp')

//返回userDataTable中的用户年龄
  .filter('age', ['utils', function (utils) {
    return function (data) {
      return utils.age(data);
    }
  }])

//返回用户
  .filter('city', ['utils', function (utils) {
    return function (data) {
      return utils.codeToCity(data);
    }
  }])



