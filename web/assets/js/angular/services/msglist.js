'use strict';

/**
 * @ngdoc service
 * @name angularViqunApp.msgList
 * @description
 * # msgList
 * Factory in the angularViqunApp.
 */
angular.module('angularViqunApp')
  .factory('msgList', ['$http', function ($http) {

    var msgs = $http.get('http://www.meiroom.com/msg/')
      .success( function(data){
        return data;
      })
      .error ( function(data){
        return data;
      });

    function getJsonLength(jsonData){
      var jsonLength = 0;
      for(var item in jsonData){
        jsonLength++;
      };
      return jsonLength;
    };

    function inArray(arr, item) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == item) {
          return true;
        };
      };
      return false;
    };

    var msgsLength = getJsonLength(msgs);
    var mesengers = [];
    for(var i = 0; i < msgsLength; i++){
      var msgFrom = msgs[i].from;
      if( !inArray( mesengers,msgFrom) ){
        mesengers.push(msgFrom);
      };
    };

    return mesengers;
  }]);
