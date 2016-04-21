(function ($) {
    var allGroupBox = {};
    var allGroupBoxSize = {};
    /*
     {
     'width':'0',
     'height':'0',
     'top':0,
     'left':0,
     'onOpen':function,
     'onClose':function,
     'animationTime':0,
     }
     */
    $.fn.dhostLightbox = function (option) {
        var element = $(this);
        var content = $('<div />').append($(element.attr('href')).clone()).html();
        var mask = $('<div class="dlb-mask"></div>');
        var lightBox = $('<div class="dlb-box"></div>');
        var contentWrapper = $('<div class="dlb-contentWrapper"></div>');
        var closeBtn = $('<a class="close" href="javascript:;"></a>');
        var nextButton = $('<a class="dlb-next" href="javascript:;"></a>');
        var perviousButton = $('<a class="dlb-pervious" href="javascript:;"></a>');
        var grouping = false;
        var instance = $(this);
        if (!allGroupBox[$(this).data('rel')]) {
            allGroupBox[$(this).data('rel')] = [];
        }
        if (!allGroupBoxSize[$(this).data('rel')]) {
            allGroupBoxSize[$(this).data('rel')] = $('[data-rel='+$(this).data('rel')+']').size();
        }
        allGroupBox[$(this).data('rel')].push(this);
        var currentIndex = 0;
        var defaults = {
            'width': ($(window).width() * 0.95),
            'height': ($(window).height() * 0.9),
            'top': $(window).height() * 0.05,
            'left': ($(window).width() / 2) - (($(window).width() * 0.95) / 2),
            'onOpen': null,
            'onClose': null,
            'onPreOpen': null,
            'onPreClose': null,
            'animationTime': 200
        };
        option = $.extend({}, defaults, option);
        var openBox = function () {
            if (option.onPreOpen) {
                option.onPreOpen();
            }
            mask.show().delay(100).queue(function (next) {
                lightBox.css('opacity', 1);
                next();
            });
            if (option.onOpen) {
                option.onOpen();
            }
        };
        var closeBox = function () {
            if (option.onPreClose) {
                option.onPreClose();
            }
            mask.hide().delay(option.animationTime).queue(function (next) {
                lightBox.css('opacity', 0);
                next();
            });
            if (option.onClose) {
                option.onClose();
            }
        };
        this.openBox = function () {
            openBox();
        };
        this.closeBox = function () {
            closeBox();
        };
        closeBtn.click(function () {
            closeBox();
        });
        // mask.height($(document).height());
        lightBox.width(option.width);
        lightBox.height(option.height);
        lightBox.css('top', option.top);
        lightBox.css('left', option.left);
        mask.append(lightBox);
        contentWrapper.append(content);
        lightBox.append(closeBtn);
        lightBox.append(contentWrapper);
        $('body').append(mask);
        element.click(function (e) {
            openBox();
        });
        mask.click(function (e) {
            if (e.pageX > lightBox.offset().left && e.pageX < (lightBox.offset().left + lightBox.outerWidth()) && e.pageY > lightBox.offset().top && e.pageY < (lightBox.offset().top + lightBox.outerHeight())) {
            } else {
                closeBox();
            }
        });
        if ($(this).has('data-rel')) {
            grouping = true;
            var rel = $(this).data('rel');
            for (i = 0; i < allGroupBox[rel].length; i++) {
                if (instance[0] === allGroupBox[rel][i][0]) {
                    currentIndex = i;
                }
            }
        }
        if (grouping) {
            if (currentIndex + 1 < allGroupBoxSize[rel]) {
                lightBox.append(nextButton);
                nextButton.click(function () {
                    closeBox();
                    $(allGroupBox[rel][currentIndex + 1]).click();
                });
            }
            if (currentIndex - 1 >= 0) {
                lightBox.append(perviousButton);
                perviousButton.click(function () {
                    closeBox();
                    $(allGroupBox[rel][currentIndex - 1]).click();
                });
            }
        }
        return this;
    };
}(jQuery));