((function($, w) {



        $("body").on("click",function(e){
            var t = $(e.target).closest('.items').length;
            if(!t){
                $('.m-unconfirmedHotel').remove(); 
            }
        })

        var maxDay = 30; // 允许添加的最大天数
        var viewport = $('#page-content-viewport');
        var viewportTop = viewport.offset().top;
        var $context;
        var toCNNumber = function(n) {
            return 0 < n && n <= 10 ? ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"][n - 1] : n;
        }
        //每日之间滑动偏移
        var offset = 165;
        var service = {
            getGradeHotel: function() {
                return template("tmp_step_trip_hotel_grade");
            },
            getHotel: function(trip) {
                var hotels = trip.hotels;

                var $tar = $(template("tmp_step_trip_hotel_specific", {}));

                if (hotels && hotels.length > 0) {
                    var i = 0;
                    $(hotels).each(function() {

                        $(".items", $tar).append(service.getHotelItem($.extend({}, this, {
                            "idx": i++
                        })));
                    });
                } else {
                    $(".items", $tar).append(service.getHotelItem({}));
                }

                if (hotels && hotels.length == 1) {
                    $("[data-del-action]", $tar).hide();
                }
                return $tar;
            },
            propTable:function(value) {
                var self = this;
                var flightNumber = value || $(this).val();
                if (flightNumber) {
                    Tour.utils.searchFlight(flightNumber, function(data) {
                        if (data.flightList.length) {
                            var save = [];
                            var len = data.flightList.length;
                            for (var i = 0; i < len; i++) {
                                save.push('<tr data-index="' + i + '" data-plan="' + data.flightList[i].plane + '">');
                                save.push('<td>');
                                save.push('<span>' + data.flightList[i].depCity.cnName + '-' + data.flightList[i].arrCity.cnName + '</span>');
                                save.push('<span>' + data.flightList[i].airline.name + '</span>');
                                save.push('</td>');
                                save.push('<td>');
                                save.push('<span>起飞</span>');
                                save.push('<span>降落</span>');
                                save.push('</td>');
                                save.push('<td>');
                                save.push('<span>' + data.flightList[i].depTime + '</span>');
                                save.push('<span>' + data.flightList[i].arrTime + '</span> ');
                                save.push('</td>');
                                save.push('</tr>');
                            }

                            $(self).closest('.flights').find(".f-match-data").html(save.join(""));
                            $(".f-match-data tr").on("click", function() {

                                var i = $(this).attr("data-index");
                                var plane = $(this).attr("data-plan");
                                var airline = $(this).find("td").eq(0).find("span").eq(1).text(); // 航空公司
                                var depCity_arrCity = $(this).find("td").eq(0).find("span").eq(0).text(); // 航空公司
                                var depTime = $(this).find("td").eq(2).find("span").eq(0).text(); // 航空公司
                                var arrTime = $(this).find("td").eq(2).find("span").eq(1).text(); // 航空公司
                                var html = '<td>' + airline + '</td> <td>' + plane + '</td> <td>' + depCity_arrCity + '</td><td>' + depTime + '-' + arrTime + '</td>';

                                $(this).closest('.form-inline').find(".display-flight").find("table").html(html);
                                $(this).closest(".m-traffics").find("[name=id]").val(data.flightList[i].id);
                                $(this).closest(".m-traffics").find("[name=arrTime]").val(data.flightList[i].arrTime);
                                $(this).closest(".m-traffics").find("[name=depTime]").val(data.flightList[i].depTime);
                                $(this).closest(".m-traffics").find("[name=plane]").val(data.flightList[i].plane);
                                $(this).closest(".m-traffics").find("[name=stop]").val(data.flightList[i].stop);
                                $(this).closest(".m-traffics").find("[name=schedule]").val(data.flightList[i].schedule);
                                $(this).closest(".m-traffics").find("[data-name=airline] [name=name]").val(data.flightList[i].airline.name);
                                $(this).closest(".m-traffics").find("[data-name=arrCity] [name=cnName]").val(data.flightList[i].arrCity.cnName);
                                $(this).closest(".m-traffics").find("[data-name=arrAirport] [name=name]").val(data.flightList[i].arrAirport.name);
                                $(this).closest(".m-traffics").find("[data-name=depCity] [name=cnName]").val(data.flightList[i].depCity.cnName);
                                $(this).closest(".m-traffics").find("[data-name=depAirport] [name=name]").val(data.flightList[i].depAirport.name);
                                $(".f-match-data").find("tr").hide();
                            })

                        }else{
                                $(self).closest(".m-traffics").find("[name=id]").val('');
                                $(self).closest(".m-traffics").find("[name=arrTime]").val('');
                                $(self).closest(".m-traffics").find("[name=depTime]").val('');
                                $(self).closest(".m-traffics").find("[name=plane]").val('');
                                $(self).closest(".m-traffics").find("[name=stop]").val('');
                                $(self).closest(".m-traffics").find("[name=schedule]").val('');
                                $(self).closest(".m-traffics").find("[data-name=airline] [name=name]").val('');
                                $(self).closest(".m-traffics").find("[data-name=arrCity] [name=cnName]").val('');
                                $(self).closest(".m-traffics").find("[data-name=arrAirport] [name=name]").val('');
                                $(self).closest(".m-traffics").find("[data-name=depCity] [name=cnName]").val('');
                                $(self).closest(".m-traffics").find("[data-name=depAirport] [name=name]").val('');

                                $(self).closest(".m-traffics").find('.display-flight').find("tr").remove();
                                $(self).closest(".m-traffics").find('.f-match-data').find("tr").remove();

                        }
                    })
                }

            },
            listenInput:function(){
                $(".J-airplane-flight").on({
                        keyup: function(e) {
                          
                            if (e.keyCode === 8) {
                                service.propTable.apply(this);
                            } else {
                                service.propTable.apply(this);
                            }

                        },
                        blur: function() {

                        },
                        focus: function() {

                            service.propTable.apply(this);
                        }

                    })
            },
            getHotelItem: function(item) {
                item = item || {};
                var tips = "<span class='J_HotelTips' style='text-align:center'>港马数据库中发现以下{n}个名称类似的酒店，<span style='color:red'>点击酒店名称</span>完成选择(选择后用户可以看到酒店介绍)</span>";
                var $tar = $(template("tmp_step_trip_hotel_specific_item", item));


                Tour.utils.initAutocomplete($(".hotelName", $tar), {
                    hotType: tips,
                    lineId: Tour.current.lineId,
                    noResultSetNull: false,
                    minChars: 2,
                    renderCallback: function(data) {
                        $(".unconfirmedHotel").hide();
                        var rows = $.isArray(data) ? data : data.list;
                        var $hot = $(this).parent().parent().find(".hottip");
                        if ($.isArray(rows)) {
                            $hot.html(tips.template({
                                "n": rows.length
                            }));
                            $hot.show();
                        } else {
                            $hot.hide();
                        }
                    }
                }, function(e, data) {
                    if (data) {
                        $(this).parent().parent().find("input[name='id']").val(data.id);
                    } else {
                        $(this).parent().parent().find("input[name='id']").val("");

                    }
                },'',function(){
                   arguments[0].closest('.input-group').find(".t-default-hotel").html(service.getGradeHotel());
                   
                },function(){
                    service.setNightNumber();
                });
                return $tar;
            },
            getTraffic: function(traffic) {
                traffic = traffic || {
                    "transportation": "",
                    "confirmed": 1
                };
                var getShiftType = function(type) {
                    var shifttype;
                    if (type == "airplane") {
                        shifttype = "参考航班";
                    } else if (type == "train") {
                        shifttype = "列车车次";
                    } else if (type == "bus") {
                        shifttype = "参考班次";
                    } else if (type == "ship") {
                        shifttype = "游轮号";
                    } else if (type == "custom") {
                        shifttype = "参考班次";
                    } else {
                        shifttype = "参考班次";
                    }
                    return shifttype;
                }
                var $traffic = $(template("tmp_step_trip_traffic", $.extend({}, traffic, {
                    "shifttype": getShiftType(traffic.transportation)
                })));
 

                $traffic.on("click", ".J_unconfirmed", function() {
                    var $elm = $(this);
                    if ($elm.hasClass("active_checkbox")) {
                        service.loadFlights($traffic);
                        $elm.removeClass("active_checkbox").find('.J_checkbox').removeClass('active');
                        $("[name=confirmed]", $traffic).val(1);
                    } else {
                        $(".flights", $traffic).hide();
                        $(".flight-tips", $traffic).hide();
                        $(".__shift", $traffic).show();
                        $traffic.find("data[data-name=flight] :input").val("");
                        $elm.addClass("active_checkbox").find('.J_checkbox').addClass('active');
                        $("[name=confirmed]", $traffic).val(0);
                    }
                }).on("change", ":input[name=transportation]", function() {
                    var $traffic = $(this).closest(".traffics");
                    var type = $(this).val();

                    //显示交通的按钮
                    //
                    if($(this).val()=="custom"){

                        $(this).closest(".traffics").find("[data-del-action]").css({display:"none"});
                        $(this).closest(".addTraffic").find(".J_add_traffics").hide();
                    }else{
                        $(".J_traffics").find("[data-del-action]").css({display:"inline-block"});
                        $(this).closest(".addTraffic").find(".J_add_traffics").show();  
                    }
                     
                    //默认交通/航班 重置已确认
                    $("[name=confirmed]", $traffic).val(1);
                    var shifttype = getShiftType(type);
                    $(".__shift_text", $traffic).text(shifttype);

                    if (type == "airplane") {
                        $(".J_unconfirmed", $traffic).show();
                        $(".flight-tips", $traffic).show();
                        $(this).closest('.form-inline').find(".flights").show();
                        var inputVal = $(this).closest(".m-traffics").find(".J-airplane-flight").val("");
                        service.listenInput();
                    } else {
                        $(this).closest('.form-inline').find(".flights").hide();
                        $(this).closest(".m-traffics").find("[name=id]").val('');
                        $(this).closest(".m-traffics").find("[name=arrTime]").val('');
                        $(this).closest(".m-traffics").find("[name=depTime]").val('');
                        $(this).closest(".m-traffics").find("[name=plane]").val('');
                        $(this).closest(".m-traffics").find("[name=stop]").val('');
                        $(this).closest(".m-traffics").find("[name=schedule]").val('');
                        $(this).closest(".m-traffics").find("[data-name=airline] [name=name]").val('');
                        $(this).closest(".m-traffics").find("[data-name=arrCity] [name=cnName]").val('');
                        $(this).closest(".m-traffics").find("[data-name=arrAirport] [name=name]").val('');
                        $(this).closest(".m-traffics").find("[data-name=depCity] [name=cnName]").val('');
                        $(this).closest(".m-traffics").find("[data-name=depAirport] [name=name]").val('');
                        $(this).closest(".m-traffics").find('.display-flight').find("td").remove();
                        $(this).closest(".m-traffics").find('.f-match-data').find("tr").remove();
                    }



                }).on("click", ".J_updateBtn", function() {
                    service.loadFlights($traffic);
                }).on("");
                $(":input[name=transportation]", $traffic).val(traffic.transportation);
                if (traffic.transportation == 'airplane') {
                    if (traffic.flight && traffic.flight.id && traffic.flight.id != "") {
                        var $flight = service.getTrafficsFlight(traffic.flight);
                        $(".flightInfo tbody", $traffic).append($flight);
                        $(".__shift", $traffic).hide();
                        $flight.click();
                    }
                }
                return $traffic;
            },
            getTrafficsFlight: function(flight) {

                var $tar = $(template("tmp_step_trip_traffic_flight", flight));
                $tar.data("flight", flight);
                $tar.on("click", function() {
                    var $tr = $(this);
                    if ($tr.hasClass("selected")) {
                        $tr.removeClass("selected");
                        $tar.closest(".traffics").find("data[data-name=flight] :input").val("");
                    } else {
                        $tr.parent().find("tr").removeClass("selected");
                        $tr.addClass("selected");
                        var $flight = $tr.closest(".traffics").find("[data-name=flight]");
                        var data = $tar.data("flight");
                        $flight.find("[name=id]").val(data.id);
                        $flight.find("[name=arrTime]").val(data.arrTime);
                        $flight.find("[name=depTime]").val(data.depTime);
                        $flight.find("[name=plane]").val(data.plane);
                        $flight.find("[name=stop]").val(data.stop);
                        $flight.find("[name=schedule]").val(data.schedule);
                        $flight.find("[data-name=airline] [name=name]").val(data.airline.name);
                        $flight.find("[data-name=arrCity] [name=cnName]").val(data.arrCity.cnName);
                        $flight.find("[data-name=arrAirport] [name=name]").val(data.arrAirport.name);
                        $flight.find("[data-name=depCity] [name=cnName]").val(data.depCity.cnName);
                        $flight.find("[data-name=depAirport] [name=name]").val(data.depAirport.name);
                    }
                });
                return $tar;
            },
            loadFlights: function($traffic) {
                $(".flights", $traffic).show();
                $(".J_updateBtn", $traffic).hide();
                $(".__shift", $traffic).hide();
                var depCityId = $("[data-name=departurePlace] [name=id]", $traffic).val();
                var arrCityId = $("[data-name=destination] [name=id]", $traffic).val();
                var $elm = $(".J_unconfirmed", $traffic).removeClass("active_checkbox").find('.J_checkbox').removeClass('active');
                if (arrCityId && arrCityId != "" && depCityId && depCityId != "") {
                    $("[name=shift]", $traffic).val("");
                    var $page = $(".page", $traffic);
                    $page.find(".pagination").remove();
                    $page.append("<div class='pagination'></div>");
                    $page.find(".pagination").pagination({
                        dataSource: "/flight?depCityId=" + depCityId + "&arrCityId=" + arrCityId + "&format=json&_" + Math.random(),
                        locator: "flightList",
                        triggerPagingOnInit: true,
                        hideWhenLessThanOnePage: true,
                        getTotalPageByResponse: function(d) {
                            return d.pagination.pageCount
                        },
                        alias: {
                            pageNumber: 'page',
                            pageSize: 'size'
                        },
                        totalNumber: 50,
                        pageSize: 5,
                        callback: function(d, p) {
                            var $tbody = $(".flightInfo tbody", $traffic);
                            $tbody.empty();
                            if (d.length != 0) {
                                var selected = $("[data-name=flight] [name=id]", $traffic).val();
                                $(d).each(function() {
                                    $tbody.append(service.getTrafficsFlight($.extend(this, {
                                        'selected': selected == this.id
                                    })));
                                });
                            } else {
                                $tbody.append("<tr style='height:60px;'><td colspan=8><h2>暂时没有航班数据</h2></td></tr>");
                            }
                        }
                    });
                }
            },
            getSchedule: function(trip) {
                //时间日程安排类型： [AMPM:上午下午, TIME: 时间, CUSTOM: 自定义，一段话描述]
                trip = trip || {};
                trip.timeType = trip.timeType || "CUSTOM";
                var type = trip.timeType;
                var $schedule = $(template("tmp_step_trip_schedule", trip));
                if (trip.schedules) {
                    var i = 0;
                    $(trip.schedules).each(function() {
                        $(".daily", $schedule).append(service.getScheduleItem($.extend({
                            idx: i++
                        }, this), type));
                    });
                } else {
                    $(".daily", $schedule).append(service.getScheduleItem());
                }
                $schedule.on("click", ".J_switchCustom", function() {
                    var $li = $(this);
                    if ($li.hasClass("active_checkbox")) return;
                    $.confirm(
                        "切换方式后,您当前输入的内容将被清除",
                        "是否确认切换？",
                        function() {
                            $(".J_switchTime", $schedule).removeClass("active_checkbox").find('.J_radio').removeClass('active');
                            $("[name=timeType]", $schedule).val("CUSTOM");
                            if (!$li.hasClass("active_checkbox")) {
                                $li.addClass("active_checkbox").find('.J_radio').addClass('active');
                                $(".daily [data-name=schedules]", $schedule).each(function() {
                                    destoryUEditorBySelector($(this).find('textarea[isinit=1]'));
                                    Tour.current.jsondom.remove($(this));
                                });
                                $(".daily", $schedule).append(service.getScheduleItem({}, "CUSTOM"));
                                $(".__add_schedule", $schedule).hide();
                            }
                            $("textarea[tag=edit]", $schedule).each(function() {
                                initUEditor({
                                    textareaObj: $(this),
                                    touristLineId: Tour.current.lineId,
                                    galleryImageTypeObj: $("#editorGalleryImageType")
                                });
                            });
                        },
                        function() {}
                    );
                }).on("click", ".J_switchTime i", function() {
                     var $li = $(this).closest('li');
                    if ($li.hasClass("active_checkbox")) return;
                    $.confirm(
                        "切换方式后,您当前输入的内容将被清除",
                        "是否确认切换？",
                        function() {
                            var timeType = $('.timeType', $schedule).val();
                            $("[name=timeType]", $schedule).val(timeType);
                            $(".J_switchCustom", $schedule).removeClass("active_checkbox").find('.J_radio').removeClass('active');
                            if (!$li.hasClass("active_checkbox")) {
                                $li.addClass("active_checkbox").find('.J_radio').addClass('active');
                                $(".daily [data-name=schedules]", $schedule).each(function() {
                                    destoryUEditorBySelector($(this).find('textarea[isinit=1]'));
                                    Tour.current.jsondom.remove($(this));
                                });
                                $(".daily", $schedule).append(service.getScheduleItem({}, timeType));
                                $(".selectTime").val(timeType);
                                $(".__add_schedule", $schedule).show();
                            }
                            $("textarea[tag=edit]", $schedule).each(function() {
                                initUEditor({
                                    textareaObj: $(this),
                                    touristLineId: Tour.current.lineId,
                                    galleryImageTypeObj: $("#editorGalleryImageType")
                                });
                            });
                        },
                        function() {}
                    );
                }).on("click", ".__add_schedule", function() {
                    if ($("[data-name=schedules]", $schedule).length >= 10) {
                        Tour.utils.showError($(this), "最多添加10条日程安排");
                        return false;
                    }
                    var timeType = $("[name=timeType]", $schedule).val();
                    $(".daily", $schedule).append(service.getScheduleItem({}, timeType));
                    $("textarea[tag=edit]", $schedule).each(function() {
                        initUEditor({
                            textareaObj: $(this),
                            touristLineId: Tour.current.lineId,
                            galleryImageTypeObj: $("#editorGalleryImageType")
                        });
                    });
                }).on("change", ".timeType", function() {
                    var $typeTypeDiv = $(".daily", $schedule);
                    var type = $(this).val();
                    $("[name=timeType]", $schedule).val(type);
                    if (type == "AMPM") {
                        $(".timeSelect", $typeTypeDiv).parent().hide();
                        $("[name=time]", $typeTypeDiv).val("上午");
                        $(".ampmSelect", $typeTypeDiv).val("上午").parent().show();
                        $(".__time", $schedule).addClass("when2");
                        $(".__time", $schedule).removeClass("when");
                    } else if (type == "TIME") {
                        $(".__time", $schedule).addClass("when");
                        $(".__time", $schedule).removeClass("when2");
                        $(".ampmSelect", $typeTypeDiv).parent().hide();
                        $("[name=time]", $typeTypeDiv).val("0:0");
                        $(".timeSelect", $typeTypeDiv).val("0").parent().show();
                    }
                });
                return $schedule;
            },
            getScheduleItem: function(schedule, type) {
                type = type || "CUSTOM";
                schedule = schedule || {
                    type: type
                };
                if (type == "CUSTOM") {
                    return template("tmp_step_trip_schedule_inshort", schedule);
                } else {
                    var $t = $(template("tmp_step_trip_schedule_time", schedule));
                    if (type == "AMPM") {
                        $(".timeSelect", $t).parent().hide();
                        $(".__time", $t).addClass("when2");
                        $(".ampmSelect", $t).val(schedule.time);
                    } else if (type == "TIME") {
                        $(".ampmSelect", $t).parent().hide();
                        $(".__time", $t).addClass("when");
                        if (schedule.time && schedule.time != "") {
                            var arr = schedule.time.split(":");
                            $(".timeSelect.hour", $t).val(arr[0]);
                            $(".timeSelect.minute", $t).val(arr[1]);
                        }
                    }
                    var $time = $("[name=time]", $t);
                    $t.on("change", ".timeSelect", function() {
                        var v = $(".timeSelect.hour", $t).val() + ":" + $(".timeSelect.minute", $t).val();
                        $time.val(v);
                    }).on("change", ".ampmSelect", function() {
                        $time.val($(this).val());
                    });
                    return $t;
                }
            },
            //每天
            getDailyTrip: function(trip) {
                var $tar = $(template("tmp_step_dailytrip", $.extend({}, trip, {
                    "random": new Date().getTime()
                })));
                //初始化酒店子项

                $(".hotelInfo", $tar).append(service.getHotel(trip));
              
                //初始化交通
                if (trip.traffics && trip.traffics.length > 0) {
                    var $traffics = $(".J_traffics", $tar);
                    var i = 0;
                    $(trip.traffics).each(function() {
                        // if(){}
                        $traffics.append(service.getTraffic($.extend({
                            idx: i++
                        }, this)));
                    });

                    $traffics.show();
                }
                //初始化日程
                $(".daily_trip_item._schedule", $tar).append(service.getSchedule(trip));
                return $tar;
            },
            // 设置几晚
            setNightNumber: function() {
                Tour.current.jsondom.refresh($body);
                var nightsOld = Tour.current.data.nights;
                var nights = 0;
                var dailyTrip = Tour.current.data.dailyTrips;
                for (var i = 0; i < dailyTrip.length; i++) {
                    var hotel = dailyTrip[i].hotels;
                    if (null != hotel && hotel.length>0 && hotel[0].name) {
                        nights++;
                    }
                }

                $("input[name=nights]").val(nights > 0 ? (nights) : '');
            }
        }
        var $body = $(".input_body #trip");
        var $addDays;
        var pager;
        var inited = false;
        var currentLoad;
        var module = {
            load: function(end) {
                
                var start = currentLoad || currentLoad === 0 ? (currentLoad + 1) : 0;
                for (var i = start; i <= end && i < Tour.current.data.dailyTrips.length; i++) {
                    var $tar = $(service.getDailyTrip($.extend({
                        idx: i,
                        index: i + 1
                    }, Tour.current.data.dailyTrips[i])));
                    $(".step_tripBody").append($tar);
                    if(i === end){
                        var st = Tour.current.data.dailyTrips[i].traffics;

                        if(st && !(st.length>0)){        

                            $(".J_traffics").eq(i).html(service.getTraffic());
                            service.listenInput();
                            $(".J_traffics").eq(i).find(".m-traffics").eq(0).find("[data-del-action]").css({display:"none"});
                            $(".addTraffic").eq(i).find(".J_add_traffics").eq(0).css({display:"none"});

                            
                        }
                    }
                    $("textarea[tag=edit]", $tar).each(function() {
                        initUEditor({
                            textareaObj: $(this),
                            touristLineId: Tour.current.lineId,
                            galleryImageTypeObj: $("#editorGalleryImageType")
                        });
                    });
                }
                if (currentLoad < end) {
                    currentLoad = end >= Tour.current.data.dailyTrips.length ? Tour.current.data.dailyTrips.length - 1 : end;
                }

                $(".mask").hide();
                $(".loading-wrap").hide();
            },
            hide: function() {
                $body.hide();
            },
            show: function() {
                $("#nextBtn").show();
                $("#btnSave").hide();
                //var windowHeight = $(window).height();
                $body.show();
                viewport.scrollTop(0);
                var step_tripBody = $('.step_tripBody');
                if (step_tripBody.length) {
                    var posTop = step_tripBody.offset().top;
                    $(".days").css({
                        "top": posTop + 'px'
                    }).show().attr("data-top", posTop);
                }
                //$(".days").css({"top": $('.step_tripBody').position().top + 'px'}).show();
            },

            clear: function() {
                currentLoad = null;
                inited = false;
                $body.html("");
                viewport.unbind("scroll.step_trip");
                // $(window).unbind("resize");
                //init_step_top();
            },
            isInit: function() {
                return inited;
            },
            init: function(config) {

                config = config || {
                    init_jsondom_event: true
                };
                inited = true;
                //日程总模板
                var tpl = template("tmp_step_trip", {});
                $context = $(tpl);
                $body.html(tpl);
                $menuDay = $(".menu_day");
                $addDays = $('#addDays');

                pager = (function() {
                    //右侧天数菜单
                    var page = 1;
                    var pagesize = 10;
                    var $pagepre = $(".page .pre");
                    var $pagenext = $(".page .next");
                    //天数菜单
                    $pagepre.click(function() {
                        pager.prePage();
                        pager.refresh();
                    });
                    $pagenext.click(function() {
                        pager.nextPage();
                        pager.refresh();
                    });
                    //右侧天数菜单 end
                    return {
                        locate: function(day) {
                            var p = day / pagesize;
                            var pint = parseInt(p);
                            return p > pint ? pint + 1 : pint;
                        },
                        load: function(p) {
                            p = p > pager.lastPage() ? pager.lastPage() : p;
                            var start = (p - 1) * pagesize;
                            $menuDay.html("");
                            for (var i = start; i < Tour.current.data.dailyTrips.length && i < start + pagesize; i++) {
                                $menuDay.append("<li day='{index}'>第{day}天</li>".template({
                                    index: i + 1,
                                    day: toCNNumber(i + 1)
                                }));
                            }
                            page = p;
                            pager.refresh();
                        },
                        lastPage: function() {
                            if (Tour.current.data.dailyTrips.length <= 10) {
                                return 1;
                            } else {
                                var p = Tour.current.data.dailyTrips.length / 10;
                                var pint = parseInt(Tour.current.data.dailyTrips.length / 10);
                                var last = p > pint ? pint + 1 : pint;
                                return last;
                            }
                        },
                        nextPage: function() {
                            if (page < pager.lastPage()) {
                                pager.load(page + 1);
                                return true;
                            } else {
                                return false;
                            }
                        },
                        prePage: function() {
                            if (page > 1) {
                                pager.load(page - 1);
                                return true;
                            } else {
                                return false;
                            }
                        },
                        hasNext: function() {
                            return page < pager.lastPage();
                        },
                        hasPre: function() {
                            return page > 1
                        },
                        currentPage: function() {
                            return page;
                        },
                        refresh: function() {
                            pager.hasPre() ? $pagepre.addClass("active") : $pagepre.removeClass("active");
                            pager.hasNext() ? $pagenext.addClass("active") : $pagenext.removeClass("active");
                    },
                    pagesize: pagesize
                    };
                })();

                var activeMenuDay = function(day) {
                    var scrollTop = viewport.scrollTop(); //滚动条距离顶部的高度
                    var t = scrollTop < 50 ? 50 : offset;
                    var length = $('.daily_trip').length;
                    var fixBar = $(".secondbar-fixed");
                    var barHeight = fixBar.length ? fixBar.height() : 0;
                    var viewHeight = viewport.height();
                    var scrollHegiht = viewport[0].scrollHeight;

                    if (!day) {

                        // 如果页面滚到最底部
                        if (scrollTop >= scrollHegiht - viewHeight) {
                            day = length;
                        } else {
                            $('.daily_trip').each(function(i) {
                                /*
                                 * 在容器内滚动时，需注意：
                                 *
                                 * offset().top是到body的距离而不是容器的  -- 故需要减去容器距顶部的距离
                                 * 容器滚动时 offset().top 也会随着变化    -- 故需要加上滚动的距离
                                 */

                                var cur = $(this),
                                    top = cur.offset().top - viewportTop - barHeight - 20,
                                    //top = cur.offset().top - viewportTop + scrollTop,
                                    nextObj = cur.next();
                                nextTop = nextObj.length && nextObj.offset().top - viewportTop - barHeight - 20;

                                if (nextObj.length) {
                                    if (0 < top) {
                                        day = 1;
                                        return false;
                                    }

                                    if (0 >= top && 0 < nextTop) {
                                        day = i + 1;
                                        return false;
                                    }
                                } else {
                                    day = length;
                                }
                            });
                        }

                        // 刷新分页菜单
                        if (pager.locate(day) != pager.currentPage()) {
                            pager.load(pager.locate(day));
                        }

                        // 加载更多
                        if (Tour.current.data.dailyTrips.length != length) {
                            if (scrollTop >= scrollHegiht - viewHeight - 200) {

                                module.load(day);
                            }
                        }
                    }

                    $("li.active", $menuDay).removeClass("active");
                    $("li[day=" + day + "]", $menuDay).addClass("active");
                }
                //$(window).resize(function () {          //滚动条距离顶部的高度
                //    var windowHeight = $(window).height();
                //    var daysHeight = $(".days").height();
                //    var t = windowHeight - daysHeight;
                //    if (t < 0) {
                //        $(".days").css({"top": "0px"});
                //    }
                //    else {
                //        //$(".days").css({"top": t / 2 + "px"});
                //    }
                //});
                var timer = null;
                var polling = 0;
                viewport.on("scroll.step_trip", function() {

                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function() {
                        var scrollTop = $(this).scrollTop(); //滚动条距离顶部的高度
                        var scrollHeight = this.scrollHeight; //当前页面的总高度
                        var windowHeight = $(this).height(); //当前可视的页面高度
                        var days = $(".days");
                        if ($(".scope-toolbar").hasClass("secondbar-fixed")) {
                            days.css("top", "130px");
                        } else {
                            days.css("top", days.attr("data-top") + "px");
                        }
                        activeMenuDay();
                        if (scrollTop + windowHeight + 10 >= scrollHeight) {
                            if (currentLoad) {
                                $("#load_day").show();
                                setTimeout(function() {
                                    module.load(currentLoad + 1);
                                    $("#load_day").hide();
                                }, 300);
                            }
                        }
                    }, polling);
                });

                this.updateDays();

                //点击事件.第几天
                $menuDay.on("click", "li", function() {
                    var day = parseInt($(this).attr("day"));
                    module.load(day - 1);
                    var top = $(".daily_trip[data-index=" + (day - 1) + "]").offset().top - viewportTop + viewport.scrollTop();
                    var stepHeight = $('.nav-step-wrap').height();
                    // top -= offset - 50;
                    viewport.animate({
                        scrollTop: top - stepHeight - 20
                    }, 500);
                });
                //判断菜单的浮动
                function setNav() {
                    // var bar = $(".nav-step").height();
                    // var h = bar + 110;
                    // var fixedObj = $(".nav-step").parent();
                    // var scrollTop = $("#page-content-viewport").scrollTop();
                    // if (scrollTop > h) {
                    //     fixedObj.css({left: fixedObj.parent().offset().left, width: fixedObj.parent().width()}).addClass("top_step");
                    // } else if (scrollTop <= h) {
                    //     fixedObj.css({left: 0}).removeClass("top_step");
                    // }
                    $(".nav-step .active").click();
                }

                $(".order").click(function() {
                    var content = "<ul class='sortable' style='overflow-x:hidden;overflow-y:scroll;width:300px;'>";
                    for (var i = 0; i < Tour.current.data.dailyTrips.length; i++) {
                        content += '<li class="ui-state-default" index="{index}"><span class="gm-icon gm-sort"></span>第{day}天</li>'.template({
                            "index": i + "",
                            "day": toCNNumber(i + 1)
                        });
                    }
                    content += "</ul>";
                    var d = $.dialog({
                        title: "拖动调整行程顺序",
                        content: content,
                        padding: 0,
                        isOuterBoxShadow: false,
                        //show: false,
                        isClose: true,
                        lock: true,
                        fixed: true,
                        resize: false,
                        opacity: .4,
                        isClickShade: false,
                        init: function() {
                            $(".sortable", this.content()).sortable();
                        },
                        ok: function() {
                            Tour.current.jsondom.refresh($body);
                            var idx = 0;
                            var oldarr = Tour.current.data.dailyTrips;
                            var newarr = new Array();
                            $("li", this.content()).each(function() {
                                var oldidx = parseInt($(this).attr("index"));
                                newarr.push(oldarr[oldidx]);
                            });
                            Tour.current.data.dailyTrips = newarr;
                            module.clear();
                            module.init({
                                init_jsondom_event: false
                            });
                            module.show();
                        },
                        okCssClass: "btn-process",
                        cancel: $.noop,
                        cancelCssClass: "aui_state_highlight"
                    });
                });

                function eatUnchecked(obj) {
                    obj.removeClass('eat_active').find('.J_checkbox').removeClass('active');
                    obj.find('input').val(0);
                }

                var $content = $(".step_trip", $body);
                $($content).on("click", ".J_stepBtn", Tour.nextStep)
                    .on("click", ".addDay", function() {
                        module.addDaliyTrip(this, 1,"dropdown");
                    })
                    .on("click", ".eat .__click", function() {
                        var li = $(this);
                        if (li.hasClass("eat_active")) {
                            li.removeClass("eat_active").find('.J_checkbox').removeClass('active');
                            li.find("input").val(0);
                        } else {
                            li.addClass("eat_active").find('.J_checkbox').addClass('active');
                            li.find("input").val(1);
                        }
                    })
                //酒店
                .on("click", ".hotels .__grade", function() {

                    var li = $(this);
                    var item = li.closest(".daily_trip_item");
                    $("li.__hotel", item).removeClass("active_checkbox").find('.J_radio').removeClass('active');
                    var hotelInfo = item.find(".hotelInfo");
                    if (li.hasClass("active_checkbox")) {
                        li.removeClass("active_checkbox").find('.J_radio').removeClass('active')
                        hotelInfo.empty();
                        $("input[name='custom']", item).val("");
                    } else {
                        li.addClass("active_checkbox").find('.J_radio').addClass('active');
                        hotelInfo.html(service.getGradeHotel());
                        $("input[name='custom']", item).val(1);
                    }
                    // 设置几天几晚
                    service.setNightNumber();
                })
                //酒店星级事件
                .on("click", ".daily_trip_item .unconfirmedHotel li", function() {

                    var li = $(this);
                    $("li", li.parent()).removeClass("active_checkbox").find('.J_radio').removeClass('active');
                    li.addClass("active_checkbox").find('.J_radio').addClass('active');
                    li.closest(".unconfirmedHotel").find("input[name='grade']").val(li.attr("tag"));
                    li.closest(".input-group").find(".hotelName").val(li.attr("tag"));
                    li.closest(".input-group").find(".hotelName").removeAttr('style');  
                    li.closest(".unconfirmedHotel").remove();
                     service.setNightNumber();
                })
                //指定酒店
                .on("click", ".hotels .__hotel", function() {
                    var li = $(this);
                    var item = li.closest(".daily_trip_item");
                    $("li.__grade", item).removeClass("active_checkbox").find('.J_radio').removeClass('active');
                    var hotelInfo = item.find(".hotelInfo");
                    if (li.hasClass("active_checkbox")) {
                        li.removeClass("active_checkbox").find('.J_radio').removeClass('active');
                        hotelInfo.empty();
                        $("input[name='custom']", item).val("");
                    } else {
                        li.addClass("active_checkbox").find('.J_radio').addClass('active');
                        hotelInfo.html(service.getHotel());
                        $("input[name='custom']", item).val(0);
                        //默认添加一条
                        $(".__add_hotel_item", item).click();
                        $("[data-del-action]", hotelInfo).hide();
                    }
                    // 设置几天几晚
                    service.setNightNumber();
                }).on("click", ".daily_trip_item .specificHotel .__add_hotel_item", function() {
                    var hotel = $(this).closest(".specificHotel").find(".items");
                    if ($("li[data-name=hotels]", hotel).length >= 5) {
                        Tour.utils.showError($(this), "至多填写5个酒店");
                    } else {
                        hotel.append(service.getHotelItem());
                        $("[data-del-action]", hotel).show();
                    }
                })
                //交通
                .on("click", ".J_add_traffics", function() {
                    $(this).hide();
                    $(this).closest('li').addClass('addtra-m-c')
                    $item = $(this).closest(".daily_trip_item");
                    if ($("[data-name=traffics]", $item).length >= 5) {
                        Tour.utils.showError($(this), "至多填写5条交通方式");
                    } else {
                        var $tar = service.getTraffic();
                        $(".J_updateBtn", $tar).hide();
                        $item.find(".J_traffics").append($tar).show();
                        service.listenInput();
                    }
                })


                // 底部添加一天
                .on('click', '[data-del-action]', function() {

                     module.updateDays(1);
                            var currentBoxLen = $(this).closest('.J_traffics').find('.m-traffics');
                            //删除交通只剩一个的时候触发的事件，执行默认的操作
                             if(currentBoxLen.length === 1){
                                 $(this).closest('.J_traffics').append(service.getTraffic());
                                  service.listenInput();
                                  $(this).closest('.addTraffic').find("[data-del-action]").hide();
                                  $(this).closest('.addTraffic').find(".J_add_traffics").hide();
                             }
                             $(this).closest('.J_traffics').find(".m-traffics").length <= 1 ? $(this).closest('.addTraffic').find(".addtra-m-c").removeClass('addtra-m-c'): "";

                        });

                    $addDays.on('click', 'li a', function(e) {
                        var day = $(this).data('value');
                        var $dropdown = $(this).parents('.dropdown');
                        module.addDaliyTrip($dropdown, day,"dropdown");
                        $dropdown.removeClass('open');
                        return false;
                    }).on('click', '.dropdown', function(e) {
                        if ($(this).hasClass('disabled')) {
                            return false;
                        }

                        if (e.target.tagName != 'SPAN') {
                            var day = $(this).find('em').text();
                            //本地多加了一个参数dropdown，来识别是添加一天
                            module.addDaliyTrip(this, day,"dropdown");
                        }
                    });

                    //日程安排
                    //至顶
                    $(".control .top").click(function() {
                        viewport.animate({
                            scrollTop: 0
                        }, 500);
                    });

                    //加载每天日程
                    if (Tour.current.data && Tour.current.data.dailyTrips) {
                        module.load(2);
                         
                        if(!$(".m-traffics").length){
                            var $tar = service.getTraffic(); 
                             $(".J_traffics").html($tar);
                             
                        }
                        service.listenInput();
                        var switchTraffics = Tour.current.data.dailyTrips;

                        for(var i=0;i<switchTraffics.length;i++){
                            if(switchTraffics[i].traffics){
                                 var len = switchTraffics[i].traffics.length;
                                 if(!len){
                                    $(".J_traffics").eq(i).html(service.getTraffic());
                                    $(".J_traffics").eq(i).find(".m-traffics").eq(0).find("[data-del-action]").css({display:"none"});
                                    $(".addTraffic").eq(i).find(".J_add_traffics").eq(0).css({display:"none"});
                                    $(".addTraffic").eq(i).find(".J_add_traffics").eq(0).css({display:"none"});
                                 }
                                for(var j=0;j<len;j++){

                                    if(switchTraffics[i].traffics[0].transportation === "custom"){
                                       $(".J_traffics").eq(i).find(".m-traffics").eq(0).find("[data-del-action]").css({display:"none"});
                                       $(".addTraffic").eq(i).find(".J_add_traffics").eq(0).css({display:"none"});
                                    }
                                }   
                            }else{

                                $(".J_traffics").eq(i).find(".m-traffics").eq(0).find("[data-del-action]").css({display:"none"});
                                $(".addTraffic").eq(i).find(".J_add_traffics").eq(0).css({display:"none"});
                            }


                             
                            
                        }
                       
                         
                    } else {

                        for (var i = 0; i < 3; i++) {
                            var html = service.getDailyTrip({
                                index: i + 1
                            });;
                            $(".step_tripBody").append(html);
                        }

                        Tour.current.jsondom.refresh($body);
                        currentLoad = 2;
                        pager.load(1);
                    }

                    $("textarea[tag=edit]").each(function() {
                        initUEditor({
                            textareaObj: $(this),
                            touristLineId: Tour.current.lineId,
                            galleryImageTypeObj: $("#editorGalleryImageType")
                        });
                    });
                    if (config.init_jsondom_event) {
                        Tour.current.jsondom.event.beforeRemove.push(function(action, target) {
                            if (target.attr("data-del-target") == "hotel") {
                                if ($("[data-del-target=hotel]", target.parent()).length == 1) {
                                    Tour.utils.showError($(action), "至少保留1个酒店");
                                    return false;
                                } else if ($("[data-del-target=hotel]", target.parent()).length == 2) {
                                    $("[data-del-action]", target.parent()).hide();
                                }
                            };
                            return true;
                        });
                        Tour.current.jsondom.event.beforeRemove.push(function(action, target) {
                            if (target.attr("data-del-target") == "schedule") {
                                if ($("[data-del-target=schedule]", target.parent()).length == 1) {
                                    Tour.utils.showError($(action), "至少保留一日安排");
                                    return false;
                                }
                            };
                            return true;
                        });
                        Tour.current.jsondom.event.beforeRemove.push(function(action, target) {
                            if (target.attr("data-del-target") == "trip") {
                                if (Tour.current.data.dailyTrips.length == 1) {
                                    Tour.utils.showError($(action), "至少保留1天行程");
                                    return false;
                                }
                            };
                            return true;
                        });
                        Tour.current.jsondom.event.afterRemove.push(function(action, target) {
                            if (target.attr("data-del-target") == "trip") {
                                $("[data-name=dailyTrips]", $body).each(function() {
                                    var n = parseInt($(this).attr("data-index")) + 1;
                                    var day = toCNNumber(n);
                                    $(".__day", this).text('第' + day + '天');
                                    $(".J_arrow_icon", this).text(day);
                                });
                                //当前加载天数减1天
                                currentLoad -= 1;
                                service.setNightNumber();
                                if (currentLoad < 3) {
                                    module.load(2);
                                }
                                pager.load(pager.currentPage());
                                $(".all_days").text(Tour.current.data.dailyTrips.length);
                            }
                        });
                    }
                    pager.load(1); activeMenuDay(1);
                    //几天几晚
                    var nights = Tour.current.data.nights; $(".all_days").text(Tour.current.data.dailyTrips.length); $(".nights").val(nights >= 0 ? nights : "");
                },
                submit: function() {
                    var vaild = Tour.utils.vaildDatas($context);
                    $("[data-name=departurePlace] [name=id],[data-name=destination] [name=id]").each(function() {
                        var $this = $(this);
                        if ($this.val() == "") {
                            vaild = false;
                            Tour.utils.showError($("[name=cnName]", $this.parent()), "请选中列表中的区域.");
                        }
                    });
                    if (!vaild) return false;
                    $("textarea[tag=edit]").each(function() {
                        //KindEditor.removePlaceholder($(this));
                        UE.getEditor($(this).attr('editorId')).execCommand('removePlaceHolder');
                    });
                    var day = Tour.current.data.dailyTrips.length;
                    var nights = $(".nights").val();
                    nights = "" == nights || null == nights ? 0 : nights * 1;
                    if (day > nights && nights >= (day - 3) && nights >= 0) {
                        Tour.current.jsondom.refresh($body);
                        return true;
                    } else {
                        var msg = "住宿信息有误，请调整后重试<br>（至少为" + (day + "天" + ((day - 3) > 0 ? (day - 3) : 0)) + "晚，当日添加酒店，则自动+1晚）";
                        Tour.utils.showError($(".nights"), msg);
                        return false;
                    }
                },
                // 底部添加1天
                updateDays: function(length) {
                    var max = maxDay - Tour.current.data.dailyTrips.length + (length || 0);
                    var i = 1;
                    var str = '';
                    var oldDays = $addDays.find('em').text();

                    if (max > 10) {
                        max = 10;
                    }

                    if (max) {
                        for (; i <= max; i++) {
                            str += '<li><a href="javascript:void(0);" data-value="' + i + '">添加' + i + '天</a></li>';
                        }

                        if (oldDays > max) {
                            $addDays.find('em').text(max);
                        }

                        $addDays.find('.btn').removeClass('disabled');
                    } else {
                        $addDays.find('.btn').addClass('disabled');
                    }

                    $addDays.find('ul').html(str);
                },
                // 添加行程
                addDaliyTrip: function(el, num) {
                    if (Tour.current.data.dailyTrips.length == maxDay) {
                        Tour.utils.showError($(el), "最多添加" + maxDay + "天行程");
                        return false;
                    }
                    var $tar = '';
                    var oldDayLength = Tour.current.data.dailyTrips.length;
                    //加载全部天数
                    this.load(Tour.current.data.dailyTrips.length);
                    for (var i = 1; i <= num; i++) {

                        if ($tar.length) {
                            $tar = $tar.add(service.getDailyTrip({
                                index: Tour.current.data.dailyTrips.length + i
                            }));
                            $tar.find(".J_traffics").html(service.getTraffic());

                        } else {
                            $tar = service.getDailyTrip({
                                index: Tour.current.data.dailyTrips.length + i
                            });
                        }
                    }

                    $(".step_tripBody").append($tar);
                    if(arguments[2] === "dropdown"){  
                        var addTrafficHtml = service.getTraffic()  
                        var t = $(".J_traffics").length;
                       $(".J_traffics").eq(t-1).html(addTrafficHtml);
                       service.listenInput();
                       $tar.find(".J_add_traffics_h").hide(); 
                       $tar.find(".J_traffics").find("[data-del-action]").hide();  

                    }          
                    $("textarea[tag=edit]", $tar).each(function() {
                        initUEditor({
                            textareaObj: $(this),
                            touristLineId: Tour.current.lineId,
                            galleryImageTypeObj: $("#editorGalleryImageType")
                        });
                    });
                    Tour.current.jsondom.refresh($tar);
                    currentLoad = currentLoad != null && currentLoad >= 0 ? currentLoad + num : 0;
                    
                    if(oldDayLength + 1 > pager.pagesize){
                        pager.load(pager.lastPage());
                    }else{
                        pager.load(pager.currentPage());
                    }

                    $menuDay.find('li').eq(oldDayLength == pager.pagesize ? 0 : oldDayLength % pager.pagesize).click();

                    //添加天数
                    $(".all_days").text(Tour.current.data.dailyTrips.length);

                    this.updateDays();
                }
            }
            w.Tour = w.Tour || {};
            w.Tour.module = w.Tour.module || {};
            w.Tour.module.trip = w.Tour.module.trip || {};
            $.extend(w.Tour.module.trip, module);
        }))(jQuery, window);



          