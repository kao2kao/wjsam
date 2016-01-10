angular.module('app')
  .directive('uiFooter', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      templateUrl:'tpl/footer.html',
      link: function(scope, el, attr) {

      }
    };
  }]);