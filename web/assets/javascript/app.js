var app = angular.module('flowGrid', ['ngFlowGrid']);

app.controller('appCtrl',['$scope','fgDelegate',function($scope,fgDelegate){
  $scope.items = [
    {
      id:1,
      img:'http://vq-script.qiniudn.com/84e28fed15a61ed45c53be99802958b3',
      name:'温暖中的小迪,女,27,175,北京'
    },
    {
      id:2,
      img:'http://vq-script.qiniudn.com/a67b80c4dafd5b1adc213134a5c80379',
      name:'温暖中的小迪,女,27,175,北京'
    },
    {
      id:3,
      img:'http://vq-script.qiniudn.com/a45f00537ded203d9c8437b48dcbfc46',
      name:'温暖中的小迪,女,27,175,北京'
    },
    {
      id:4,
      img:'http://vq-script.qiniudn.com/87ee4835d5563c158a54dec8949036f4',
      name:'温暖中的小迪,女,27,175,北京'
    },
    {
      id:5,
      img:'http://vq-script.qiniudn.com/f00efcb4932447985fb426eff905ba7d',
      name:'碎玉005,男,25,168,北京'
    },
    {
      id:6,
      img:'http://vq-script.qiniudn.com/4db17fe5e82ff5d78c37a2fed198cda8',
      name:'做一枚安静的美男子,男,21,172,北京'
    },
    {
      id:7,
      img:'http://vq-script.qiniudn.com/5c1960a8c3aa7706ccf22418f20e3e1b',
      name:'做一枚安静的美男子,男,21,172,北京'
    },
    {
      id:8,
      img:'http://vq-script.qiniudn.com/1d987da40c3f3bcee19bf0724e38d2fe',
      name:'做一枚安静的美男子,男,21,172,北京'
    },
    {
      id:9,
      img:'http://vq-script.qiniudn.com/a8125c6c89767dd0a8d9c215694fa10f',
      name:'做一枚安静的美男子,男,21,172,北京'
    },
    {
      id:10,
      img:'http://vq-script.qiniudn.com/fed5c73bea5ade46585d940ac7774a79',
      name:'轩辕镜妍,女,28,172,北京'
    }
  ]

  $scope.addItem = function(){
    var randomIndex = Math.floor(Math.random(0,1)* $scope.items.length)
    var newItem = {
      name:$scope.items[randomIndex].name,
      img:$scope.items[randomIndex].img
    }
    // add a new item;
    $scope.items.splice(0,0,newItem);

    // make sure ngRepeat is finished rendering
    $scope.$watch('$last',function(){
      fgDelegate.getFlow('demoGird').itemsChanged();
    });
  }

  $scope.changeWidth = function(width){
    var flow = fgDelegate.getFlow('demoGird')

    flow.minItemWidth += width;
    fgDelegate.getFlow('demoGird').refill(true);
  }

  // then you can:
  // homePageGrid.minItemWidth = 150;
  // homePageGrid.refill();

}]);
