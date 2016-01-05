angular.module('app')
  .directive('uiHeader', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      templateUrl:'tpl/header.html',
      link: function(scope, el, attr) {
        var window_w = $(window).width(); // Window Width
        var window_h = $(window).height(); // Window Height
        var window_s = $(window).scrollTop(); // Window Scroll Top
        var $body = $('body'); // Body
        var $header = $('#header');	// Header
        var stickyHeader = true;  // $body.hasClass('sticky-header-on');

       /* var resolution = 991;
        if($body.hasClass('tablet-sticky-header'))*/
          var resolution = 767

        if(stickyHeader && window_w > resolution){
          $header.addClass('sticky-header');
          var header_height = $header.innerHeight();
          $body.css('padding-top', header_height+'px');
        }

        $(window).scroll(function(){
          animateHeader();
        });

        $(window).resize(function(){
          animateHeader();
          if(window_w < resolution){
            $header.removeClass('sticky-header').removeClass('animate-header');
            $body.css('padding-top', 0+'px');
          }else{
            $header.addClass('sticky-header');
            var header_height = $header.innerHeight();
            $body.css('padding-top', header_height+'px');
          }
        });

        function animateHeader(){
          window_s = $(window).scrollTop(); // Window Scroll Top
          if(window_s>100){
            $('#header.sticky-header').addClass('animate-header');
          }else{
            $('#header.sticky-header').removeClass('animate-header');
          }
        }
      }
    };
  }]);