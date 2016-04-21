(function ($) {
    var path = document.currentScript.src;
    var pluginPath = path.substring(0, path.lastIndexOf('/'));
    $.fn.dhostSpinner = function (option) {
        var defaults = {
        };
        option = $.extend({}, defaults, option);
        var select = $(this);
        var options = $(this).find('option');
        var wrapper = $("<div class='ds-wrapper'></div>");
        var spinner = $("<div class='ds-spinner' style='top:0px'></div>");
        var mousedown = false;
        var optionsTop = new Array();
        var optionHeight;
        var topBeforeDrag = 0;
        select.hide();
        select.after(wrapper);
        wrapper.append(spinner);
//        spinner.append('<div class="ds-item"></div>');//fodder
        options.each(function (index) {
            element = spinner.append('<div class="ds-item" data-value="' + $(this).val() + '">' + $(this).text() + '</div>');
        });
//        spinner.append('<div class="ds-item"></div>');//fodder
        optionsHeight = spinner.find('.ds-item').first().outerHeight();
        spinner.find('.ds-item').each(function (index) {
            optionsTop.push([$(this), $(this).position().top * -1, ($(this).position().top + $(this).outerHeight()) * -1]);
        })
        spinner.on('mousedown', function (e) {
            mousedown = true;
            topBeforeDrag = parseInt(spinner.css('top'));
        });
        this.setValue=function (val) {
            select.val(val);
            options.each(function (index) {
                if ($(this).val() == val) {
                    spinner.css('top', optionsTop[index][1]);
                }
            });
        };
        $(document).on('mousemove', function (e) {
            if (mousedown) {
                var dm = spinner[0];
                var top = topBeforeDrag + (e.pageY - wrapper.offset().top - (wrapper.outerWidth() / 2));

                if (top > optionsTop[0][1] - (optionsTop[1][1] / 2)) {
                    dm.style.top = 0 + 'px';
                } else if (top < optionsTop[optionsTop.length - 1][1] + (optionsTop[1][1] / 2)) {
                    dm.style.top = optionsTop[optionsTop.length - 1][1] + 'px';
                } else {
                    dm.style.top = top + 'px';
                }
            }
        });
        $(document).on('mouseup', function (e) {
            if (mousedown) {
                mousedown = false;
            }
            setTimeout(function () {
                for (i = 0; i < optionsTop.length; i++) {
                    if (Math.abs(parseInt(spinner.css('top'), 10)) > Math.abs(optionsTop[i][1]) && Math.abs(parseInt(spinner.css('top'), 10)) < Math.abs(optionsTop[i][2])) {
                        spinner.css('top', optionsTop[i][1]);
                        select.val($(options.get(i)).val());
                        break;
                    }
                }
            }, 1000);
        });
        return this;
    };
}(jQuery));