var app = angular.module('flowGrid', [
    'ngResource',
    'ngFlowGrid'
]);

app.controller('appCtrl', ['$scope', '$resource', 'fgDelegate',
    function ($scope, $resourece, fgDelegate) {
        var url = 'http://api.iwangpo.com';
        $resourece(url + '/main/latestPhotos').get({},function(data){
            $scope.items = data.data;
        },function(error){
            console.error(error);
        });

        $scope.addItem = function () {
            var randomIndex = Math.floor(Math.random(0, 1) * $scope.items.length)
            var newItem = {
                name: $scope.items[randomIndex].name,
                img: $scope.items[randomIndex].img
            }
            // add a new item;
            $scope.items.splice(0, 0, newItem);

            // make sure ngRepeat is finished rendering
            $scope.$watch('$last', function () {
                fgDelegate.getFlow('demoGird').itemsChanged();
            });
        }

        $scope.changeWidth = function (width) {
            var flow = fgDelegate.getFlow('demoGird')

            flow.minItemWidth += width;
            fgDelegate.getFlow('demoGird').refill(true);
        }

        // then you can:
        // homePageGrid.minItemWidth = 150;
        // homePageGrid.refill();

    }]);