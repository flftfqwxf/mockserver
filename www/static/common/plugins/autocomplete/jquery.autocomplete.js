/*
 * jQuery Autocomplete plugin 1.2.3
 *
 * Copyright (c) 2009 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * With small modifications by Alfonso Gómez-Arzola.
 * See changelog for details.
 *
 */
;
(function ($) {
    $.fn.extend({
        autocomplete: function (urlOrData, options,callback) {
            var isUrl = typeof urlOrData == "string";
            options = $.extend({}, $.Autocompleter.defaults, {
                url: isUrl ? urlOrData : null,
                data: isUrl ? null : urlOrData,
                delay: isUrl ? $.Autocompleter.defaults.delay : 10,
                max: options && !options.scroll ? 10 : 150,
                noRecord: "No Records."
            }, options);
            // if highlight is set to false, replace it with a do-nothing function
            options.highlight = options.highlight || function (value) {
                    return value;
                };
            // if the formatMatch option is not specified, then use formatItem for backwards compatibility
            options.formatMatch = options.formatMatch || options.formatItem;
            return this.each(function () {
                new $.Autocompleter(this, options);
            });
        },
        result: function (handler) {
            return this.bind("result", handler);
        },
        search: function (handler) {
            return this.trigger("search", [handler]);
        },
        flushCache: function () {
            return this.trigger("flushCache");
        },
        setOptions: function (options) {
            return this.trigger("setOptions", [options]);
        },
        unautocomplete: function () {
            return this.trigger("unautocomplete");
        }
    });

    $.Autocompleter = function (input, options,callback) {
        var KEY = {
            UP: 38,
            DOWN: 40,
            DEL: 46,
            TAB: 9,
            RETURN: 13,
            ESC: 27,
            COMMA: 188,
            PAGEUP: 33,
            PAGEDOWN: 34,
            BACKSPACE: 8
        };
        var globalFailure = null;
        if (options.failure != null && typeof options.failure == "function") {
            globalFailure = options.failure;
        }
        // Create $ object for input element
        var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass);
        var timeout;
        var previousValue = "";
        var cache = $.Autocompleter.Cache(options);
        var hasFocus = 0;
        var lastKeyPressCode;
        var config = {
            mouseDownOnSelect: false
        };
        var select = $.Autocompleter.Select(options, input, selectCurrent, config);
        var blockSubmit;
        // prevent form submit in opera when selecting with return key
        navigator.userAgent.indexOf("Opera") != -1 && $(input.form).bind("submit.autocomplete", function () {
            if (blockSubmit) {
                blockSubmit = false;
                return false;
            }
        });
        // older versions of opera don't trigger keydown multiple times while pressed, others don't work with keypress at all
        $input.bind((navigator.userAgent.indexOf("Opera") != -1 && !'KeyboardEvent' in window ? "keypress" : "keydown") + ".autocomplete", function (event) {


            $('.m-unconfirmedHotel').remove();
            // a keypress means the input has focus
            // avoids issue where input had focus before the autocomplete was applied
            hasFocus = 1;
            // track last key pressed
            lastKeyPressCode = event.keyCode;
            switch (event.keyCode) {
                case KEY.UP:
                    if (select.visible()) {
                        event.preventDefault();
                        select.prev();
                    } else {
                        onChange(0, true);
                    }
                    break;
                case KEY.DOWN:
                    if (select.visible()) {
                        event.preventDefault();
                        select.next();
                    } else {
                        onChange(0, true);
                    }
                    break;
                case KEY.PAGEUP:
                    if (select.visible()) {
                        event.preventDefault();
                        select.pageUp();
                    } else {
                        onChange(0, true);
                    }
                    break;
                case KEY.PAGEDOWN:
                    if (select.visible()) {
                        event.preventDefault();
                        select.pageDown();
                    } else {
                        onChange(0, true);
                    }
                    break;

                // matches also semicolon
                case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA:
                case KEY.TAB:
                case KEY.RETURN:
                    if (selectCurrent()) {
                        // stop default to prevent a form submit, Opera needs special handling
                        event.preventDefault();
                        blockSubmit = true;
                        return false;
                    }
                    break;
                case KEY.ESC:
                    select.hide();
                    break;
                default:
                    clearTimeout(timeout);
                    timeout = setTimeout(onChange, options.delay);
                    break;
            }
        }).focus(function () {
            // track whether the field has focus, we shouldn't process any
            // results if the field no longer has focus
            if ($(this).val() == $(this).attr("placeholder")) {
                $(this).val("");                
            }  
            !($(this).val()) && ( options.focCallback && options.focCallback($(this)));          
            $(this).css('color', '#000');
            hasFocus++;
        }).blur(function (e) {
            //$(".m-unconfirmedHotel").remove();
            if ($(this).val() == '' || $(this).val() == $(this).attr("placeholder")) {
                $(this).css('color', '#757575');
            } else {
                $(this).css('color', '#000');
            }
            $(this).val() && ( options.blurCallback && options.blurCallback($(this)));  
            hasFocus = 0;
            if (!config.mouseDownOnSelect) {
                hideResults();
            }
        }).click(function () {
            // show select when clicking in a focused field
            // but if clickFire is true, don't require field
            // to be focused to begin with; just show select
            if (options.clickFire) {
                if (!select.visible()) {
                    onChange(0, true);
                }
            } else {
                if (hasFocus++ > 1 && !select.visible()) {
                    onChange(0, true);
                }
            }
        }).bind("search", function () {
            // TODO why not just specifying both arguments?
            var fn = (arguments.length > 1) ? arguments[1] : null;

            function findValueCallback(q, data) {
                var result;
                if (data && data.length) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].result.toLowerCase().LTrim().RTrim() == q.toLowerCase().LTrim().RTrim()) {
                            result = data[i];
                            break;
                        }
                    }
                }
                if (typeof fn == "function") fn(result);
                else $input.trigger("result", result && [result.data, result.value]);
            }

            $.each(trimWords($input.val()), function (i, value) {
                request(value, findValueCallback, findValueCallback);
            });
        }).bind("flushCache", function () {
            cache.flush();
        }).bind("setOptions", function () {
            $.extend(true, options, arguments[1]);
            // if we've updated the data, repopulate
            if ("data" in arguments[1])
                cache.populate();
        }).bind("input", function () {

            if (/firefox/.test(navigator.userAgent.toLowerCase())) {
                $input.trigger(navigator.userAgent.indexOf("Opera") != -1 && !'KeyboardEvent' in window ? "keypress" : "keydown");
            } else {
                $input.trigger('search');
            }
        }).bind("unautocomplete", function () {
            select.unbind();
            $input.unbind();
            $(input.form).unbind(".autocomplete");
        }).bind("change", function () {
            $input.search();
        });
        function selectCurrent() {
            var selected = select.selected();
            if (!selected)
                return false;
            var v = selected.result;
            previousValue = v;
            if (options.multiple) {
                var words = trimWords($input.val());
                if (words.length > 1) {
                    var seperator = options.multipleSeparator.length;
                    var cursorAt = $(input).selection().start;
                    var wordAt, progress = 0;
                    $.each(words, function (i, word) {
                        progress += word.length;
                        if (cursorAt <= progress) {
                            wordAt = i;
                            return false;
                        }
                        progress += seperator;
                    });
                    words[wordAt] = v;
                    // TODO this should set the cursor to the right position, but it gets overriden somewhere
                    //$.Autocompleter.Selection(input, progress + seperator, progress + seperator);
                    v = words.join(options.multipleSeparator);
                }
                v += options.multipleSeparator;
            }
            $input.val(v);
            config.mouseDownOnSelect = true;
            hideResultsNow(true);
            $input.trigger("result", [selected.data, selected.value]);
            return true;
        }

        function onChange(crap, skipPrevCheck) {
            if (lastKeyPressCode == KEY.DEL) {
                select.hide();
                return;
            }
            var currentValue = $input.val();
            if (!skipPrevCheck && currentValue == previousValue)
                return;
            previousValue = currentValue;
            currentValue = lastWord(currentValue);
            if (currentValue.length >= options.minChars) {
                $input.addClass(options.loadingClass);
                if (!options.matchCase)
                    currentValue = currentValue.toLowerCase();
                request(currentValue, receiveData, hideResultsNow);
            } else {
                stopLoading();
                select.hide();
            }
        };
        function trimWords(value) {
            if (!value)
                return [""];
            if (!options.multiple)
                return [$.trim(value)];
            return $.map(value.split(options.multipleSeparator), function (word) {
                return $.trim(value).length ? $.trim(word) : null;
            });
        }

        function lastWord(value) {
            if (!options.multiple)
                return value;
            var words = trimWords(value);
            if (words.length == 1)
                return words[0];
            var cursorAt = $(input).selection().start;
            if (cursorAt == value.length) {
                words = trimWords(value)
            } else {
                words = trimWords(value.replace(value.substring(cursorAt), ""));
            }
            return words[words.length - 1];
        }

        // fills in the input box w/the first match (assumed to be the best match)
        // q: the term entered
        // sValue: the first matching result
        function autoFill(q, sValue) {
            // autofill in the complete box w/the first match as long as the user hasn't entered in more data
            // if the last user key pressed was backspace, don't autofill
            if (options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE) {
                // fill in the value (keep the case the user has typed)
                $input.val($input.val() + sValue.substring(lastWord(previousValue).length));
                // select the portion of the value not typed by the user (so the next character will erase)
                $(input).selection(previousValue.length, previousValue.length + sValue.length);
            }
        };
        function hideResults() {
            clearTimeout(timeout);
            timeout = setTimeout(hideResultsNow, 200);
        };
        function hideResultsNow(noSearch) {
            var wasVisible = select.visible();
            select.hide();
            clearTimeout(timeout);
            stopLoading();
            if (options.mustMatch && noSearch !== true && lastWord($input.val())) {
                // call search and run callback
                $input.search(
                    function (result) {
                        // if no value found, clear the input box
                        if (!result) {
                            if (options.multiple) {
                                var words = trimWords($input.val()).slice(0, -1);
                                $input.val(words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : ""));
                            }
                            else {
                                options.noResultSetNull && $input.val($input.attr("placeholder") || "")
                                $input.trigger("result", null);
                            }
                        } else {
                            $input.trigger("result", result && [result.data, result.value]);
                        }
                    }
                );
            }
        };
        function receiveData(q, data, orgData) {
            if (data && data.length && hasFocus) {
                stopLoading();
                select.display(data, q, orgData);
                autoFill(q, data[0].value);
                select.show();
                select.hideNoData(); // 2015-07-17 wfq 添加无结果提示
            } else {
                if (options.noDataShow) { // 2015-07-17 wfq 添加无结果提示
                    stopLoading();
                    select.showNoData();
                    select.show();
                } else {
                    hideResultsNow(true);
                }
            }
            // 添加数据读取显示完毕后回调方法。
            options.renderCallback && typeof options.renderCallback == "function" && options.renderCallback.call($input, data);
        };
        function request(term, success, failure) {
            if (!options.matchCase)
                term = term.toLowerCase();
            var data = cache.load(term);
            // recieve the cached data
            if (data) {
                var parsed = parse(data);
                if (parsed.length) {
                    success(term, parsed, data);
                } else {
                    var parsed = parse(options.noRecord);
                    success(term, parsed);
                }
                // if an AJAX url has been supplied, try loading the data now
            } else if ((typeof options.url == "string") && (options.url.length > 0)) {
                var extraParams = {
                    timestamp: +new Date()
                };

                $.each(options.extraParams, function (key, param) {
                    extraParams[key] = typeof param == "function" ? param() : param;
                });
                var d = {};
                //d[options.maxRecordParam] = options.max;
                d[options.requestParamName] = lastWord(term);
                d = $.extend(d, extraParams);
                $.ajax({
                    // try to leverage ajaxQueue plugin to abort previous requests
                    mode: "abort",
                    // limit abortion to this input
                    port: "autocomplete" + input.name,
                    dataType: options.dataType,
                    url: options.url,
                    data: d,
                    success: function (data) {
                        var parsed = parse(data);
                        cache.add(term, data);
                        success(term, parsed, data);
                    }
                });
            } else {
                // if we have a failure, we need to empty the list -- this prevents the the [TAB] key from selecting the last successful match
                select.emptyList();
                if (globalFailure != null) {
                    globalFailure();
                } else {
                    failure(term);
                }
            }
        };
        function parse(data) {
            if (typeof data == "string" && data != options.noRecord)
                data = JSON.parse(data);
            return options.parse && options.parse(data) || _parse(data);
        }

        function _parse(data) {
            var parsed = [];
            var rows = data.split("\n");
            for (var i = 0; i < rows.length; i++) {
                var row = $.trim(rows[i]);
                if (row) {
                    row = row.split("|");
                    parsed[parsed.length] = {
                        data: row,
                        value: row[0],
                        result: options.formatResult && options.formatResult(row, row[0]) || row[0]
                    };
                }
            }
            return parsed;
        };
        function stopLoading() {
            $input.removeClass(options.loadingClass);
        };
    };
    $.Autocompleter.defaults = {
        inputClass: "ac_input",
        resultsClass: "ac_results",
        loadingClass: "ac_loading",
        minChars: 1,
        delay: 400,
        matchCase: false,
        matchSubset: false,
        matchContains: true,
        cacheLength: 100,
        max: 100,
        mustMatch: true,
        extraParams: {},
        selectFirst: true,
        formatItem: function (row) {
            return row[0];
        },
        formatMatch: null,
        autoFill: false,
        width: 0,
        multiple: false,
        multipleSeparator: " ",
        inputFocus: true,
        clickFire: true,
        highlight: function (value, term) {
            return value == null ? "" : value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
        },
        scroll: false,
        scrollHeight: 180,
        scrollJumpPosition: true,
        noWordClass: "hot-keyword",
        showOthers: false,
        requestParamName: "q",
        othersOnClick: function () {
            return false
        },
        noResultSetNull: true   // 2015-07-17 wfq 无结果时清空输入框
    };
    $.Autocompleter.Cache = function (options) {
        var data = {};
        var length = 0;
        var key = options.hotType, s = sessionStorage;

        function matchSubset(s, sub) {
            if (!options.matchCase)
                s = s.toLowerCase();
            var i = s.indexOf(sub);
            if (options.matchContains == "word") {
                i = s.toLowerCase().search("\\b" + sub.toLowerCase());
            }
            if (i == -1) return false;
            return i == 0 || options.matchContains;
        };
        function add(q, value) {
            if (key && q == "") {
                s.setItem(key, JSON.stringify(value))
            } else {
                if (length > options.cacheLength) {
                    flush();
                }
                if (!data[q]) {
                    length++;
                }
                data[q] = value;
            }
        }

        function populate() {
            if (!options.data) return false;
            // track the matches
            var stMatchSets = {},
                nullData = 0;
            // no url was specified, we need to adjust the cache length to make sure it fits the local data store
            if (!options.url) options.cacheLength = 1;
            // track all options for minChars = 0
            stMatchSets[""] = [];
            // loop through the array and create a lookup structure
            for (var i = 0, ol = options.data.length; i < ol; i++) {
                var rawValue = options.data[i];
                // if rawValue is a string, make an array otherwise just reference the array
                rawValue = (typeof rawValue == "string") ? [rawValue] : rawValue;
                var value = options.formatMatch(rawValue, i + 1, options.data.length);
                if (typeof(value) === 'undefined' || value === false)
                    continue;
                var firstChar = value.charAt(0).toLowerCase();
                // if no lookup array for this character exists, look it up now
                if (!stMatchSets[firstChar])
                    stMatchSets[firstChar] = [];
                // if the match is a string
                var row = {
                    value: value,
                    data: rawValue,
                    result: options.formatResult && options.formatResult(rawValue) || value
                };
                // push the current match into the set list
                stMatchSets[firstChar].push(row);
                // keep track of minChars zero items
                if (nullData++ < options.max) {
                    stMatchSets[""].push(row);
                }
            }
            ;
            // add the data items to the cache
            $.each(stMatchSets, function (i, value) {
                // increase the cache size
                options.cacheLength++;
                // add to the cache
                add(i, value);
            });
        }

        // populate any existing data
        setTimeout(populate, 25);
        function flush() {
            data = {};
            length = 0;
        }

        return {
            flush: flush,
            add: add,
            populate: populate,
            load: function (q) {
                if (key && q == "") {
                    var v = s.getItem(key);
                    return v && JSON.parse(v);
                }
                if (!options.cacheLength || !length)
                    return null;
                /*
                 * if dealing w/local data and matchContains than we must make sure
                 * to loop through all the data collections looking for matches
                 */
                if (!options.url && options.matchContains) {
                    // track all matches
                    var csub = [];
                    // loop through all the data grids for matches
                    for (var k in data) {
                        // don't search through the stMatchSets[""] (minChars: 0) cache
                        // this prevents duplicates
                        if (k.length > 0) {
                            var c = data[k];
                            $.each(c, function (i, x) {
                                // if we've got a match, add it to the array
                                if (matchSubset(x.value, q)) {
                                    csub.push(x);
                                }
                            });
                        }
                    }
                    return csub;
                } else
                // if the exact item exists, use it
                if (data[q]) {
                    return data[q];
                } else if (options.matchSubset) {
                    for (var i = q.length - 1; i >= options.minChars; i--) {
                        var c = data[q.substr(0, i)];
                        if (c) {
                            var csub = [];
                            $.each(c, function (i, x) {
                                if (matchSubset(x.value, q)) {
                                    csub[csub.length] = x;
                                }
                            });
                            return csub;
                        }
                    }
                }
                return null;
            }
        };
    };
    $.Autocompleter.Select = function (options, input, select, config) {
        var CLASSES = {
            ACTIVE: "ac_over"
        };
        var listItems,
            active = -1,
            data,
            orgData,
            term = "",
            needsInit = true,
            element,
            pagination,
            others,
            list;
        // Create results
        function init() {
            if (!needsInit)
                return;
            element = $("<div/>")
                .hide()
                .addClass(options.resultsClass)
                .addClass(options.noWordClass)
                .css("position", "absolute")
                .insertAfter(input)
                .hover(function (event) {
                    // Browsers except FF do not fire mouseup event on scrollbars, resulting in mouseDownOnSelect remaining true, and results list not always hiding.
                    if ($(this).is(":visible")) {
                        input.focus();
                    }
                    config.mouseDownOnSelect = false;
                }).mousedown(function () {
                    config.mouseDownOnSelect = true;
                }).mouseup(function () {
                    input.focus();
                    config.mouseDownOnSelect = false;
                });
            if (options.hotType) {
                $("<div/>").appendTo(element).addClass("hottip").html(options.hotType);
            }
            list = $("<ul/>").appendTo(element).mouseover(function (event) {
                if (target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') {
                    active = $("li", list).removeClass(CLASSES.ACTIVE).index(target(event));
                    $(target(event)).addClass(CLASSES.ACTIVE);
                }
            }).click(function (event) {
                $(target(event)).addClass(CLASSES.ACTIVE);
                select();
                if (options.inputFocus)
                    input.focus();
                return false;
            })
            if (options.pagination) {
                pagination = $("<div/>").appendTo(element).addClass("pagination")
            }
            if (options.showOthers) {
                others = $("<div/>").appendTo(element).addClass("others").html("<button></button>").on("click", "button", function () {
                    //input.focus();
                    options.othersOnClick();
                    return false;
                })
            }
            if (options.width > 0)
                element.css("width", options.width);
            needsInit = false;
        }

        function target(event) {
            var element = event.target;
            while (element && element.tagName != "LI")
                element = element.parentNode;
            // more fun with IE, sometimes event.target is empty, just ignore it then
            if (!element)
                return [];
            return element;
        }

        function moveSelect(step) {
            listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE);
            movePosition(step);
            var activeItem = listItems.slice(active, active + 1).addClass(CLASSES.ACTIVE);
            if (options.scroll) {
                var offset = 0;
                listItems.slice(0, active).each(function () {
                    offset += this.offsetHeight;
                });
                if ((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) {
                    list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight());
                } else if (offset < list.scrollTop()) {
                    list.scrollTop(offset);
                }
            }
        };
        function movePosition(step) {
            if (options.scrollJumpPosition || (!options.scrollJumpPosition && !((step < 0 && active == 0) || (step > 0 && active == listItems.size() - 1)) )) {
                active += step;
                if (active < 0) {
                    active = listItems.size() - 1;
                } else if (active >= listItems.size()) {
                    active = 0;
                }
            }
        }

        function limitNumberOfItems(available) {
            return options.max && options.max < available
                ? options.max
                : available;
        }

        function fillList(d) {
            d = d || data;
            list.empty();
            var max = limitNumberOfItems(d.length);
            for (var i = 0; i < max; i++) {
                if (!d[i])
                    continue;
                var formatted = options.formatItem(d[i].data, i + 1, max, d[i].value, term);
                if (formatted === false)
                    continue;
                var li = $("<li/>").html(options.highlight(formatted, term)).addClass(i % 2 == 0 ? "ac_even" : "ac_odd").appendTo(list)[0];
                $.data(li, "ac_data", d[i]);
            }
            listItems = list.find("li");
            if (options.selectFirst) {
                listItems.slice(0, 1).addClass(CLASSES.ACTIVE);
                active = 0;
            }
            element[term == "" ? "addClass" : "removeClass"](options.noWordClass)
            others && others.find("button").html("创建\"" + term + "\"");
            // apply bgiframe if available
            if ($.fn.bgiframe)
                list.bgiframe();
        }

        function initPagination() {
            if (typeof orgData === 'string') {
                orgData = eval('(' + orgData + ')');
            }
            if (pagination && orgData.pagination) {
                pagination.empty().pagination({
                    dataSource: data,//"/sight-select.json?limit=10&keyword=a&timestamp=1428630672795&lineId=22&size=10&count=100",
                    //locator:"list",
                    triggerPagingOnInit: false,
                    hideWhenLessThanOnePage: true,
                    alias: {
                        pageNumber: 'page',
                        pageSize: 'size'
                    },
                    totalNumber: orgData.pagination.count,
                    pageSize: options.max,
                    callback: function (d, p) {
                        fillList(d)
                    }
                }).show();
            }
                if (pagination) {
                    if (pagination.html()) {
                        pagination.show();
                    } else {
                        pagination.hide();
                    }
                }

        }

        // 2015-07-17 wfq 添加无结果提示
        function showNoData() {
            list.empty();
            var J_no_data = list.parent().find(".J_no_data");
            if (J_no_data && null != J_no_data && J_no_data.length > 0) {
                J_no_data.show();
            } else {
                var noData = '<div class="sm-placeholder J_no_data">' +
                '<i class="gm-icon gm-supposed"></i>' +
                '<p class="base-fontColor">暂无相关数据!</p>' +
                '<p>请<a href="javascript:;" onclick="showLinkGmService(9999);" >联系客服</a>，我们会尽快添加</p>' +
                '</div>'
                var li = $(noData).appendTo(list.parent())[0];
                $.data(li, "ac_data", {});
            }
        }

        function hideNoData() {
            list.parent().find(".J_no_data").hide();
        }

        return {
            display: function (d, q, org) {
                init();
                data = d;
                term = q;
                orgData = org;
                fillList();
                initPagination();
            },
            next: function () {
                moveSelect(1);
            },
            prev: function () {
                moveSelect(-1);
            },
            pageUp: function () {
                if (active != 0 && active - 8 < 0) {
                    moveSelect(-active);
                } else {
                    moveSelect(-8);
                }
            },
            pageDown: function () {
                if (active != listItems.size() - 1 && active + 8 > listItems.size()) {
                    moveSelect(listItems.size() - 1 - active);
                } else {
                    moveSelect(8);
                }
            },
            hide: function () {
                element && element.hide();
                listItems && listItems.removeClass(CLASSES.ACTIVE);
                active = -1;
            },
            visible: function () {
                return element && element.is(":visible");
            },
            current: function () {
                return this.visible() && (listItems.filter("." + CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0]);
            },
            show: function () {
                var offset = $(input).offset();
                element.css({
                    width: typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(),
                    top: typeof options.top == "string" || options.top > 0 ? options.top : input.offsetHeight,
                    left: 0//offset.left
                }).show();
                if (options.scroll) {
                    list.scrollTop(0);
                    list.css({
                        maxHeight: options.scrollHeight,
                        overflow: 'auto'
                    });
                    if (navigator.userAgent.indexOf("MSIE") != -1 && typeof document.body.style.maxHeight === "undefined") {
                        var listHeight = 0;
                        listItems.each(function () {
                            listHeight += this.offsetHeight;
                        });
                        var scrollbarsVisible = listHeight > options.scrollHeight;
                        list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight);
                        if (!scrollbarsVisible) {
                            // IE doesn't recalculate width when scrollbar disappears
                            listItems.width(list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right")));
                        }
                    }
                }
            },
            selected: function () {
                var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE);
                return selected && selected.length && $.data(selected[0], "ac_data");
            },
            emptyList: function () {
                list && list.empty();
            },
            unbind: function () {
                element && element.remove();
            },
            showNoData: function () {
                showNoData();
            },
            hideNoData: function () {
                hideNoData();
            }
        };
    };
    $.fn.selection = function (start, end) {
        if (start !== undefined) {
            return this.each(function () {
                if (this.createTextRange) {
                    var selRange = this.createTextRange();
                    if (end === undefined || start == end) {
                        selRange.move("character", start);
                        selRange.select();
                    } else {
                        selRange.collapse(true);
                        selRange.moveStart("character", start);
                        selRange.moveEnd("character", end);
                        selRange.select();
                    }
                } else if (this.setSelectionRange) {
                    this.setSelectionRange(start, end);
                } else if (this.selectionStart) {
                    this.selectionStart = start;
                    this.selectionEnd = end;
                }
            });
        }
        var field = this[0];
        if (field.createTextRange) {
            var range = document.selection.createRange(),
                orig = field.value,
                teststring = "<->",
                textLength = range.text.length;
            range.text = teststring;
            var caretAt = field.value.indexOf(teststring);
            field.value = orig;
            this.selection(caretAt, caretAt + textLength);
            return {
                start: caretAt,
                end: caretAt + textLength
            }
        } else if (field.selectionStart !== undefined) {
            return {
                start: field.selectionStart,
                end: field.selectionEnd
            }
        }
    };
})(jQuery);
