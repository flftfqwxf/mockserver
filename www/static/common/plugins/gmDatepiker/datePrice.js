;( function( $, window, undefined ) {
	'use strict';
	
	// global
	var $window = $( window ),
		Modernizr = window.Modernizr;

	$.DatePrice = function( options ) {
		$.DatePrice.prototype._init( options );
	};
	function _getBasePath() {
		var els = document.getElementsByTagName('script'), src;
		for (var i = 0, len = els.length; i < len; i++) {
			src = els[i].src || '';
			if (/datePrice[\w\-\.]*\.js/.test(src)) {
				return src.substring(0, src.lastIndexOf('/') + 1);
			}
		}
		return '';
	}
	var basePath = _getBasePath();
	
	$.DatePrice.defaults = {
		objId: 'date_price',
		defaultData: new Array(), // [{"datetime":"","prices":[{"成人价":""},{"儿童价":""}]}]
		themesPath : basePath,
		width:'',
		height: '',
		minYear:2000,
		maxYear:2099,
		showMore:false,
		dateFmt:"yyyy-MM-dd",
		realDateFmt:"yyyy-MM-dd",
		realTimeFmt:"HH:mm:ss",
		Week : ['日','一','二','三','四','五','六'], 
		nowDate : new Date(),
		dayTdIdFix: 'gm-datePrice-day-',
		dayTdIdFixFun: function(data){}
	};
	$.DatePrice.prototype = {
		_init : function( options ) {
			this.options = $.extend( true, {}, $.DatePrice.defaults, options );
			this._validate();
			this._initDate();
		},
		_validate : function( options ) {
			if('' == this.options.objId || null == this.options.objId){
				this.options.urlid = 'date_price';
			}
		},
		_getNowFullYear: function(options){
			return this.options.nowDate.getFullYear();
		},
		_getNowMonth: function(options){
			return (this.options.nowDate.getMonth())*1+1;
		},
		_getNowDate: function(options){
			return this.options.nowDate.getDate();
		},
		_getNowHours: function(options){
			return this.options.nowDate.getHours();
		},
		_getNowMinutes: function(options){
			return this.options.nowDate.getMinutes();
		},
		_getNowTime: function(options){
			return this.options.nowDate.getTime();
		},
		_getDateDay: function(d){
			return d.getDay();
		},
		_getMaxDate: function(year, month){
			var d = new Date(year,month,0);
			return d.getDate();
		},
		_initDate : function (options){
			this._setDateObj(options);
			
		},
		_setDateObj : function(options){
			var s_this = this;
			var nowYear = s_this._getNowFullYear();
			var nowMonth = s_this._getNowMonth();
			var objHtml = '<div class="gm_date_price">\n\t'+
							'<div class="gm_date_price_title">\n\t\t'+
								'<div class="gm_date_price_prov"></div>\n\t\t'+
								'<div class="gm_date_price_next"></div>\n\t<span id="gm_date_price_show_year">'+nowYear+"年"+nowMonth+"月</span>"+
								'<input type="hidden" value="" name="gm_date_price_default" id="gm_date_price_default" />'+
							'</div>\n\t'+
							'<div class="gm_date_price_ct"><table cellpadding="0" cellspacing="0"></table></div>\n'+
						   '</div>';
			$("#"+this.options.objId).html(objHtml);
			$("#"+this.options.objId).find(".gm_date_price_prov").click(function(){
				var dtStr = $("#gm_date_price_default").val();
				dtStr = dtStr.replace(/-/g,"/");
				var d = new Date(dtStr);
//				var dtArr = dtStr.split("-");
//				var d = new Date(dtArr[0], dtArr[1], dtArr[2]);
				var this_D = s_this._getProvMonthYestdy(d);
				s_this._defaultDates(s_this.options, obj, this_D);
			});
			$("#"+this.options.objId).find(".gm_date_price_next").click(function(){
				var dtStr = $("#gm_date_price_default").val();
				dtStr = dtStr.replace(/-/g,"/");
				var d = new Date(dtStr);
				var this_D = s_this._getNextMonthYestdy(d);
				s_this._defaultDates(s_this.options, obj, this_D);
			});
			var obj = $("#"+this.options.objId).find("table");
			this._defaultDates(this.options, obj, this._getLatelyDay(this.options));
		},
		_defaultDates: function(options, obj, thisDate){
			var fDay = 1;
			var year = thisDate.getFullYear();
			var month = (thisDate.getMonth())*1 + 1;
			var lastDay = this._getMaxDate(year, month);
			$("#gm_date_price_default").val(this._formatDate(thisDate, this.options.dateFmt));
			$("#gm_date_price_show_year").text(year+"年"+month+"月");
			var str = "<tr>";
			for(var d=0; d < options.Week.length ; d++){
				str += '<th><span>'+options.Week[d]+'</span></th>';
			}
			str +="</tr>";
			var n=1;
			for(var i = fDay; i <= lastDay; i++){
				if(n%7 == 1){
					str += '<tr>';
				}
				if(1 == i){
					var t_day = this._getDateDay(new Date(year,(month*1-1),i));
					for(var n_td = 0; n_td < t_day; n_td ++){
						str += '<td class="no_date">&nbsp;</td>';
						n++;
					}
				}
				str += '<td><div class="td_content" id="'+this.options.dayTdIdFix+i+'"><p class="dayNumber">'+i+'</p>';
				str += '</div></td>';
				if(n%7 == 0){
					str += '</tr>';
				}
				if(i == lastDay && n%7 != 0){
					for(var n_td = n%7; n_td < 7; n_td++){
						str += '<td class="no_date">&nbsp;</td>';
					}
					str += '</tr>';
				}
				n++;
			}
			obj.html(str);
			this.setDayPrice(options, thisDate);
		},
		setDayPrice : function(options, homeDate){
			var defData = options.defaultData;
			var home_year = homeDate.getFullYear();
			var home_month = homeDate.getMonth() + 1;
			if(defData.length > 0){
				for(var i = 0; i < defData.length; i++){
					var thisDayData = defData[i];
					// 解析日期
					thisDayData.date = thisDayData.date.replace(/-/g,"/");
					var this_date = new Date(thisDayData.date);
					var this_day = this_date.getDate();
					var this_year = this_date.getFullYear();
					var this_month = this_date.getMonth() + 1;
					if(home_year == this_year && home_month == this_month){
						var thisDayDataList = thisDayData.dateGroupPrices;
						if(thisDayData.priceNumber > 1 ){
							var moreHTML = '<span class="morePreice"></span>';
							if(options.showMore){
								moreHTML += '<div class="more_price_show">';
								for(var d = 0 ; d < thisDayDataList.length ; d++){
									var defPreice = thisDayDataList[d].prices;
									for(var j = 0 ; j < defPreice.length ; j++){
										moreHTML += '<div class="price_li"><span class="price_type">'+defPreice[j].type+'</span><span class="prices">¥'+defPreice[j].price+'</span></div>';
									}
								}
								moreHTML += '</div>';
							}
							$("#"+this.options.dayTdIdFix+this_day).append(moreHTML);
						}
						$("#"+this.options.dayTdIdFix+this_day).click(function(){
							var _index = $(this).attr("price_list_index");
							$(this).parent().parent().parent().find(".td_content.on").each(function(){
								$(this).removeClass("on");
							});
							$(this).addClass("on");
							if(null != options.dayTdIdFixFun && 'function' == typeof options.dayTdIdFixFun && null != _index && "" != _index){
								options.dayTdIdFixFun(defData[_index]);
							}else{
								var showMore = '<div class="gm_datePriceMoreDialog"><div class="gm_datePriceMoreDialog_close">X</div><div class="gm_datePriceMoreDialog_bg"></div><div class="gm_datePriceMoreDialog_list">';
								for(var d = 0 ; d < thisDayDataList.length ; d++){
									var defPreice = thisDayDataList[d].prices;
									for(var j = 0 ; j < defPreice.length ; j++){
										showMore += '<div class="price_li"><span class="price_type">'+defPreice[j].type+'</span><span class="prices">¥'+defPreice[j].price+'</span></div>';
									}
								}
								showMore += '</div></div>';
								$("body").append(showMore);
								$(".gm_datePriceMoreDialog").find(".gm_datePriceMoreDialog_close").click(function(){
									$(".gm_datePriceMoreDialog").remove();
								});
							}
						});
						var sale="";
						if(this.options.activity == true){
							sale="sale";
						}
						$("#"+this.options.dayTdIdFix+this_day).attr("price_list_index", i).addClass("set").addClass(sale).append('<p class="prices">¥'+thisDayData.minPrice+'</p>');
					}
				}
			}
		},
		_formatDate : function(date, format) {   
		    if (!date) return;   
		    if (!format) format = "yyyy-MM-dd";   
		    switch(typeof date) {   
		        case "string":   
		            date = new Date(date.replace(/-/, "/"));   
		            break;   
		        case "number":   
		            date = new Date(date);   
		            break;   
		    }    
		    if (!date instanceof Date) return;   
		    return date.format(format);
//		    var dict = {   
//		        "yyyy": date.getFullYear(),
//		        "M": date.getMonth() + 1,   
//		        "d": date.getDate(),   
//		        "H": date.getHours(),   
//		        "m": date.getMinutes(),   
//		        "s": date.getSeconds(),   
//		        "MM": ("" + (date.getMonth() + 101)).substr(1),   
//		        "dd": ("" + (date.getDate() + 100)).substr(1),   
//		        "HH": ("" + (date.getHours() + 100)).substr(1),   
//		        "mm": ("" + (date.getMinutes() + 100)).substr(1),   
//		        "ss": ("" + (date.getSeconds() + 100)).substr(1)
//		    };
//		    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
//		        return dict[arguments[0]];
//		    });
		},
		_getProvMonthYestdy : function(date){
			var daysInMonth = new Array([0],[31],[28],[31],[30],[31],[30],[31],[31],[30],[31],[30],[31]);
			var strYear = date.getFullYear();
			var strMonth = date.getMonth()+1;
			var strDay = date.getDate();
			if(strYear%4 == 0 && strYear%100 != 0){
		        daysInMonth[2] = 29;
		     }
			if(strMonth - 1 == 0){
				strYear -= 1;
				strMonth = 12;
			}else{
				strMonth -= 1;
			}
			strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
			if(strMonth<10){
		        strMonth="0"+strMonth;
			}
			if(strDay<10){
		        strDay="0"+strDay;
		    }
		    var datastr = strYear+"-"+strMonth+"-"+strDay;
		    datastr = datastr.replace(/-/g,"/");
		    return new Date(datastr);
		},
		_getNextMonthYestdy : function(date){
			var daysInMonth = new Array([0],[31],[28],[31],[30],[31],[30],[31],[31],[30],[31],[30],[31]);
			var strYear = date.getFullYear();
			var strMonth = date.getMonth()+1;
			var strDay = date.getDate();
			if(strYear%4 == 0 && strYear%100 != 0){
		        daysInMonth[2] = 29;
		     }
			if(strMonth + 1 > 12){
				strYear += 1;
				strMonth = 1;
			}else{
				strMonth += 1;
			}
			if(strDay<10){
		        strDay="0"+strDay;
		    }
		    var datastr = strYear+"-"+strMonth+"-"+strDay;
			datastr = datastr.replace(/-/g,"/");
		    return new Date(datastr);
		},
		_getLatelyDay : function(options){
			var defData = options.defaultData;
			var latelyDay = null;
			var interval = 0;
			for(var i = 0; i < defData.length; i++){
				var thisDayInterval = this._compareDay(new Date(defData[i].date.replace(/-/g,"/")), options.nowDate);
				if(thisDayInterval > 0 && (latelyDay == null || thisDayInterval <= interval)){
					interval = thisDayInterval;
					latelyDay = defData[i].date;
				}
			}
			return null != latelyDay ? new Date(latelyDay.replace(/-/g, "/")) : options.nowDate;
		},
		_compareDay : function(day, confimDay){
			dayConfim = (this._formatDate(confimDay, "yyyy-MM-dd") + " 00:00:00").replace(/-/g,"/");
			dayOne = (this._formatDate(day, "yyyy-MM-dd") + " 00:00:00").replace(/-/g,"/");
			var dayOne = new Date(dayOne);
			var dayConfim = new Date(dayConfim);
			return (Date.parse(dayOne)-Date.parse(dayConfim))/3600/1000;
		}
	};
})( jQuery, window );

/**
 * 时间对象的格式化;
 */
Date.prototype.format = function(format) {
    /*
     * eg:format="YYYY-MM-dd hh:mm:ss";
     */
    var o = {
        "M+" :this.getMonth() + 1, // month
        "d+" :this.getDate(), // day
        "h+" :this.getHours(), // hour
        "m+" :this.getMinutes(), // minute
        "s+" :this.getSeconds(), // second
        "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" :this.getMilliseconds()
    // millisecond
    }
 
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    }
 
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}