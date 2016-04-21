(function ($) {
    $.fn.dhostInputBox = function (option) {
        var input = $(this);
        var hints = $('<div class="dib-inputHints"></div>');
        var outerWrapper;
        var icon = $('<div class="dib-icon"></div>');
        var text = $('<div class="dib-text"></div>');
        var html = $('<div class="dib-html"></div>');
        var defaults = {
            'iconClass': '',
            'text': '',
            'textClass': '',
            'html': '',
            'htmlClass': '',
            'hintsClass': '',
            'align': 'top'//top,middle,bottom
        };
        option = $.extend({}, defaults, option);
        text.text(option.text);
        if (option.html.length > 0) {
            hints.append(html);
        } else {
            hints.append(icon);
            hints.append(text);
        }
        hints.click(function () {
            input.focus();
            hints.hide();
        });
        input.wrapAll('<div class="dib-outerWrapper">');
        outerWrapper = input.parent();
        outerWrapper.append(hints);
        outerWrapper.width(input.outerWidth());
        outerWrapper.height(input.outerHeight());
        input.on('resize', function () {
            outerWrapper.width(input.outerWidth());
            outerWrapper.height(input.outerHeight());
        });
        input.blur(function () {
            if ($(this).val().length == 0) {
                hints.show();
            }
        });
        this.destory = function () {
            input.unwrap();
            outerWrapper.remove();
            hints.remove();
        };
        if (option.align == 'top') {
            hints.addClass('top');
        }
        if (option.align == 'middle') {
            hints.addClass('middle');
            text.css('line-height',hints.outerHeight()+'px');
        }
        if (option.align == 'bottom') {
            hints.addClass('bottom');
        }
        if (option.hintsClass.length > 0) {
            hints.addClass(option.hintsClass);
        }
        if (option.iconClass.length > 0) {
            icon.addClass(option.iconClass);
        }
        if (option.textClass.length > 0) {
            text.addClass(option.textClass);
        }
        if (option.htmlClass.length > 0) {
            html.addClass(option.htmlClass);
        }
        return this;
    };
}(jQuery));