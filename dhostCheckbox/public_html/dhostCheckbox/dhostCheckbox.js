//
//{
//'checkedClass':'checked'
//}
//
(function ($) {
    $.fn.dhostCheckbox = function (option) {
        var defaults = {
            'checkedClass': 'checked'
        };
        option = $.extend({}, defaults, option);
        var checkbox = $(this);
        var value = checkbox.data('value');
        var id = checkbox.attr('id');
        var name = id;
        var checkedClass = option.checkedClass;
        var newCheckbox = $('<input type="checkbox" style="display:none" name="' + name + '" value="' + value + '" id="' + id + '" />');
        checkbox.after(newCheckbox);
        checkbox.click(function () {
            checkbox.toggleClass(checkedClass);
            newCheckbox.prop('checked', checkbox.hasClass(checkedClass));
        });
    };
}(jQuery));