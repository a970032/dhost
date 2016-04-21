(function ($) {
    var path = document.currentScript.src;
    var pluginPath = path.substring(0, path.lastIndexOf('/'));
    $.fn.dhostVideo = function (option) {
        var defaults = {
            'controls': true,
            volume: 50, //0-100
            startTime: 0,
            autoStart: false
        };
        option = $.extend({}, defaults, option);
        var video = $(this);
        video.wrap('<div class="dv-Wrapper">');
        var wrapper = $(this).parent();
        var playing = false;
        var play = $("<div class='play'><div class='play1'></div><div class='play2'></div></div>");
        var controls = $('<div class="dv-controls"></div>');
        var timeline = $('<div class="timeline"></div>');
        var timelineball = $('<div class="timeline-ball"></div>');
        var time = $('<div class="time">00:00/00:00</div>');
        var volumeWrapper = $('<div class="volume-wrapper"></div>');
        var volumeIcon = $('<div class="volume-icon"></div>');
        var volumeBarWrapper = $('<div class="volume-bar-wrapper"></div>')
        var volumeBar = $('<div class="volume-bar"></div>');
        var volumeScale = $('<div class="volume-scale"></div>');
        var ballmousedown = false;
        var volmousedown = false;
        var lastVolume = 0;
        volumeWrapper.append(volumeIcon);
        volumeBarWrapper.append(volumeScale);
        volumeBarWrapper.append(volumeBar);
        volumeWrapper.append(volumeBarWrapper);
        controls.append(play);
        controls.append(time);
        controls.append(volumeWrapper);
        wrapper.append(timeline);
        wrapper.append(timelineball);
        $(this).click(function () {
            $(play).click();
        });
        $(this).dblclick(function () {
            if (wrapper.hasClass('fullScreen')) {
                wrapper.removeClass('fullScreen');
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            } else {
                wrapper.addClass('fullScreen');
                if (wrapper[0].requestFullscreen) {
                    wrapper[0].requestFullscreen();
                } else if (wrapper[0].msRequestFullscreen) {
                    wrapper[0].msRequestFullscreen();
                } else if (wrapper[0].mozRequestFullScreen) {
                    wrapper[0].mozRequestFullScreen();
                } else if (wrapper[0].webkitRequestFullscreen) {
                    wrapper[0].webkitRequestFullscreen();
                }
            }
        });
        $(this).on("loadedmetadata", function () {
            wrapper.width(video[0].videoWidth);
            wrapper.height(video[0].videoHeight);
            if (option.controls == true) {
                wrapper.append(controls);
            }
            time.text("00:00/" + formatTime(this.duration));
            if (option.autoStart == true) {
                $(play).click();
            }
            volumeScale.css('left', option.volume + '%');
            video[0].volume = option.volume / 100;
            lastVolume = video[0].volume;
            if (option.startTime > 0) {
                video[0].currentTime = option.startTime;
                timelineball[0].style.left = 'calc(' + ((this.currentTime / this.duration) * 100) + '% - ' + timelineball.width() + 'px)';
                time.text(formatTime(video[0].currentTime) + "/" + formatTime(video[0].duration));
            }
        });
        timelineball.on('mousedown', function (e) {
            ballmousedown = true;
        });
        volumeScale.on('mousedown', function (e) {
            volmousedown = true;
        });
        $(document).on('mousemove', function (e) {
            if (ballmousedown) {
                var dm = timelineball[0];
                var left = (e.clientX - timeline.offset().left);
                if (left < 0 || left > video.outerWidth() - timelineball.outerWidth()) {
                    return;
                }
                dm.style.left = left + 'px';
                var percentage = (left / timeline.width());
                var moveTime = (percentage * video[0].duration).toFixed(2);
                time.text(formatTime(moveTime) + "/" + formatTime(video[0].duration));
                if (playing) {
                    $(play).click();
                }
            }
            if (volmousedown) {
                var dm = volumeScale[0];
                var left = (e.clientX - volumeBar.offset().left);
                if (left < 0 || left > volumeBar.outerWidth() - volumeScale.outerWidth()) {
                    return;
                }
                dm.style.left = left + 'px';
                var percentage = (left / volumeBar.outerWidth());
                video[0].volume = percentage;
            }
        });
        $(document).on('mouseup', function (e) {
            if (ballmousedown) {
                ballmousedown = false;
                var left = (parseInt(timelineball[0].style.left, 10));
                var percentage = (left / timeline.width());
                video[0].currentTime = (percentage * video[0].duration).toFixed(2);
            }
            if (volmousedown) {
                volmousedown = false;
            }
        });
        $(volumeIcon).click(function (e) {
            if (video[0].volume > 0) {
                lastVolume = video[0].volume;
                video[0].volume = 0;
                volumeScale.css('left', '0');
                $(this).addClass("off");
            } else {
                video[0].volume = lastVolume;
                volumeScale.css('left', (video[0].volume * 100) + '%');
                $(this).removeClass("off");
            }
        });
        $(video)[0].addEventListener("timeupdate", function (event) {
            time.text(formatTime(this.currentTime) + "/" + formatTime(this.duration));
            timelineball[0].style.left = 'calc(' + ((this.currentTime / this.duration) * 100) + '% - ' + timelineball.width() + 'px)';
        }, false);

        $(video)[0].addEventListener("ended", function (event) {
            $(play).click();
        }, false);

        $(timeline).click(function (e) {
            var percentage = (e.offsetX / timeline.width());
            video[0].currentTime = (percentage * video[0].duration).toFixed(2);
        });

        $(play).click(function () {
            if (playing) {
                $(play).removeClass('playing');
                playing = false;
                video[0].pause();
            } else {
                $(play).addClass('playing');
                playing = true;
                video[0].play();
            }
        });
        return this;
    };
    function formatTime(second) {
        var min = second / 60;
        var hr = min / 60;
        var second2 = second % 60;

        if (Math.round(hr) > 0) {
            return pad(Math.round(hr), 2, 0) + ":" + pad(Math.round(min), 2, 0) + ":" + pad(Math.round(second2), 2, 0);
        } else {
            return pad(Math.round(min), 2, 0) + ":" + pad(Math.round(second2), 2, 0);
        }
    }
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}(jQuery));