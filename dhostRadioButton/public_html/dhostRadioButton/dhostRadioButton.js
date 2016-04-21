//
//{
//'checkedClass':'checked',
//'name':''
//}
//
(function ($) {
    $.fn.dhostRadioButton = function (option) {
        var defaults = {
            'checkedClass': 'checked',
            'name': ''
        };
        option = $.extend({}, defaults, option);
        var checkbox = $(this);
        var value = checkbox.data('value');
        var id = checkbox.attr('id');
        var name = option.name;
        var checkedClass = option.checkedClass;
        var newCheckbox = $('<input type="radio" style="display:none" name="' + name + '" value="' + value + '" id="' + id + '" />');
        checkbox.after(newCheckbox);
        checkbox.click(function () {
            $('input[name=' + name + ']').each(function () {
                $(this).prev().removeClass(checkedClass);
            });
            checkbox.toggleClass(checkedClass);
            newCheckbox.prop('checked', checkbox.hasClass(checkedClass));
        });
    };
}(jQuery));