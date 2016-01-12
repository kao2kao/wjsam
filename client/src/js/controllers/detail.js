'use strict';

/* Controllers */
app.controller('DetailCtrl', function ($scope, $http) {
    var herf = window.location.href;
    var id = herf.substring(herf.indexOf('detail') + 7, herf.indexOf('.html'));
    var url = "detail.json?id=" + id;
    $http.get(url).success(function (data) {
        $scope.article = data;
    });
});
