(function ($) {
    $.fn.dhostSlider = function (option) {
        var defaults = {
            'right': '',
            'left': '',
            'dot': false,
            'wrapper': '.wrapper',
            'selector': 'img',
            'autoMove': false,
            'interval': 1000,
            'repeat': true,
            'vertical': false,
            'top': '',
            'bottom': '',
            'animationTime': 500,
            'onClick': function (element, index) {
                console.log(element);
            },
            'thumbnailList': false,
            'moveFixed': 100,
            'keepRepeat': false,
            'hideArrow': false,
            'includeMargin': true
        };
        //public function goTo(index)
        var option = $.extend({}, defaults, option);
        var slider = $(this);
        var thisSlider = this;
        var right = option.right;
        var left = option.left;
        var top = option.top;
        var bottom = option.bottom;
        var vertical = option.vertical;
        var needDot = option.dot;
        var wrapper = slider.find(option.wrapper);
        var animating = false;
        var selector = option.selector;
        var itemSize = slider.outerWidth(true);
        var itemSizeHeight = slider.outerHeight(true);
        var itemCount = wrapper.find(selector).size();
        var animationTime = option.animationTime;
        var visibleCount = Math.floor(slider.outerWidth(true) / itemSize);
        var visibleCountHeight = Math.floor(slider.outerHeight(true) / itemSize);
        var currentIndex = 0;
        var wrapperWidth = 0;
        var wrapperHeight = 0;
        var interval;
        if (vertical == true) {
            slider.addClass('vertical');
        }
        if (option.thumbnailList == true) {
            itemSize = option.moveFixed;
            itemSizeHeight = option.moveFixed;
        }

        if (option.repeat == false && option.hideArrow == true) {
            $(option.left).hide();
        }
        if (needDot === true) {
            var dotWrapper = $('<div class="dotWrapper"></div>');
        }
        wrapper.find(selector).each(function (index) {
            var element = $(this);
            $(this).click(function () {
                console.log('clicked');
                option.onClick(element, index);
            });
//            if (option.thumbnailList == false) {
            if (vertical == false) {
                if (option.thumbnailList == false) {
                    wrapperWidth += $(this).outerWidth(option.includeMargin);
//                    wrapperWidth += slider.outerWidth(option.includeMargin);
                    console.log(wrapperWidth);
                    $(this).css('max-width', slider.outerWidth(false));
                } else {
                    wrapperWidth += $(this).outerWidth(true);
                }
            } else {
                if (option.thumbnailList == false) {
                    wrapperHeight += slider.outerHeight(option.includeMargin);
                    $(this).height(slider.outerHeight(option.includeMargin));
                } else {
                    wrapperHeight += $(this).outerHeight(true);
                }
            }
//            }
            if (needDot === true) {
                var dot = $('<a class="dot" href="javascript:;" data-index="' + index + '"></a>');
                if (index == 0) {
                    dot.addClass('selected');
                }
                dot.click(function () {
                    goTo(dot.data('index'), true);
                });
                dotWrapper.append(dot);
            }
        });
        if (needDot === true) {
            slider.append(dotWrapper);
        }
//        if (option.thumbnailList == false) {
        if (vertical == false) {
            wrapper.width(wrapperWidth);
        } else {
            wrapper.height(wrapperHeight);
        }
//        }
        this.updateMove = function (size) {
            itemSize = size;
            itemSizeHeight = size;
        };
        this.destory = function () {
            wrapper.attr('style', '');
            slider.find(selector).attr('style', '');
            if (needDot) {
                dotWrapper.find('.dot').unbind();
                dotWrapper.remove();
            }
            if ($(right).size() > 0) {
                $(right).unbind();
            }
            if ($(left).size() > 0) {
                $(left).unbind();
            }
            if ($(top).size() > 0) {
                $(top).unbind();
            }
            if ($(bottom).size() > 0) {
                $(bottom).unbind();
            }
            console.log("clear:"+interval);
            clearInterval(interval);

        };
        this.goTo = function (index) {
            goTo(index);
        };
        this.goToFirst = function () {
            goToFirst();
        };
        this.goToLast = function () {
            goToLast();
        };
        this.isLast = function () {
            return isLast();
        };
        this.moveRight = function (ClearInterval) {
            if (animating === false) {
                if (option.preMove) {
                    option.preMove(currentIndex, 'right');
                }
                animating = true;
                var calculate = Math.abs((parseInt(wrapper.css('left')) - itemSize)) >= wrapper.outerWidth(true);
                if (option.thumbnailList == true) {
                    calculate = Math.abs((parseInt(wrapper.css('left')) - itemSize)) + slider.outerWidth() >= wrapper.outerWidth(true);
                }
                if (option.thumbnailList == true && option.keepRepeat == false || (option.thumbnailList == false && option.keepRepeat == false)) {
                    if (calculate) {
                        if (option.repeat === true) {
                            currentIndex = 0;
                            wrapper.css('left', "0");
                            if (needDot) {
                                dotWrapper.find('.selected').removeClass('selected');
                                dotWrapper.find('.dot').first().addClass('selected');
                            }
                        }
                    } else {
                        currentIndex++;
                        lastThumb = slider.find(selector).last();
                        if (option.thumbnailList == true) {
                            if ((Math.abs(parseInt(wrapper.css('left'))) + (itemSize) + slider.outerWidth() > lastThumb.position().left)) {
                                if (Math.abs(parseInt(wrapper.css('left'))) + (itemSize) + slider.outerWidth() - lastThumb.position().left < lastThumb.outerWidth()) {
                                    wrapper.css('left', ((lastThumb.position().left + lastThumb.outerWidth(true)) - slider.outerWidth()) * -1);
                                } else {
                                    wrapper.css('left', 0);
                                }
                                console.log('last');
                            } else {
                                wrapper.css('left', "-=" + itemSize);
                            }
                        } else {
                            wrapper.css('left', "-=" + itemSize);
                        }
                        if (needDot) {
                            dotWrapper.find('.selected').removeClass('selected').next().addClass('selected');
                        }
                    }
                } else {
                    currentIndex++;
                    wrapper.css('left', "-=" + itemSize);
                    var lastSecond = wrapper.find(selector).last().prev();
                    var calculate = Math.abs(lastSecond.outerWidth(false) - (Math.round(lastSecond.position().left) - Math.abs(parseInt(wrapper.css('left')))));
                    if (calculate <= 5) {
                        var offset = (Math.round(lastSecond.position().left) - Math.abs(parseInt(wrapper.css('left')))) / lastSecond.outerWidth(false);
                        var left = parseInt(wrapper.css('left')) - itemSize;
                        wrapper.css('transform', 'translateX(' + Math.abs(offset * left) + 'px)');
                        setTimeout(function () {
                            wrapper.addClass('noAn');
                            wrapper.css('transform', 'none');
                            wrapper.css('left', 0);
                            setTimeout(function () {
                                wrapper.removeClass('noAn');
                            }, animationTime);
//                                    wrapper.toggleClass('noAn');
                        }, animationTime);
                    }
                }
                if (ClearInterval) {
                    clearInterval(interval);
                }
                setTimeout(function () {
                    animating = false;
                    if (option.postMove) {
                        option.postMove(currentIndex, 'right');
                    }
                    if (option.repeat == false) {
                        if (option.hideArrow == true) {
                            if (currentIndex == itemCount - 1) {
                                $(right).hide();
                                $(option.left).show();
                            } else {
                                $(right).show();
                                $(option.left).show();
                            }
                        }
                    }
                }, animationTime);
            }
        };
        this.moveLeft = function (ClearInterval) {

            if (animating === false) {
                if (option.preMove) {
                    option.preMove(currentIndex, 'left');
                }
                animating = true;
                firstThumb = slider.find(selector).first();
                lastThumb = slider.find(selector).last();
                if (option.thumbnailList == true && option.keepRepeat == false || (option.thumbnailList == false && option.keepRepeat == false)) {
                    if ((parseInt(wrapper.css('left')) + itemSize) > 0) {
                        if (option.repeat === true) {
                            currentIndex = itemCount - 1;
                            if (option.thumbnailList == true) {
                                wrapper.css('left', ((lastThumb.position().left + lastThumb.outerWidth(true)) - slider.outerWidth()) * -1);
                            } else {
                                wrapper.css('left', (wrapper.outerWidth(true) - itemSize) * -1);
                            }
                            if (needDot) {
                                dotWrapper.find('.selected').removeClass('selected');
                                dotWrapper.find('.dot').last().addClass('selected');
                            }
                        }
                    } else {
                        currentIndex--;
                        if (option.thumbnailList == true && option.keepRepeat == false) {
                            if (parseInt(wrapper.css('left')) + (itemSize) > (itemSize) * -1) {
                                wrapper.css('left', 0);
                                console.log('first');
                            } else {
                                wrapper.css('left', "+=" + itemSize);
                            }
                        } else {
                            wrapper.css('left', "+=" + itemSize);
                        }
                        if (needDot) {
                            dotWrapper.find('.selected').removeClass('selected').prev().addClass('selected');
                        }
                    }
                } else {
                    currentIndex--;
                    wrapper.css('left', "+=" + itemSize);
                    var firstSecond = wrapper.find(selector).first().next();
                    var lastSecond = wrapper.find(selector).last().prev();
                    var calculate = Math.abs(firstSecond.outerWidth(false) - (Math.ceil(firstSecond.position().left) - Math.abs(parseInt(wrapper.css('left')))));
                    if (calculate <= 5) {
                        var offset = (firstSecond.position().left - Math.abs(parseInt(wrapper.css('left')))) / firstSecond.outerWidth(false);
                        var left = parseInt(wrapper.css('left')) + itemSize;
                        wrapper.css('transform', 'translateX(' + Math.abs(offset * left) + 'px)');
                        setTimeout(function () {
                            var left2 = ($(lastSecond).position().left - lastSecond.outerWidth(false)) * -1;
                            wrapper.addClass('noAn');
                            wrapper.css('transform', 'none');
                            wrapper.css('left', left2);
                            setTimeout(function () {
                                wrapper.removeClass('noAn');
                            }, animationTime);
//                                    wrapper.toggleClass('noAn');
                        }, animationTime);
                    }
                }
                if (ClearInterval) {
                    clearInterval(interval);
                }
                setTimeout(function () {
                    animating = false;
                    if (option.postMove) {
                        option.postMove(currentIndex, 'left');
                    }
                    if (option.repeat == false) {
                        if (option.hideArrow == true) {
                            if (currentIndex == 0) {
                                $(option.left).hide();
                                $(right).show();
                            } else {
                                $(option.left).show();
                                $(right).show();
                            }
                        }
                    }
                }, animationTime);
            }
        };
        this.moveTop = function (ClearInterval) {
            if (animating == false) {
                if (option.preMove) {
                    option.preMove(currentIndex, 'top');
                }
                animating = true;

                firstThumb = slider.find(selector).first();
                lastThumb = slider.find(selector).last();
                if ((parseInt(wrapper.css('top')) + itemSizeHeight) > 0) {
                    if (option.repeat === true) {
                        currentIndex = itemCount - 1;
                        if (option.thumbnailList == true) {
                            wrapper.css('top', ((lastThumb.position().top + lastThumb.outerHeight(true)) - slider.outerHeight()) * -1);
                        } else {
                            wrapper.css('top', (wrapper.outerHeight(true) - itemSizeHeight) * -1);
                        }
                        if (needDot) {
                            dotWrapper.find('.selected').removeClass('selected');
                            dotWrapper.find('.dot').last().addClass('selected');
                        }
                    }
                    if (option.thumbnailList == true) {
                        goToFirst();
                    }
                } else {
                    currentIndex--;
                    if (option.thumbnailList == true && option.keepRepeat == false) {
                        if (parseInt(wrapper.css('top')) + (itemSize) > (itemSize) * -1) {
                            wrapper.css('top', 0);
                            console.log('first');
                        } else {
                            wrapper.css('top', "+=" + itemSize);
                        }
                    } else {
                        wrapper.css('top', "+=" + itemSizeHeight);
                    }
                    if (needDot) {
                        dotWrapper.find('.selected').removeClass('selected').prev().addClass('selected');
                    }
                }
                if (ClearInterval) {
                    clearInterval(interval);
                }
                setTimeout(function () {
                    animating = false;
                    if (option.postMove) {
                        option.postMove(currentIndex, 'top');
                    }
                }, animationTime);
            }
        };
        this.moveBottom = function (ClearInterval) {

            if (animating == false) {
                if (option.preMove) {
                    option.preMove(currentIndex, 'bottom');
                }
                lastThumb = slider.find(selector).last();
                animating = true;
                var calculate = Math.abs((parseInt(wrapper.css('top')) - itemSizeHeight)) >= wrapper.outerHeight(true);
                if (option.thumbnailList == true) {
                    calculate = Math.abs((parseInt(wrapper.css('top')) - itemSizeHeight)) + slider.outerHeight() >= wrapper.outerHeight(true);
                }
                if (calculate) {
                    if (option.repeat === true) {
                        wrapper.css('top', "0");
                        currentIndex = 0;
                        if (needDot) {
                            dotWrapper.find('.selected').removeClass('selected');
                            dotWrapper.find('.dot').first().addClass('selected');
                        }
                    } else if (option.thumbnailList) {
                        goToLast();
                    }
                } else {
                    if (Math.abs(parseInt(wrapper.css('top'))) + (itemSizeHeight) + slider.outerHeight() + lastThumb.outerHeight() > lastThumb.position().top + lastThumb.outerHeight()) {
                        wrapper.css('top', (wrapper.outerHeight() - slider.outerHeight()) * -1);
                    } else {
                        wrapper.css('top', "-=" + itemSizeHeight);
                    }
                    currentIndex++;
                    if (needDot) {
                        dotWrapper.find('.selected').removeClass('selected').next().addClass('selected');
                    }
                }
                if (ClearInterval) {
                    clearInterval(interval);
                }
                setTimeout(function () {
                    animating = false;
                    if (option.postMove) {
                        option.postMove(currentIndex, 'bottom');
                    }
                }, animationTime);
            }
        };
        if (vertical == false) {
            if ($(right).size() > 0) {
                $(right).click(function () {
                    thisSlider.moveRight(true);
                });
            }
            if ($(left).size() > 0) {
                $(left).click(function () {
                    thisSlider.moveLeft(true);
                });
            }
        } else {
            if ($(top).size() > 0) {
                $(top).click(function () {
                    thisSlider.moveTop(true);
                });
            }
            if ($(bottom).size() > 0) {
                $(bottom).click(function () {
                    thisSlider.moveBottom(true);
                });
            }
        }
        if (option.autoMove === true) {
            clearInterval(interval);
            interval = setInterval(function () {
                thisSlider.moveRight(false);
//                if (currentIndex + 1 < itemCount) {
            }, option.interval);
            console.log("set:"+interval);
        }
        swipedetect(wrapper.get(0), function (swipedir) {
            clearInterval(interval);
            if (vertical == false) {
                if (swipedir == 'left') {
                    thisSlider.moveRight(true);
//                        goTo(currentIndex + 1, true);
                } else if (swipedir == 'right') {
                    thisSlider.moveLeft(true);
//                        goTo(currentIndex - 1, true);
                }
            } else {
                if (swipedir == 'down') {
                    thisSlider.moveTop(true);
//                        goTo(currentIndex + 1, true);
                } else if (swipedir == 'up') {
                    thisSlider.moveBottom(true);
//                        goTo(currentIndex - 1, true);
                }
            }
        });
        function swipedetect(el, callback) {

            var touchsurface = el,
                    swipedir,
                    startX,
                    startY,
                    distX,
                    distY,
                    threshold = 70, //required min distance traveled to be considered swipe
                    restraint = 500, // maximum distance allowed at the same time in perpendicular direction
                    allowedTime = 1000, // maximum time allowed to travel that distance
                    elapsedTime,
                    startTime,
                    handleswipe = callback || function (swipedir) {
                    };
            if (touchsurface) {

                touchsurface.addEventListener('touchstart', function (e) {
                    var touchobj = e.changedTouches[0]
                    swipedir = 'none'
                    dist = 0
                    startX = touchobj.pageX
                    startY = touchobj.pageY
                    startTime = new Date().getTime() // record time when finger first makes contact with surface
//                e.preventDefault()
                }, false)

                touchsurface.addEventListener('touchmove', function (e) {
//                e.preventDefault() // prevent scrolling when inside DIV
                }, false)

                touchsurface.addEventListener('touchend', function (e) {
                    var touchobj = e.changedTouches[0]
                    distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
                    distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
                    elapsedTime = new Date().getTime() - startTime // get time elapsed
                    if (elapsedTime <= allowedTime) { // first condition for awipe met
                        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                            swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
                        } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                            swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
                        }
                    }
                    handleswipe(swipedir)
//                e.preventDefault()
                }, false)
            }
        }
        function goToLast() {
            firstThumb = slider.find(selector).first();
            lastThumb = slider.find(selector).last();
            if (option.vertical) {
                if (option.thumbnailList == true) {
                    wrapper.css('top', ((lastThumb.position().top + lastThumb.outerHeight(true)) - slider.outerHeight()) * -1);
                } else {
                    wrapper.css('top', (wrapper.outerHeight(true) - itemSizeHeight) * -1);
                }
            } else {
                currentIndex = itemCount - 1;
                if (option.thumbnailList == true) {
                    wrapper.css('left', ((lastThumb.position().left + lastThumb.outerWidth(true)) - slider.outerWidth()) * -1);
                } else {
                    wrapper.css('left', (wrapper.outerWidth(true) - itemSize) * -1);
                }
            }
        }
        function goToFirst() {
            if (option.vertical) {
                if (option.preMove) {
                    option.preMove(currentIndex, 'up');
                }
                wrapper.css('top', "0");
            } else {
                currentIndex = 0;
                if (option.preMove) {
                    option.preMove(currentIndex, 'left');
                }
                wrapper.css('left', "0");
            }
        }
        function goTo(index, clear) {
            if (clear) {
                clearInterval(interval);
            }
            if (animating == true) {
                return;
            }
            if (option.repeat == false) {
                if (index == itemCount - 1) {
                    $(right).hide();
                    $(option.left).show();
                } else if (index == 0) {
                    $(right).show();
                    $(option.left).hide();
                } else {
                    $(right).show();
                    $(option.left).show();
                }
            }
            if (index > currentIndex) {//slide left
                offset = index - currentIndex;
                if (vertical == false) {
                    if (option.preMove) {
                        option.preMove(currentIndex, 'left');
                    }
                    wrapper.css('left', "-=" + (itemSize * Math.abs(offset)));
                } else {
                    if (option.preMove) {
                        option.preMove(currentIndex, 'top');
                    }
                    wrapper.css('top', "-=" + (itemSizeHeight * Math.abs(offset)));
                }
            } else if (index == currentIndex) {

            } else {//slide right
                offset = currentIndex - index;
                if (vertical == false) {
                    if (option.preMove) {
                        option.preMove(currentIndex, 'right');
                    }
                    wrapper.css('left', "+=" + (itemSize * Math.abs(offset)));
                } else {
                    if (option.preMove) {
                        option.preMove(currentIndex, 'bottom');
                    }
                    wrapper.css('top', "+=" + (itemSizeHeight * Math.abs(offset)));
                }
            }
            if (needDot) {
                dotWrapper.find('.dot').removeClass('selected');
                dotWrapper.find('.dot[data-index=' + index + ']').addClass('selected');
            }
            currentIndex = index;
            animating = true;
            if (option.postMove) {
                option.postMove(currentIndex);
            }
            setTimeout(function () {
                animating = false;
            }, animationTime);
        }
        return this;
    };
}(jQuery));