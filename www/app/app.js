var app = angular.module('flowGrid', [
    'ngResource',
    'ngFlowGrid'
]);

app.controller('appCtrl', ['$scope', '$resource', 'fgDelegate',
    function ($scope, $resourece, fgDelegate) {

        $scope.items = [];

        var url = 'http://api.iwangpo.com';
        $resourece(url + '/main/latestPhotos').get(function (data) {

            $scope.items = data.data;

            // make sure ngRepeat is finished rendering
            $scope.$watch('$last', function () {
                fgDelegate.getFlow('demoGird').itemsChanged();
            });
        }, function (error) {
            console.error(error);
        });

        $scope.changeWidth = function (width) {
            var flow = fgDelegate.getFlow('demoGird')

            flow.minItemWidth += width;
            fgDelegate.getFlow('demoGird').refill(true);
        }

        // then you can:
        // homePageGrid.minItemWidth = 150;
        // homePageGrid.refill();

    }]);