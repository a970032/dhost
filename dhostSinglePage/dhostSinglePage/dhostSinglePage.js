(function ($) {
    var path = document.currentScript.src;
    var pluginPath = path.substring(0, path.lastIndexOf('/'));
    $.fn.dhostSinglePage = function (option) {
        var defaults = {
            'emptyBlock': false
        };
        option = $.extend({}, defaults, option);
        var singlePage = $(this);
        singlePage.addClass('dsp-wrapper');
        var emptyBlock = singlePage.find('.dsp-empty-block');
//         singlePage.css('height',$(window).outerHeight());
        var background = $('<div class="dsp-background" style="height:' + $(window).outerHeight() + 'px"></div>');
        var scrollable = singlePage.find(' > *').wrapAll('<div class="scrollable"></div>');
        singlePage.append(background);
        $(window).scroll(function () {
            if (option.emptyBlock) {
                $(emptyBlock).each(function () {
                    if ($(this).offset().top <= $(window).scrollTop() + $(window).outerHeight()
                            && $(window).scrollTop() + $(window).outerHeight() >= $(this).offset().top) {
                        if ($(this)[0].hasAttribute("data-background")) {
                            background.css('background', $(this).data('background'));
                        }
                    } else {
//                    if (option.bottom.removeClass == true) {
//                        element.removeClass(option.stickyClass);
//                    }
                    }
                });
            }
        });
        $(window).scroll();
        return this;
    };
}(jQuery));