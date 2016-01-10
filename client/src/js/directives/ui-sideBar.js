angular.module('app')
  .directive('uiSidebar', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      templateUrl:'tpl/side_bar.html',
      link: function(scope, el, attr) {
          //todo
      }
    };
  }]);