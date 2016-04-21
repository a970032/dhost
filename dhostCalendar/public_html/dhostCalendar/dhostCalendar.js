(function ($) {
    var path = document.currentScript.src;
    var pluginPath = path.substring(0, path.lastIndexOf('/'));
    var title = $('<div class="title"></div>');
    var yearMonth = $('<div class="yearMonth"></div>');
    var week = $('<div class="week"></div>');
    var day = $('<div class="day"></div>');
    var dayMask = $('<div class="mask"></div>');
    var dayView = $('<div class="dayView"></div>');
    var dvWrapper = $('<div class="dv-wrapper"></div>');
    var eventMask = $('<div class="mask"></div>');
    var eventView = $('<div class="eventView"></div>');
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1;
    var dayViewItemHeight = 0;
    var eventList = {};
    var originalEvent;
    var option;
    $.fn.dhostCalendar = function (option) {
        var defaults = {
            weekArray: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            title: '',
            'event': [],
            'timeZone': '8', //GMT+8=>8,GMT-8=>-8
            'next': '', //selector of next month button
            'perv': ''//selector of pervious month button
        };
        /*event Format:
         * [{'startDateTime': '15-02-2016 00:00:00',
         'endDateTime': '17-02-2016 10:00:00',
         'name': 'good2',
         'color': '#ff0000',
         'note': '<iframe width="100%" height="315" src="https://www.youtube.com/embed/_C-GOWGUPhc" frameborder="0" allowfullscreen></iframe><br />Good<br />Good<br />Good<br />Good<br />Good<br />Good<br />Good'}]*/
        option = $.extend({}, defaults, option);
        originalEvent = option.event;
        var calendar = $(this);
        calendar.addClass('dc-wrapper');
        calendar.append(title);
        title.text(option.title);
        calendar.append(yearMonth);
        yearMonth.text(new Date().toJSON().slice(0, 7));
        calendar.append(week);
        for (i = 0; i < option.weekArray.length; i++) {
            week.append('<div class="weekItem">' + option.weekArray[i] + '</div>');
        }
        calendar.append(day);
        parseEvent(option.event);
        calendar.append(dayMask);
        dayMask.append(dayView);
        dayMask.click(function (e) {
            if (e.pageX > dayView.offset().left && e.pageX < (dayView.offset().left + dayView.outerWidth()) && e.pageY > dayView.offset().top && e.pageY < (dayView.offset().top + dayView.outerHeight())) {
            } else {
                dayMask.hide();
            }
        });
        dayView.append(dvWrapper);
        for (i = 0; i < 24; i++) {
            dvWrapper.append('<div class="dayViewItem" data-index=' + (i) + '>' + (i) + ':00</div>');
        }
        calendar.append(eventMask);
        eventMask.append(eventView);
        eventMask.click(function (e) {
            if (e.pageX > eventView.offset().left && e.pageX < (eventView.offset().left + eventView.outerWidth()) && e.pageY > eventView.offset().top && e.pageY < (eventView.offset().top + eventView.outerHeight())) {
            } else {
                eventMask.hide();
            }
        });
        dayViewItemHeight = dvWrapper.find('.dayViewItem').height();
        this.changeMonth = function (month, year) {
            changeMonth(month, year, option);
            currentMonth = month;
            currentYear = year;
        };
        changeMonth(currentMonth, currentYear, option);
//        calendar.on('mousewheel', function (e) {
//            if (e.originalEvent.wheelDelta > 0) {
//                changeMonth(--currentMonth, currentYear, option);
//            } else {
//                changeMonth(++currentMonth, currentYear, option);
//            }
//        });
        this.nextMonth = function () {
            changeMonth(++currentMonth, currentYear, option);
        };
        this.pervMonth = function () {
            changeMonth(--currentMonth, currentYear, option);
        };
        if (option.next) {
            $(option.next).click(this.nextMonth);
        }
        if (option.perv) {
            $(option.perv).click(this.pervMonth);
        }
        this.openDay = function (day) {
            openDay(day);
        };
        this.closeDay=function(){
            closeDay();
        };
        this.openEvent = function (index) {
            openEvent(index);
        };
        this.closeEvent=function(){
            closeEvent();
        };
        function parseEvent(array) {

            for (j = 1; j <= 12; j++) {
                var totalDays = getDaysInMonth(j, currentYear);
                for (i = 1; i <= totalDays; i++) {
                    eventList[i + '-' + j + '-' + currentYear] = [];
                }
            }
            for (i = 0; i < array.length; i++) {
                var startDateTime = getDate(array[i].startDateTime);
                var endDateTime = getDate(array[i].endDateTime);
                var name = array[i].name;
                var color = array[i].color;
                for (var z = 1; z <= 12; z++) {
                    var totalDays = getDaysInMonth(z, currentYear);
                    for (var j = 1; j <= totalDays; j++) {
                        var currentStartDate = getDate(j + "-" + z + "-" + currentYear + " 00:00:00");
                        var currentEndDate = getDate(j + "-" + z + "-" + currentYear + " 23:59:59");
                        if (startDateTime.toJSON().slice(0, 10) == endDateTime.toJSON().slice(0, 10) && startDateTime.toJSON().slice(0, 10) == currentStartDate.toJSON().slice(0, 10)) { //event on same day
                            eventList[j + '-' + z + '-' + currentYear].push({
                                name: name,
                                startTime: startDateTime.getHours() + ":" + startDateTime.getMinutes() + ":" + startDateTime.getSeconds(),
                                endTime: endDateTime.getHours() + ":" + endDateTime.getMinutes() + ":" + endDateTime.getSeconds(),
                                across: false,
                                color: color,
                                nextHas: true,
                                prevHas: false,
                                eventIndex: i
                            });
                        } else if (currentStartDate.getTime() >= startDateTime.getTime() && currentEndDate.getTime() <= endDateTime.getTime() && currentStartDate.getTime() <= endDateTime.getTime()) {
                            eventList[j + '-' + z + '-' + currentYear].push({
                                name: name,
                                startTime: startDateTime.getHours() + ":" + startDateTime.getMinutes() + ":" + startDateTime.getSeconds(),
                                endTime: 23 + ":" + 59 + ":" + 59,
                                across: true,
                                color: color,
                                nextHas: true,
                                prevHas: true,
                                eventIndex: i
                            });
                        } else if (currentEndDate.toJSON().slice(0, 10) == endDateTime.toJSON().slice(0, 10)) {
                            eventList[j + '-' + z + '-' + currentYear].push({
                                name: name,
                                startTime: 00 + ":" + 00 + ":" + 00,
                                endTime: endDateTime.getHours() + ":" + endDateTime.getMinutes() + ":" + endDateTime.getSeconds(),
                                across: false,
                                color: color,
                                nextHas: false,
                                prevHas: true,
                                eventIndex: i
                            });
                        }
                    }
                }
//            console.log(eventList);
            }
        }
        function getDate(dateString) {
            var startDateArray = dateString.split(" ");
            var startDate = startDateArray[0].split("-");
            var startTime = startDateArray[1].split(":");
            var dateTime = new Date();
            dateTime.setMonth(startDate[1] - 1);
            dateTime.setDate(startDate[0]);
            dateTime.setFullYear(startDate[2]);
//        dateTime.setHours(parseInt(startTime[0]));
            dateTime.setHours(parseInt(startTime[0]) - Math.abs(dateTime.getTimezoneOffset() / 60) + (option.timeZone));
            dateTime.setMinutes(startTime[1]);
            dateTime.setSeconds(startTime[2]);
            return dateTime;
        }
        function getDaysInMonth(month, year) {
            // Here January is 1 based  
            //Day 0 is the last day in the previous month  
            return new Date(year, month, 0).getDate();
// Here January is 0 based  
// return new Date(year, month+1, 0).getDate();  
        }
        function changeMonth(month, year, option) {
            firstWeekPos = week.first().offset();
            //day
            day.empty();
            var totalDays = getDaysInMonth(month, year);
            var temp = [];
            for (i = 0; i < totalDays; i++) {
                temp.push(i + 1);
            }
            totalDays = temp;
            var startDay = new Date();
            startDay.setFullYear(year);
            startDay.setMonth(month - 1);
            startDay.setDate(1);
            yearMonth.text(startDay.toJSON().slice(0, 7));
            var startDay = startDay.getDay();
            var index = 0;
            for (i = 0; i < startDay; i++, index++) {
                day.append('<div class="dayItem empty" data-index="' + index + '"></div>');
            }
            for (i = 1; i <= totalDays.length; i++, index++) {
                var event = $('<div class="event"></div>');
                var thisDay = $('<div class="dayItem dayItem' + i + '" data-date="' + i + '-' + month + '-' + year + '" data-index="' + index + '"><div class="title">' + i + '</div></div>');
                if ((index + 1) % 7 == 0) {
                    thisDay.addClass('last');
                } else if ((index) % 7 == 0) {
                    thisDay.addClass('first');
                }
                thisDay.find('.title').click(function () {
                    openDay($(this).parent().data('index'));
                });
                day.append(thisDay);
                thisDay.append(event);
                if (eventList[i + '-' + month + '-' + year]) {
                    var thisDayEvent = eventList[i + '-' + month + '-' + year];
                    for (j = 0; j < thisDayEvent.length; j++) {
                        var eventItem = $('<div class="eventItem" data-eventindex="' + thisDayEvent[j].eventIndex + '">' + thisDayEvent[j].name + '</div>');
                        if (thisDayEvent[j].across == true) {
                            eventItem.addClass("across");
                        }
                        if (thisDayEvent[j].continue == true) {
                            eventItem.addClass("continue");
                        }
                        if (thisDayEvent[j].color) {
                            eventItem.css('background', thisDayEvent[j].color);
                        }
                        eventItem.click(function () {
                            console.log($(this).data('eventindex'));
                            openEvent($(this).data("eventindex"));
                        });
                        event.append(eventItem);
                    }
                }
            }
            //event

        }
        function openDay(day) {
            var thisDayEvent = eventList[day + '-' + currentMonth + '-' + currentYear];
            dayMask.show();
            $('.dayEventItem').remove();
            for (var i = 0; i < thisDayEvent.length; i++) {
                var event = thisDayEvent[i];
                var element = $('<div class="dayEventItem">' + event.name + '</div>');
                var startTime = event.startTime.split(":");
                var endTime = event.endTime.split(":");
                element.css('top', dvWrapper.find('[data-index=' + parseInt(startTime[0]) + ']').position().top);
                if (parseInt(startTime[1]) > 0) {
                    element.css('top', '+=' + ((parseInt(startTime[1]) / 60) * (dayViewItemHeight / 60)));
                }
                if (parseInt(endTime[0]) > parseInt(startTime[0])) {
                    element.css('height', dvWrapper.find('[data-index=' + parseInt(endTime[0]) + ']').position().top + dayViewItemHeight);
                }
                if (event.color) {
                    element.css('background', event.color);
                }
                if (thisDayEvent.length > 1) {
                    element.css('width', 90 / thisDayEvent.length + '%');
                }
                if (i >= 1) {
                    element.css('left', (90 / thisDayEvent.length * i) + '%');
                }
                dvWrapper.append(element);
            }
//        console.log(dvWrapper.find('[data-index=' + parseInt(endTime[0]) + ']').position(), dayViewItemHeight);
        }
        function closeDay(){
            dayMask.hide();
        }
        function openEvent(index) {
            var thisDayEvent = originalEvent[index];
            console.log(index, originalEvent);
            eventMask.show();
            $('.eventView').empty();
            $('.eventView').html("Name: " + thisDayEvent.name + "<br />\n\
Start Date Time: " + thisDayEvent.startDateTime + "<br />\n\
End Date Time: " + thisDayEvent.endDateTime + "<br />");
            if (thisDayEvent.note) {
                $('.eventView').html($('.eventView').html() + thisDayEvent.note);
            }
        }
        function closeEvent(){
            eventMask.hide();
        }
        return this;
    };
}(jQuery));