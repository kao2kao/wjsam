var indexAppModule = angular.module('indexAppModule', ['infinite-scroll']);

indexAppModule.controller('PostListController',
    function ($scope, Demo) {
        $scope.demo = new Demo();
    });
