//
//{
//'checkedClass':'checked'
//}
//
(function ($) {
    $.fn.dhostFollowMouse = function (option) {
        var defaults = {
            'ratio': 0.05,
            'revert': false,
            'backToOrgin': false,
            'selector': 'div'
        };
        option = $.extend({}, defaults, option);
        var area = $(this);
        var child = $(this).find(' > ' + option.selector);
        child.addClass('mm-child');
        $(area).on('mousemove', function (e) {
            var x = e.clientX - $(area).offset().left;
            var y = e.clientY - $(area).offset().top;
            x *= option.ratio;
            y *= option.ratio;
            if (option.revert == true) {
                x *= -1;
                y *= -1;
            }
            console.log(x, y);
            child.each(function () {
                $(this).css('transform', 'translate(' + x + 'px,' + y + 'px)');
            });
        });
        $(area).on('mouseleave', function (e) {
            if (option.backToOrgin) {
                child.removeAttr('style');
            }
        });
    };
}(jQuery));