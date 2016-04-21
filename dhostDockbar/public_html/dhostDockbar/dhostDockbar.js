//
//{
//'checkedClass':'checked'
//}
//
(function ($) {
    $.fn.dhostDockbar = function (option) {
        var defaults = {
            'selector': '',
            'position': 'bottom', //top,middle,bottom,left,right
            'maxscale': '2',
            'affectItem': '3',
            'ratio': '0.9'
        };
        option = $.extend({}, defaults, option);
        var bar = $(this);
        var items = $(this).find(option.selector);
        var itemsWidth = new Array(items.size());
        var maxscale = option.maxscale;
        bar.addClass('dockbar');
        $(items).each(function (index) {
            itemsWidth[index] = $(this).outerWidth();
            $(this).data('index', index);
            $(this).on('mousemove', function (e) {
                var parentOffset = $(this).offset();
                //or $(this).offset(); if you really just want the current element's offset
                var left = e.pageX - parentOffset.left;
                var top = e.pageY - parentOffset.top;
                var width = $(this)[0].getBoundingClientRect().width;
                var height = $(this)[0].getBoundingClientRect().height;
                var scale = maxscale;
                $(this).find('.inner').css('transform', 'translateX(' + ((left * 0.05) * -1) + 'px)');
                $(this).css('transform', 'scale(' + (scale) + ')');
                var element = $(this).prev();
                for (i = 0; i < option.affectItem; i++) {
                    scale *= option.ratio;
                    $(element).find('.inner').css('transform', 'translateX(' + ((left * 0.05) * -1) + 'px)')
                    if (scale > 1) {
                        $(element).css('transform', 'scale(' + (scale) + ')');
                    }
                    element = element.prev();
                }
                element = $(this).next();
                scale = maxscale;
                for (i = 0; i < option.affectItem; i++) {
                    scale *= option.ratio;
                    $(element).find('.inner').css('transform', 'translateX(' + ((left * 0.05) * -1) + 'px)')
                    if (scale > 1) {
                        $(element).css('transform', 'scale(' + (scale) + ')');
                    }
                    element = element.next();
                }
            });
            $(this).hover(function () {//mousein
//                $(this).css('transform', 'scale(' + (maxscale) + ')');
//                var element = $(this).prev();
//                var scale = maxscale;
//                for (i = 0; i < option.affectItem; i++) {
//                    scale *= option.ratio;
//                    if (scale < 1) {
//                        break;
//                    }
//                    $(element).css('transform', 'scale(' + (scale) + ')');
//                    element = element.prev();
//                }
//                element = $(this).next();
//                scale = maxscale;
//                for (i = 0; i < option.affectItem; i++) {
//                    scale *= option.ratio;
//                    if (scale < 1) {
//                        break;
//                    }
//                    $(element).css('transform', 'scale(' + (scale) + ')');
//                    element = element.next();
//                }
            }, function () {//mouseout
                $(this).css('transform', 'scale(1) translateX(0px)');
                var element = $(this).prev();
                for (i = 0; i < option.affectItem; i++) {
                    $(element).css('transform', 'scale(1) translateX(0px)');
                    element = element.prev();
                }
                element = $(this).next();
                for (i = 0; i < option.affectItem; i++) {
                    $(element).css('transform', 'scale(1) translateX(0px)');
                    element = element.next();
                }
            });
        });
    };
}(jQuery));