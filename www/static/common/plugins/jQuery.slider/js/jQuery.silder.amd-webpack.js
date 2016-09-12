"use strict";
var $=require('jquery');
$.fn.Slide = function (options) {
    var opts = $.extend({}, $.fn.Slide.deflunt, options);
    var index = 0;
    var target = $("." + opts.chooseNav, $(this));//自由切换List父对象,如1,2,3,4的切换LIST的父对象,多个图片切换的父对象
    var clickNext = $("." + opts.individuallyNav + " .next", $(this));//点击下一个按钮
    var clickPrev = $("." + opts.individuallyNav + " .prev", $(this));//点击上一个按钮
    var ContentBox = $("." + opts.claCon, $(this));//滚动的对象
    var ContentBoxNum = ContentBox.children().size();//滚动对象的子元素个数
    var slideH = ContentBox.children().first().height();//滚动对象的子元素个数高度，相当于滚动的高度
    var slideW = ContentBox.children().first().width();//滚动对象的子元素宽度，相当于滚动的宽度
    opts.slideTitle = $("." + opts.slideTitle, $(this));//幻灯片标题对象
    opts.imgList = ContentBox.children().find('img');//获取幻灯片的图片集合
    var autoPlay;
    var slideWH;
    //ContentBox.children().each(function (index) {
    //   $(this).attr('index',index);
    //});
    if (opts.createPage == true && opts.effect != 'scroolTxt') {
        var num = '';
        if (opts.showNum) {
            num = '1';
        }
        var pagestr = '<i class="on">' + num + '</i>';
        for (var i = 2; i <= ContentBoxNum / opts.steps; i++) {
            if (opts.showNum) {
                num = i;
            }
            pagestr += "<i>" + num + "</i>";
        }
        target.append(pagestr);
    }
    var targetLi = target.children();//分页对象的list
    if (opts.effect == "scroolY" || opts.effect == "scroolTxt") {
        slideWH = slideH;
    } else if (opts.effect == "scroolX" || opts.effect == "scroolLoop") {
        ContentBox.css("width", ContentBoxNum * slideW);
        slideWH = slideW;
    } else if (opts.effect == "fade") {
        ContentBox.children().first().css("z-index", "1").siblings().css({'z-index': '0', 'opacity': '0'});
        opts.slideTitle.html(opts.imgList.eq(0).attr('alt'));
    }
    var getIndex = function (index) {
        if (index * opts.steps >= ContentBoxNum) {
            index = 0;
        }
        if (index < 0) {
            index = ContentBoxNum / opts.steps - 1;
        }
        return index;
    }

    function isOutOfRange(index) {
        if (index * opts.steps >= ContentBoxNum) {
            return true;
        }
        if (index < 0) {
            return true;
        }
        return false;
    }

    function nextEvent(opts, doPlay, event) {
        if (opts.autoPlay) {
            clearInterval(autoPlay);
        }
        //无限循环
        if (opts.loop) {
            index = getIndex(++index);
            if (opts.effect === 'scroolLoop') {
                //index = 1;
                $.fn.Slide.effectLoop.scroolLeftLoop(ContentBox, targetLi, index, slideWH, opts);
            } else {
                $.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);
            }
        }
        else {
            if (!isOutOfRange(index + 1)) {
                index++;
                if (opts.effect === 'scroolLoop') {
                    clickPrev.removeClass('preend');
                    $.fn.Slide.effectLoop.scroolLeft(ContentBox, targetLi, index, slideWH, opts, function () {
                        if ((index + 1) * opts.steps >= ContentBoxNum) {
                            clickNext.addClass('nextend');
                        }
                    });
                } else {
                    index = getIndex(++index);
                    $.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);
                }
            }
        }
        event.preventDefault();
        if (opts.autoPlay) {
            autoPlay = setInterval(doPlay, opts.timer);
        }
    }

    function scrollLoopCallback() {
        if (!opts.loop) {
            clickPrev.removeClass('preend');
            clickNext.removeClass('nextend');
            if (index == 0) {
                clickPrev.addClass('preend');
            } else if ((index + 1) * opts.steps >= ContentBoxNum) {
                clickNext.addClass('nextend');
            }
        } else {
            if ((index + 1) * opts.steps >= ContentBoxNum) {
                clickNext.addClass('nextend');
            }
        }
    }

    function preEvent(opts, doPlay, event) {
        if (opts.autoPlay) {
            clearInterval(autoPlay);
        }
        if (opts.loop) {
            index = getIndex(--index);
            if (opts.effect === 'scroolLoop') {
                //index = 1;
                $.fn.Slide.effectLoop.scroolRightLoop(ContentBox, targetLi, index, slideWH, opts, ContentBoxNum);
            } else {
                $.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);
            }
        } else {
            if (opts.effect === 'scroolLoop') {
                index--;
                if (index < 0) {
                    index = 0;
                } else {
                    $.fn.Slide.effectLoop.scroolLeft(ContentBox, targetLi, index, slideWH, opts, function () {
                        scrollLoopCallback();
                    });
                }
            } else {
                index = getIndex(--i);
                $.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);
            }
        }
        event.preventDefault();
        if (opts.autoPlay) {
            autoPlay = setInterval(doPlay, opts.timer);
        }
    }

    return this.each(function () {
        var $this = $(this);
        //滚动函数
        var doPlay = function () {
            if (opts.effect === 'scroolLoop') {
                clickNext.click();
                return;
            }
            $.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);
            index = getIndex(++index);
        };
        clickNext.click(function (event) {
            nextEvent(opts, doPlay, event);
        });
        clickPrev.click(function (event) {
            preEvent(opts, doPlay, event);
        });
        //自动播放
        if (opts.autoPlay) {
            autoPlay = setInterval(doPlay, opts.timer);
            ContentBox.hover(function () {
                if (autoPlay) {
                    clearInterval(autoPlay);
                }
            }, function () {
                if (autoPlay) {
                    clearInterval(autoPlay);
                }
                autoPlay = setInterval(doPlay, opts.timer);
            });
        }
        //目标事件
        if (!(opts.effect === 'scroolLoop' && opts.loop)) {
            targetLi.hover(function () {
                var effect;
                if (autoPlay) {
                    clearInterval(autoPlay);
                }
                index = targetLi.index(this);
                if (opts.effect != 'scroolLoop') {
                    setTimeout(function () {
                        $.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);
                        scrollLoopCallback();
                    }, 200);
                } else {
                    //if (opts.loop) {
                    //    effect
                    //
                    //
                    //}
                    setTimeout(function () {
                        $.fn.Slide.effectLoop.scroolLeft(ContentBox, targetLi, index, slideWH, opts, function () {
                            scrollLoopCallback();
                        });
                    }, 200);
                }
            }, function () {
                if (autoPlay) {
                    clearInterval(autoPlay);
                }
                autoPlay = setInterval(doPlay, opts.timer);
            });
        }
    });
};
$.fn.Slide.deflunt = {
    effect: "scroolY",
    autoPlay: true,
    speed: "normal",
    timer: 1000,
    defIndex: 0,
    individuallyNav: "JQ-slide-nav",
    chooseNav: "JQ-slide-nav",
    showNum: true,
    claCon: "JQ-slide-content",
    steps: 1,
    createPage: true,
    loop: true,
    slideTitle: 'slideTitle'//幻灯标题对象
};
$.fn.Slide.effectLoop = {
    scroolLeft: function (contentObj, navObj, i, slideW, opts, callback) {
        if (opts.loop) {
            contentObj.animate({"left": -opts.steps * slideW}, opts.speed, callback);
        } else {
            contentObj.animate({"left": -i * opts.steps * slideW}, opts.speed, callback);
        }
        if (navObj) {
            navObj.eq(i).addClass("on").siblings().removeClass("on");
        }
    },
    scroolLeftLoop: function (contentObj, navObj, i, slideW, opts) {
        $.fn.Slide.effectLoop.scroolLeft(contentObj, navObj, i, slideW, opts, function () {
            contentObj.find('li:lt(' + (opts.steps) + ')').appendTo(contentObj);
            contentObj.css({"left": "0"});
        });
    },
    scroolRight: function (contentObj, navObj, i, slideW, opts, preCallback, callback) {
        if (opts.loop) {
            if ($.isFunction(preCallback)) {
                preCallback();
            }
            contentObj.stop().animate({"left": 0}, opts.speed, callback);
        } else {
            contentObj.stop().animate({"left": 0}, opts.speed, callback);
        }
        if (navObj) {
            navObj.eq(i).addClass("on").siblings().removeClass("on");
        }
    },
    scroolRightLoop: function (contentObj, navObj, i, slideW, opts, ContentBoxNum) {
        $.fn.Slide.effectLoop.scroolRight(contentObj, navObj, i, slideW, opts, function () {
            contentObj.find('li:gt(' + (ContentBoxNum - opts.steps - 1) + ')').prependTo(contentObj);
            contentObj.css({"left": -opts.steps * slideW});
        });
    }
}
$.fn.Slide.effect = {
    fade: function (contentObj, navObj, i, slideW, opts) {
        opts.slideTitle.html(opts.imgList.eq(i).attr('alt'));
        contentObj.children().eq(i).stop().animate({opacity: 1}, opts.speed).css({"z-index": "1"}).siblings().animate({opacity: 0}, opts.speed).css({"z-index": "0"});
        navObj.eq(i).addClass("on").siblings().removeClass("on");
    },
    scroolTxt: function (contentObj, undefined, i, slideH, opts) {
        //alert(i*opts.steps*slideH);
        contentObj.animate({"margin-top": -opts.steps * slideH}, opts.speed, function () {
            for (var j = 0; j < opts.steps; j++) {
                contentObj.find("li:first").appendTo(contentObj);
            }
            contentObj.css({"margin-top": "0"});
        });
    },
    scroolX: function (contentObj, navObj, i, slideW, opts, callback) {
        contentObj.stop().animate({"left": -i * opts.steps * slideW}, opts.speed, callback);
        if (navObj) {
            navObj.eq(i).addClass("on").siblings().removeClass("on");
        }
    },
    scroolY: function (contentObj, navObj, i, slideH, opts) {
        contentObj.stop().animate({"top": -i * opts.steps * slideH}, opts.speed);
        if (navObj) {
            navObj.eq(i).addClass("on").siblings().removeClass("on");
        }
    },
    fadeIn: function (opt) {
        opt = $.fn.extend({pageobj: $(this).find('>p'), timer: 3500, auto: true}, opt || {});
        var _this = $(this), size = $("li", _this).length, pagestr = '<i class="on">1</i>', pageobj = $(opt.pageobj), autoPlay = null, n = 0, t = null;
        $('li', _this).eq(0).show().siblings().hide();
        for (var i = 2; i <= size; i++) {
            pagestr += "<i>" + i + "</i>";
        }
        pageobj.append(pagestr).children('i').click(function () {
            clearInterval(t);
            var i = $(this).text() - 1;
            n = i;
            if (i >= size) return;
            $('li', _this).eq(i).fadeIn(800).siblings().fadeOut(500);
            $(this).addClass('on').siblings().removeClass('on');
            t = setInterval(autoPlay, opt.timer);
        });
        if (opt.auto) {
            autoPlay = function () {
                //alert(1);
                n = n >= (size - 1) ? 0 : ++n;
                $("i", _this).eq(n).trigger('click');
            }
            t = setInterval(autoPlay, opt.timer);
            $(_this).hover(function () {
                    clearInterval(t);
                },
                function () {
                    t = setInterval(autoPlay, opt.timer);
                })
        }
    }// fadeIn END
};
module.export=$.fn.Slide;