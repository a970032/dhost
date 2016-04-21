(function ($) {
    $.fn.dhostSticky = function (option) {
        var element = $(this);
        var windowHeight = $(window).outerHeight();
        var defaults = {
            'stickyClass': 'stickied',
            'bottom': {show: false, removeClass: true},
            'runAfterInit': true
        };
        option = $.extend({}, defaults, option);
        $(window).scroll(function () {
            if (option.bottom.show == true) {
                if (element.offset().top<=$(window).scrollTop()+windowHeight&&element.offset().top>$(window).scrollTop()) {
                    element.addClass(option.stickyClass);
                } else {
                    if (option.bottom.removeClass == true) {
                        element.removeClass(option.stickyClass);
                    }
                }
            } else {
                if ($(window).scrollTop() > element.offset().top) {
                    element.addClass(option.stickyClass);
                } else {
                    element.removeClass(option.stickyClass);
                }
            }
        });
        if (option.runAfterInit == true) {
            $(window).scroll();
        }
    };
}(jQuery));