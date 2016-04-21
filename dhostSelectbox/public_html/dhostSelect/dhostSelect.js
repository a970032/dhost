(function ($) {
    $.fn.dhostSelect = function (option2) {
        var select = $(this);
        var options = select.find('option');
        var wrapper = $('<div class="dhostSelect-wrapper"></div>');
        var optionWrapper = $('<div class="dhostSelect-optionWrapper"></div>');
        var option = $('<div class="dhostSelect-option"><div class="dhostSelect-optionIcon"></div><div class="dhostSelect-optionText"></div></div>');
        var selected = $('<div class="dhostSelect-selected"><div class="dhostSelect-optionIcon"></div><div class="dhostSelect-optionText"></div></div>')
        var icon = $('<div class="dhostSelect-icon"></div>')
        var totalHeight = 0;
        var defaults = {
            'wrapperClass': '',
            'align': 'top'//top,middle,bottom
        };
        option2 = $.extend({}, defaults, option2);
        if (option2.wrapperClass) {
            wrapper.addClass(option2.wrapperClass);
        }
        if (option2.align == 'top') {
            option.addClass('top');
            selected.addClass('top');
        }
        if (option2.align == 'middle') {
            option.addClass('middle');
            selected.addClass('middle');
        }
        if (option2.align == 'bottom') {
            option.addClass('bottom');
            selected.addClass('bottom');
        }
        options.each(function (index) {
            if (index == 0) {
                selected.data('value', $(this).val());
                selected.find('.dhostSelect-optionText').text($(this).text());
                wrapper.append(selected);
                if ($(this).data('image')) {
                    selected.find('.dhostSelect-optionIcon').css('background-image', 'url(' + $(this).data('image') + ')');
                }
            }
            var newoption = option.clone();
            if ($(this).data('image')) {
                newoption.find('.dhostSelect-optionIcon').css('background-image', 'url(' + $(this).data('image') + ')');
            }
            newoption.data('value', $(this).val());
            newoption.find('.dhostSelect-optionText').text($(this).text());
            newoption.click(function () {
                optionClicked($(this));
            });
            optionWrapper.append(newoption);
        });
        select.hide();
        selected.click(function () {
            toogleMenu();
        });
        icon.click(function () {
            toogleMenu();
        });
        wrapper.append(icon);
        wrapper.append(optionWrapper);
        $(this).after(wrapper);
        optionWrapper.find('.dhostSelect-option').each(function () {
            totalHeight += $(this).outerHeight();
        });
        this.destory = function () {
            wrapper.remove();
            select.show();
        };
        function toogleMenu() {
            if (wrapper.hasClass('opened')) {
                wrapper.removeClass('opened');
                optionWrapper.css('max-height', 0);
            } else {
                optionWrapper.css('max-height', totalHeight);
                wrapper.addClass('opened');
            }
        }
        function optionClicked(clickedOption) {
            select.find('option[value=' + clickedOption.data('value') + ']').prop('selected', true);
            selected.data('value', clickedOption.val());
            selected.find('.dhostSelect-optionText').text(clickedOption.text());
            if (clickedOption.data('image')) {
                selected.find('.dhostSelect-optionIcon').css('background-image', 'url(' + clickedOption.data('image') + ')');
            }
            toogleMenu();
        }
        return this;
    };
}(jQuery));