var Plan = Plan || {};
Date.prototype.format = function(fmt) {
	if (!fmt)
		fmt = "yyyy-MM-dd";
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
template.helper('dateFormat', function(date) {
	if (!date || date.length < 10)
		return "";
	var d = new Date(date.substring(0, 10).replace(/-/g, "/"));
	return d.format("yyyy年MM月dd日")
});
template.helper('priceFormat', function(price) {
	return parseInt(price || "0");
});
template.helper('join', function(array, separator) {
	return array.join(separator);
});

// 跟团游（指定日期发团 ＋ 天天发团）日期、价格渲染逻辑及事件绑定
(function($) {
	var c = "selected";

	//要删除的数据dom
	function Group(ctx, data) {
		ctx.on("click", ".J_add_priceitem", function() {
			addPriceItem({
				type: ctx.find(".J_price_table").find(">div").length ? "" : "成人价"
			});
		}).on("click", ".J_price_table .del_tr", function() {
			var curr = $(this).closest("div");
			if (curr.parent().find(">div").length == 1) {
				Plan.u.showMsg($(this), {
					msg : "至少添加一条价格"
				})
			} else {
				Tour.current.jsondom.remove(curr);
			}
		}).on("click", ".J-bed", function() {
			var J_price_tablet = $(this).closest('.J_price_table');
			if ($(this).hasClass('active')) {
				$tpl_price_child = template("tpl_price_child", data);
				J_price_tablet.find("input[name='bed']").val(false);
				J_price_tablet.find(".input-Juxtaposed").eq(0).after($tpl_price_child);
				J_price_tablet.find(".child_price_bed").remove();
			} else {
				holdDelData = "bed";
				$tpl_price_child = template("tpl_price_bed", data);
				J_price_tablet.find(".input-Juxtaposed").eq(0).after($tpl_price_child);
				$(this).closest('.input-Juxtaposed').remove();
				J_price_tablet.find("input[name='bed']").val(true);
			}
		}).on("keyup", ".sin-room-price-input", function() {			
			$(this).closest(".J_price_table").find(".sin-room-price").val($(this).val()); 
		});
		var $datepicker = ctx.find(".datepicker"), $dates = ctx.find(".dates");
		function addPrices(d) {

			var $tar = ctx.find(".J_price_table"), len = $tar.find(">div").length;
			if (len >= 5) {
				Plan.u.showMsg(e, {
					msg : "最多可以添加5个价格"
				})
				return false;
			}
			addPriceItem(d);
			if (!d || !d.prices) {
				d = {
					prices : [ {
						type : len ? "" : "成人价"
					} ]
				};
				addPriceItem(d.prices[0]);
			}
			// 去除第一个价格的删除按钮
			if ($tar.find('>div').length > 0) {
				$($tar.find('>div')[0]).find('.del_tr').remove();
			}
		}
		function addPriceItem(d) {
			var ary = ['成人价', '儿童价', '儿童占床', '儿童不占床'];
			var price = d.prices;
			if(price){
				d.prices = price.sort(function(a, b){
					return $.inArray(a.type, ary) - $.inArray(b.type, ary);
				});
			}
					var $tpl_price_item = $(template("tpl_price_item", d));
					ctx.find(".J_price_table").html($tpl_price_item);
			// 渲染的时候判断是否勾选
			$tpl_price_item.find(".J-bed").hasClass('active') && $tpl_price_item.find("input[name='bed']").val(true);		
		}
		function addDateItem(d) {
			$dates.append(template("tpl_price_date_item", d));
			$dates.validationEngine('hide');
		}
		function addDates(d) {
			$.each(d.dates || [], function(k, v) {
				addDateItem($.extend({idx: k}, v));
			});
		}
		function toDay(m) {
			$datepicker.datepicker("setDate", m);
			$datepicker.find(".ui-state-active").removeClass("ui-state-active");
			$dates.find(".dataItem").each(function() {
				var d = this.id.split("-"), day = parseInt(d[2]);
				$datepicker.find("td[data-month=" + (parseInt(d[1]) - 1) + "][data-year=" + d[0] + "]").each(function() {
					$.trim($(this).text()) == day ? $(this).find("a").addClass(c) : "";
				})
			})
		}
		var datepicker_cfg = function(cfg) {
			return $.extend($.datepicker.regional["zh-CN"], {
				dateFormat : "yy-mm-dd",
				disabled : true,
				showOtherMonths : true,
				selectOtherMonths : true,
				changeAllMonth : true,
				minDate : new Date()
			}, cfg);
		}
		addPrices(data);
		addDates(data);
		var isCharter = data && data.charter || false;
		isCharter = isCharter ? 1 : 0;
		var charterContent = template("tpl_charter", {
			'charter' : isCharter
		});
		ctx.find("[name='airline.name']").autocomplete("/flight/airlines.json", {
			minChars : 0,
			clickFire : true,
			requestParamName : "code",
			showOthers : false,
			pagination : false,
			hotType : charterContent, // 设置头部
			width : 190,
			top : 34,
			noDataShow : true,
			extraParams : {
				size : 100,
				count : 100
			},
			parse : function(data) {
				var parsed = [];
				var rows = $.isArray(data) ? data : data.airlines;
				if (rows && rows.length) {
					for (var i = 0; i < rows.length && i < 6; i++) {
						var row = rows[i];
						parsed.push({
							data : row,
							value : row.name,
							result : row.name
						})
					}
				}
				return parsed;
			},
			formatItem : function(row, i, max) {
				if (!row.name)
					return "";
				return row.code + " " + row.name;
			},
			renderCallback : function(data){
				var rows = $.isArray(data) ? data : new Array();
				var $hot = $(this).parent().find(".ac_results");
				var $tips = "<span class='tips' style='margin: 5px 6px;text-align:center;color:#757575;'>*点击航空公司名称完成选择</span>";
				//if (rows.length > 0) {
				//	$hot.find(".hottip").show();
				//} else {
				//	$hot.find(".hottip").hide();
				//}
				if (rows.length > 0 && $hot.find(".tips").length == 0) {
					$hot.append($tips);
				} else if (rows.length == 0){
					$hot.find(".tips").remove();
				}
			}
		}).result(function(v, d) {
			var $itemsObj = $(this).closest(".dataItems");
			$itemsObj.find("[data-name=airline] [name=id]").val(d && d.id || "");
			$itemsObj.find("[data-name=airline] [name=code]").val(d && d.code || "");
			if (!d) {
				$itemsObj.find("[data-name=airline] [name=id]").val("");
				$itemsObj.find("[data-name=airline] [name=code]").val("");
				$(this).css("color", "#a3a3a3");
			}

		});

		var $startDate = $datepicker.filter('[name="startDate"]');
		var $endDate = $datepicker.filter('[name="endDate"]');
		var hasDate;

		function setMinMaxDate(obj, date){
			if(obj.name == 'startDate'){
				var d = new Date(date);
				d.setDate(d.getDate() + 200); // 200

				$endDate.datepicker('option', 'minDate', date);
				$endDate.datepicker('option', 'maxDate', d);
			}else if(obj.name == 'endDate'){
				$startDate.datepicker('option', 'maxDate', date);
			}
		}

		$datepicker.each(function(i) {
			var $self = $(this);
			if ($self.is("input")) {
				if(this.value){
					hasDate = true;
				}

				$self.datepicker(datepicker_cfg({
					disabled : false,
					onSelect: function(date){
						$(this).removeClass("placeholdersjs");

						setMinMaxDate(this, date);
					}
				}));
			} else {
				$self.on("mousedown", "a", function(e) {
					$(".J-all-remove").show();
					var $t = $(this), h = $t.attr("data-handler"),
					    td=$($t).parent(),
					    year=parseInt(td.attr("data-year")),
					    month=parseInt(td.attr("data-month"))+1,
					    day=parseInt($.trim($t.text()));
					month=month<10?"0"+month:month;
					day=day<10?"0"+day:day;
					if($("[id="+(year+"-"+month+"-"+day)+"]").size()>0){
					    $.showMsg("多组报价内不能出现相同的日期","danger")
					    return false;
					}
					if (h) {
						var t = $self.find(".ui-datepicker-calendar").find("td:eq(10)"), date = getDateByStr(t);
						var defaultValues = new Array();
						$dates.find(".dataItem").each(function() {
							defaultValues.push(this.id);
						});
						if (h == "next")
							date.setMonth(date.getMonth() + 1);
						else if (h == "prev")
							date.setMonth(date.getMonth() - 1);
						toDayShow($self, date.format(), defaultValues);
					} else if ($t.parent().attr("data-year") && $t.parent().attr("data-month")) {
						var date = getDateByStr($t.closest("td"));
						if ($t.hasClass(c)) {
							$t.removeClass(c);
							Tour.current.jsondom.remove($("#" + date.format(), $dates));
						} else {
							if ($dates.find(".dataItem").length > 29) {
								$self.validationEngine('showPrompt','最多可以添加30个日期','error');
								return false;
							}
							$t.closest("td").attr("date-id", date.format());
							$t.addClass(c);
							addDateItem({
								date : date.format()
							});
						}
					}
				}).datepicker(datepicker_cfg({
					monthSetCallBack : function(inst) {
						var str = (inst.selectedYear
								+ "-"
								+ (inst.selectedMonth + 1)
								+ "-"
								+ inst.selectedDay + " 00:00:00")
								.replace(/-/g, "/");
						var dateThis = new Date(str);
						inst.input.datepicker("setDate", dateThis.format());
						inst.dpDiv.find(".ui-state-active").removeClass("ui-state-active");
						var defaultValues = new Array();
						$dates.find(".dataItem").each(function() {
							defaultValues.push(this.id);
						});
						$.datepicker._selectDiyDays(inst, defaultValues);
					}
				}));
				var defaultValues = new Array();
				$dates.find(".dataItem").each(function() {
					defaultValues.push(this.id);
				});
				toDayShow($self, $dates.find(".dataItem:eq(0)").attr("id") || new Date().format(), defaultValues);
			}
		});

		if(hasDate){
			$datepicker.each(function(i) {
				if($(this).is('input')){
					setMinMaxDate(this, this.value);
				}
			});
		}


		// 团期删除按钮绑定事件
		$dates.on("click", "i.del_date_item", function() {
			// var dateItemLen = $dates.find('.dataItem').length;
			// if (dateItemLen <= 1) {
			// 	Plan.u.showMsg($dates, {
			// 		msg : "至少添加一个日期"
			// 	});
			// 	return false;
			var parentBox = $(this).closest('.table-pos');
			if(parentBox.find(".dataItem").length==1){
				parentBox.find(".J-all-remove").hide();
			}
			$($datepicker.find("td[date-id='" + $(this).closest(".dataItem").attr("id") + "']")).find("a." + c).removeClass(c);
			Tour.current.jsondom.remove($(this).closest(".dataItem"));
		});

		$(".J-all-remove").on("click",function(){
			var t = $(this).closest(".table-date-price");
			t.find(".selected").removeClass('selected');
			t.find(".dataItem").each(function(){
				Tour.current.jsondom.remove($(this));
			});
			
			$(this).hide();
		})
	}
	Plan.Group = Group;
})(jQuery);





(function($, w) {
	function inputToJson($s) {
		var t = {};
		$s.find("select:enabled,textarea:enabled,:text:enabled,input:hidden").each(function() {
			if (this.value == "" && $(this).attr("notempty") || this.name == "") {
				return;
			}
			if ($(this).val() == $(this).attr("placeholder")) {
				$(this).val("");
			}
			var arr = this.name.split(".");
			if (arr.length > 1) {
				if (!t[arr[0]]) {
					t[arr[0]] = {};
				}
				t[arr[0]][arr[1]] = this.value;
			} else {
				t[this.name] = this.value;
			}
		})
		return t;
	}
	function jsonToInput(json, p) {
		var data = [];
		$.each(json, function(k, v) {
			if (v == null) {
				return;
			}
			var o = {}, n = p + "." + k.replace("_", ".");
			if ($.isArray(v)) {
				$.each(v, function(i) {
					data = data.concat(jsonToInput(this, n + "[" + i + "]"));
				})
			} else if ($.isPlainObject(v)) {
				data = data.concat(jsonToInput(this, n));
			} else {
				o.name = n;
				o.value = v;
				data.push(o);
			}
		})
		return data;
	}

	var timer = null;
	function showMsg(e, msg, time) {
		return;
		if (!e.pageX) {
			var p = e.offset();
			e.pageX = p.left + (e.width() / 2);
			e.pageY = p.top + e.height();
		}
		var $msg = $("#msg");
		$msg.length && hide();
		$msg = $(template("tpl_msg", msg)).appendTo("body");
		$msg.css({
			top : e.pageY + 10 + "px",
			left : e.pageX - 10 + "px",
			zIndex : 999
		}).show().on("mouseover", function() {
			timer && clearTimeout(timer);
		}).on("mouseout setTimer", function() {
			timer = setTimeout(function() {
				hide();
			}, time || 3000);
		}).on("click", function() {
			$(this).remove();
		}).trigger("setTimer");
		function hide() {
			timer && clearTimeout(timer);
			$msg.remove();
		}
	}
	function submitForm(url, data, callback) {
		$.post(url, data, function(d) {
			if (d.result && !d.result.success) {
				$.cookie('message', '"false_操作失败，请稍后重试"', {path:'/'});
			} else {
				callback && callback(d);
			}
		}, 'json').fail(function() {
			$.gmMessage("操作失败，请稍后重试");
		}).always(function() {
			/*$(".loading-wrap").show();
			setTimeout(function() {
				$(".loading-wrap").hide();
			}, 700);*/
		});
	}
	function showError($tar, msg, pos, type) {
		$tar.validationEngine('showPrompt', msg, type || 'error', pos, true);
	}

	function hideError($tar) {
		$tar.validationEngine('hide');
	}

	function search(isClearName) {
		var $searchName = $("#searchForm").find("input[name='name']");
		if ($searchName.val() == $searchName.attr("placeholder") || isClearName) {
			$searchName.val("");
		}
		//$("#searchForm").submit();
	}
	w.u = {
		inputToJson : inputToJson,
		jsonToInput : jsonToInput,
		showMsg : showMsg,
		showError : showError,
		hideError : hideError,
		submitForm: function() {},
		//submitForm : submitForm,
		search : search
	}	
})(jQuery, Plan);


// 第一步初始化渲染及交互逻辑
((function($, w){

	var $content;
	var $body = $(".input_body #base");
	var inited = false;
	var $uploading = false;
	// attchment 
	var $files ;
	var $filediv;
	var $fbefore ;
	var $fdoing ; 
	var $fsuccess;
	var $fcancel;
	var $fcover;
	var $d_price_c;
	var u = Plan.u;


	// 渲染截止收客模板。
	function buildCloseOffDeadline(planData, isOnlyTouristLine) {
		var $closeOffDeadline = $body.find("#closedOffDeadline");
		var $lineObj = $body.find("[name='touristLine.id']");
		var recommonDeadLine = $lineObj.attr('data-deadline') || $lineObj.find("option:selected").attr('data-deadline');
		planData && !planData.hasOwnProperty('closedOffDeadline') && (planData['closedOffDeadline'] = recommonDeadLine);
		planData && isOnlyTouristLine && (planData['closedOffDeadline'] = recommonDeadLine);
		var closeOffDeadlineNew = template("tpl_closed_off_deadline", planData || {});
		$closeOffDeadline.html(closeOffDeadlineNew);
	}
	
	// function updateScroll(){
	// 	baseInfoTop = $("#base-info").offset().top - $planDialog.find(".listMain").offset().top;
	// 	groupPriceTop = $("#group-price").offset().top - $planDialog.find(".listMain").offset().top;
	// 	travelSetTop = $("#travel-set").offset().top - $planDialog.find(".listMain").offset().top;
	// 	addSetTop = $("#add-set").offset().top - $planDialog.find(".listMain").offset().top;
	// }

	// 跟团游－渲染团期报价模板。
	function buildGroupContent(d) {
		var $lineObj = $("#lineSelect");
		var recommendExtraPrice = $lineObj.find("option:selected").attr('recommendextraprice');
		var len = $d_price_c.find(".group").length;
		d = d && $.extend(d, {recommendExtraPrice : recommendExtraPrice, prideIndex : len}) || {recommendExtraPrice : recommendExtraPrice, prideIndex : len};
		var $new = $(template("tpl_price_group", d || {}));
		$('[id^=extraPrice-]').each(function(i, elem) {
			u.hideError($(elem));
		});
		$d_price_c.append($new);


		// 可能出现提示信息定位错误
		setTimeout(function() {
			if (!d.extraPrice && d.extraPrice != 0) {
				u.showError($("#extraPrice-" + len), '已根据市场行情自动设置加价金额，若不满意可自行修改', undefined, 'msg');
			}
		}, 0);
		return $new;
	}

	// 添加或渲染一组跟团游报价及团期
	function addGroup(d) {

		if (!isValid()) {
			return false;
		}
		var dateItemLen = $($d_price_c.find(".group")[$d_price_c.find(".group").length - 1]).find('.dataItem').length || 0;
		if (dateItemLen < 1) {
			u.showError($($d_price_c.find(".group")[$d_price_c.find(".group").length - 1]).find(".dates"), "至少添加一个日期");
			return false;
		}
		if ($d_price_c.find(".group").length == 10) {
			u.showMsg(e, {msg : "最多可以添加10组报价"});
		} else {
			var $new = buildGroupContent(d);
			new Plan.Group($new, d);
		}
	}

	// 添加或渲染一组自由行报价及团期
	// @data [object || undefined] data.product.items[i]
	function _addFreePlanGroup(data) {
		data = data || {};
		if (typeof data.extraPrice == 'undefined') {
			data.extraPrice = $("#lineSelect > option:selected").attr("recommendExtraPrice");
		}
		var c = "selected";
		var wrapper = $("#free_dialog_price");
		var dest = wrapper.find(".J_timeContent");
		dest.append(template("tpl_free_price_group", data));

		var ctx = dest.find("> .group:last-child");
		var $datepicker = ctx.find(".datepicker");
		var $dates = ctx.find(".dates");
		var $prices = ctx.find(".fgroup-wrapper");

		// 添加或渲染一组日期
		// @d [object || undefined] data.product.items[i].dates[i]
		function addDateItem(d) {
			$dates.append(template("tpl_price_date_item", d));
			$dates.validationEngine('hide');
		}
		// 渲染当前产品下该组报价的所有团期信息
		// @d [object || undefined] data.product.items[i].dates
		function addDates(d) {
			$.each(d.dates || [], function(k, v) {
				addDateItem($.extend({idx: k}, v));
			});
		}
		// 添加或渲染一组报价
		// @d [object || undefined] data.product.items[i].prices[i]
		function addPriceItem(d) {
			d = d || {};
			$prices.append(template("tpl_free_price_item", d));
			var wp = $prices.find(".fgroup:last-child");
			addHotels(wp, d);
			wp.on("click", ".hotel-group-wrapper i.del_date_item", function(e) {
				e.stopPropagation();
				var dateItemLen = wp.find('.removable-item').length;
				if (dateItemLen <= 1) {
					Plan.u.showMsg(wp, {
						msg : "至少添加一个酒店"
					});
					return false;
				}
				Tour.current.jsondom.remove($(this).closest(".removable-item"));
			});
		}
		// 渲染当前产品下该组报价下的所有报价信息
		// @d [object || undefined] data.product.items[i].prices
		function addPrices(d) {
			$.each(d.prices || [0], function(k, v) {
				addPriceItem(v ? $.extend({idx: k}, v) : {});
			});
		}
		// 渲染当前产品下该组报价下的所有酒店信息
		// @d [object || undefined] data.product.items[i].prices[i].hotels
		function addHotels(wp, d) {
			$.each(d.hotels || [0], function(k, v) {
				addHotelItem(wp, v ? $.extend({idx: k}, v) : {});
			});
			wp.find(".btn-add-free-hotel").on("click", function(e) {
				if (!isValid()) {
					return false;
				}
				addHotelItem(wp);
				return false;
			});
		}
		// 添加或渲染当前产品下该组报价下的某个酒店信息
		// @d [object || undefined] data.product.items[i].prices[i].hotels[i]
		function addHotelItem(wp, d) {
			var ctx = wp.find(".hotel-group-wrapper");
			ctx.append(template("tpl_free_hotel_item", d));
		}
		// 设为当天日期
		function toDay(m) {
			$datepicker.datepicker("setDate", m);
			$datepicker.find(".ui-state-active").removeClass("ui-state-active");
			$dates.find(".dataItem").each(function() {
				var d = this.id.split("-"), day = parseInt(d[2]);
				$datepicker.find("td[data-month=" + (parseInt(d[1]) - 1) + "][data-year=" + d[0] + "]").each(function() {
					$.trim($(this).text()) == day ? $(this).find("a").addClass(c) : "";
				})
			})
		}

		var datepicker_cfg = function(cfg) {
			return $.extend($.datepicker.regional["zh-CN"], {
				dateFormat : "yy-mm-dd",
				disabled : true,
				showOtherMonths : true,
				selectOtherMonths : true,
				changeAllMonth : true,
				minDate : new Date()
			}, cfg);
		};



		// 初始化渲染该组报价下的团期及报价信息
		addDates(data);
		addPrices(data);

		// 初始化航班选择控件
		var isCharter = data && data.charter || false;
		isCharter = isCharter ? 1 : 0;
		var charterContent = template("tpl_charter", {
			'charter' : isCharter
		});
		ctx.find("[name='airline.name']").autocomplete("/flight/airlines.json", {
			minChars : 0,
			clickFire : true,
			requestParamName : "code",
			showOthers : false,
			pagination : false,
			hotType : charterContent, // 设置头部
			width : 190,
			top : 34,
			noDataShow : true,
			extraParams : {
				size : 100,
				count : 100
			},
			parse : function(data) {
				var parsed = [];
				var rows = $.isArray(data) ? data : data.airlines;
				if (rows && rows.length) {
					for (var i = 0; i < rows.length && i < 6; i++) {
						var row = rows[i];
						parsed.push({
							data : row,
							value : row.name,
							result : row.name
						})
					}
				}
				return parsed;
			},
			formatItem : function(row, i, max) {
				if (!row.name)
					return "";
				return row.code + " " + row.name;
			},
			renderCallback : function(data){
				var rows = $.isArray(data) ? data : new Array();
				var $hot = $(this).parent().find(".ac_results");
				var $tips = "<span class='tips' style='margin: 5px 6px;text-align:center;color:#757575;'>*点击航空公司名称完成选择</span>";
				//if (rows.length > 0) {
				//	$hot.find(".hottip").show();
				//} else {
				//	$hot.find(".hottip").hide();
				//}
				if (rows.length > 0 && $hot.find(".tips").length == 0) {
					$hot.append($tips);
				} else if (rows.length == 0){
					$hot.find(".tips").remove();
				}
			}
		}).result(function(v, d) {
			var $itemsObj = $(this).closest(".dataItems");
			$itemsObj.find("[data-name=airline] [name=id]").val(d && d.id || "");
			$itemsObj.find("[data-name=airline] [name=code]").val(d && d.code || "");
			if (!d) {
				$itemsObj.find("[data-name=airline] [name=id]").val("");
				$itemsObj.find("[data-name=airline] [name=code]").val("");
				$(this).css("color", "#a3a3a3");
			}

		});

		// 初始化日历控件
		$datepicker.each(function(i) {
			var $self = $(this);
			if ($self.is("input")) {
				$self.datepicker(datepicker_cfg({
					disabled : false,
					onSelect: function(){
						$(this).removeClass("placeholdersjs");
					}
				}));
			} else {
				$self.on("mousedown", "a", function(e) {
					var $t = $(this), h = $t.attr("data-handler");
					if (h) {
						var t = $self.find(".ui-datepicker-calendar").find("td:eq(10)"), date = getDateByStr(t);
						var defaultValues = new Array();
						$dates.find(".dataItem").each(function() {
							defaultValues.push(this.id);
						});
						if (h == "next")
							date.setMonth(date.getMonth() + 1);
						else if (h == "prev")
							date.setMonth(date.getMonth() - 1);
						toDayShow($self, date.format(), defaultValues);
					} else if ($t.parent().attr("data-year") && $t.parent().attr("data-month")) {
						var date = getDateByStr($t.closest("td"));
						if ($t.hasClass(c)) {
							$t.removeClass(c);
							Tour.current.jsondom.remove($("#" + date.format(), $dates));
						} else {
							if ($dates.find(".dataItem").length > 29) {
								$self.validationEngine('showPrompt','最多可以添加30个日期','error');
								return false;
							}
							$t.closest("td").attr("date-id", date.format());
							$t.addClass(c);
							addDateItem({
									date : date.format()
							});
						}
					}
				}).datepicker(datepicker_cfg({
					monthSetCallBack : function(inst) {
						var str = (inst.selectedYear
								+ "-"
								+ (inst.selectedMonth + 1)
								+ "-"
								+ inst.selectedDay + " 00:00:00")
								.replace(/-/g, "/");
						var dateThis = new Date(str);
						inst.input.datepicker("setDate", dateThis.format());
						inst.dpDiv.find(".ui-state-active").removeClass("ui-state-active");
						var defaultValues = new Array();
						$dates.find(".dataItem").each(function() {
							defaultValues.push(this.id);
						});
						$.datepicker._selectDiyDays(inst, defaultValues);
					}
				}));
				var defaultValues = new Array();
				$dates.find(".dataItem").each(function() {
					defaultValues.push(this.id);
				});
				toDayShow($self, $dates.find(".dataItem:eq(0)").attr("id") || new Date().format(), defaultValues);
			}
		});

		// 团期删除按钮绑定事件
		$dates.on("click", "i.del_date_item", function() {
			// var dateItemLen = $dates.find('.dataItem').length;
			// if (dateItemLen <= 1) {
			// 	Plan.u.showMsg($dates, {
			// 		msg : "至少添加一个日期"
			// 	});
			// 	return false;
			// }
			$($datepicker.find("td[date-id='" + $(this).closest(".dataItem").attr("id") + "']")).find("a." + c).removeClass(c);
			Tour.current.jsondom.remove($(this).closest(".dataItem"));
		});

		// 验证表单，通过则添加一组报价信息
		ctx.find(".btn-add-free-price").on("click", function(e) {
			if (isValid()) {
				addPriceItem({});	
			}
			return false;
		});
	}

	// 渲染该产品下所有的报价及团期组
	// @planData [object || undefined] data.product
	function addFreePlanGroup(planData) {
		planData = planData || {};
		var items = planData.items && planData.items[0] && planData.items || [0];
		$.each(items, function(k, data) {
			// clone一个新对象，防止修改Tour.curret.jsondom中存储的原始数据
			_addFreePlanGroup(data ? $.extend({idx: k}, data) : data);
		});
		// 去除第一个价格/团期的删除按钮
		if ($("#free_dialog_price .J_timeContent > ,group").length > 0) {
			$("#free_dialog_price .J_timeContent > .group:eq(0)").find('> .group-wrapper > .delete-group').remove();
		}
	}

	// 详见_addFreePlanGroup(data)
	function _addShipPlanGroup(data) {
		data = data || {};
		if (typeof data.extraPrice == 'undefined') {
			data.extraPrice = $("#lineSelect > option:selected").attr("recommendExtraPrice");
		}
		var c = "selected";
		var wrapper = $("#ship_dialog_price");
		var dest = wrapper.find(".J_timeContent");
		dest.append(template("tpl_ship_price_group", data || {}));
		var ctx = dest.find("> .group:last-child");
		var $datepicker = ctx.find(".datepicker");
		var $dates = ctx.find(".dates");
		var $prices = ctx.find(".ship-group-wrapper");

		function addPriceItem(d) {
			$prices.append(template("tpl_ship_price_item", d || {}));
			$prices.validationEngine('hide');
		}
		function addPrices(d) {
			$.each(d.prices || [0], function(k, v) {
				addPriceItem(v ? $.extend({idx: k}, v) : v);
			});
		}
		function addDateItem(d) {
			$dates.append(template("tpl_price_date_item", d));
			$dates.validationEngine('hide');
		}
		function addDates(d) {
			$.each(d.dates || [], function(k, v) {
				addDateItem($.extend({idx: k}, v));
			});
		}
		function toDay(m) {
			$datepicker.datepicker("setDate", m);
			$datepicker.find(".ui-state-active").removeClass("ui-state-active");
			$dates.find(".dataItem").each(function() {
				var d = this.id.split("-"), day = parseInt(d[2]);
				$datepicker.find("td[data-month=" + (parseInt(d[1]) - 1) + "][data-year=" + d[0] + "]").each(function() {
					$.trim($(this).text()) == day ? $(this).find("a").addClass(c) : "";
				})
			})
		}

		var datepicker_cfg = function(cfg) {
			return $.extend($.datepicker.regional["zh-CN"], {
				dateFormat : "yy-mm-dd",
				disabled : true,
				showOtherMonths : true,
				selectOtherMonths : true,
				changeAllMonth : true,
				minDate : new Date()
			}, cfg);
		};

		addPrices(data);
		addDates(data);

		var isCharter = data && data.charter || false;
		isCharter = isCharter ? 1 : 0;
		var charterContent = template("tpl_charter", {
			'charter' : isCharter
		});
		ctx.find("[name='airline.name']").autocomplete("/flight/airlines.json", {
			minChars : 0,
			clickFire : true,
			requestParamName : "code",
			showOthers : false,
			pagination : false,
			hotType : charterContent, // 设置头部
			width : 190,
			top : 34,
			noDataShow : true,
			extraParams : {
				size : 100,
				count : 100
			},
			parse : function(data) {
				var parsed = [];
				var rows = $.isArray(data) ? data : data.airlines;
				if (rows && rows.length) {
					for (var i = 0; i < rows.length && i < 6; i++) {
						var row = rows[i];
						parsed.push({
							data : row,
							value : row.name,
							result : row.name
						})
					}
				}
				return parsed;
			},
			formatItem : function(row, i, max) {
				if (!row.name)
					return "";
				return row.code + " " + row.name;
			},
			renderCallback : function(data){
				var rows = $.isArray(data) ? data : new Array();
				var $hot = $(this).parent().find(".ac_results");
				var $tips = "<span class='tips' style='margin: 5px 6px;text-align:center;color:#757575;'>*点击航空公司名称完成选择</span>";
				//if (rows.length > 0) {
				//	$hot.find(".hottip").show();
				//} else {
				//	$hot.find(".hottip").hide();
				//}
				if (rows.length > 0 && $hot.find(".tips").length == 0) {
					$hot.append($tips);
				} else if (rows.length == 0){
					$hot.find(".tips").remove();
				}
			}
		}).result(function(v, d) {
			var $itemsObj = $(this).closest(".dataItems");
			$itemsObj.find("[data-name=airline] [name=id]").val(d && d.id || "");
			$itemsObj.find("[data-name=airline] [name=code]").val(d && d.code || "");
			if (!d) {
				$itemsObj.find("[data-name=airline] [name=id]").val("");
				$itemsObj.find("[data-name=airline] [name=code]").val("");
				$(this).css("color", "#a3a3a3");
			}

		});

		$datepicker.each(function(i) {
			var $self = $(this);
			if ($self.is("input")) {
				$self.datepicker(datepicker_cfg({
					disabled : false,
					onSelect: function(){
						$(this).removeClass("placeholdersjs");
					}
				}));
			} else {
				$self.on("mousedown", "a", function(e) {
					var $t = $(this), h = $t.attr("data-handler");
					if (h) {
						var t = $self.find(".ui-datepicker-calendar").find("td:eq(10)"), date = getDateByStr(t);
						var defaultValues = new Array();
						$dates.find(".dataItem").each(function() {
							defaultValues.push(this.id);
						});
						if (h == "next")
							date.setMonth(date.getMonth() + 1);
						else if (h == "prev")
							date.setMonth(date.getMonth() - 1);
						toDayShow($self, date.format(), defaultValues);
					} else if ($t.parent().attr("data-year") && $t.parent().attr("data-month")) {
						var date = getDateByStr($t.closest("td"));
						if ($t.hasClass(c)) {
							$t.removeClass(c);
							Tour.current.jsondom.remove($("#" + date.format(), $dates));
						} else {
							if ($dates.find(".dataItem").length > 29) {
								$self.validationEngine('showPrompt','最多可以添加30个日期','error');
								return false;
							}
							$t.closest("td").attr("date-id", date.format());
							$t.addClass(c);
							addDateItem( {
									date : date.format()
							});
						}
					}
				}).datepicker(datepicker_cfg({
					monthSetCallBack : function(inst) {
						var str = (inst.selectedYear
								+ "-"
								+ (inst.selectedMonth + 1)
								+ "-"
								+ inst.selectedDay + " 00:00:00")
								.replace(/-/g, "/");
						var dateThis = new Date(str);
						inst.input.datepicker("setDate", dateThis.format());
						inst.dpDiv.find(".ui-state-active").removeClass("ui-state-active");
						var defaultValues = new Array();
						$dates.find(".dataItem").each(function() {
							defaultValues.push(this.id);
						});
						$.datepicker._selectDiyDays(inst, defaultValues);
					}
				}));
				var defaultValues = new Array();
				$dates.find(".dataItem").each(function() {
					defaultValues.push(this.id);
				});
				toDayShow($self, $dates.find(".dataItem:eq(0)").attr("id") || new Date().format(), defaultValues);
			}
		});

		// 团期删除按钮绑定事件
		$dates.on("click", "i.del_date_item", function() {
			var dateItemLen = $dates.find('.dataItem').length;
			if (dateItemLen <= 1) {
				Plan.u.showMsg($dates, {
					msg : "至少添加一个日期"
				});
				return false;
			}
			$($datepicker.find("td[date-id='" + $(this).closest(".dataItem").attr("id") + "']")).find("a." + c).removeClass(c);
			Tour.current.jsondom.remove($(this).closest(".dataItem"));
		});

		$prices.on("click", "i.del_date_item", function(e) {
			e.stopPropagation();
			var dateItemLen = $prices.find('.ship-price-group').length;
			if (dateItemLen <= 1) {
				Plan.u.showMsg($prices, {
					msg : "至少添加一个报价"
				});
				return false;
			}
			// $(this).closest("[data-del-target]").remove();
			Tour.current.jsondom.remove($(this).closest(".removable-item"));
		});

		ctx.on("click", ".btn-add-ship-price", function() {
			addPriceItem({});
		});
	}

	// 详见addFreePlanGroup(data)
	function addShipPlanGroup(planData) {
		var items = planData && planData.items && planData.items[0] && planData.items || [0];
		$.each(items, function(k, data) {
			_addShipPlanGroup(data ? $.extend({idx: k}, data) : data);
		});
		// 去除第一个价格/团期的删除按钮
		if ($("#ship_dialog_price .J_timeContent > ,group").length > 0) {
			$("#ship_dialog_price .J_timeContent > .group:eq(0)").find('> .group-wrapper > .delete-group').remove();
		}
	}


	// 初始化添加跟团游报价及团期组
	function addGroupPlanGroup(planData) {
		// 更新天天发团或者指定发图日期选中状态
		if (planData && planData.items && planData.items[0] && planData.items[0].type == "everyday") {
			$d_price.find(":radio[value=everyday]")[0].checked = true;
			$d_price.find(":radio[value=everyday]").parent().addClass("active").siblings().removeClass("active");
		} else {
			$d_price.find(":radio[value=date]")[0].checked = true;
			$d_price.find(":radio[value=date]").parent().addClass("active").siblings().removeClass("active");
		}
		// 编辑模式 － 初始化已经填写的团期及报价信息
		// 新增模式 － 初始化一组空的团期及报价信息
		$d_price.find(":radio:checked[name=__type]").trigger("change", planData && [ planData.items ]);
		// 去除第一个价格/团期的删除按钮
		if ($d_price_c.find(".group").length > 0) {
			$($d_price_c.find(".group")[0]).find('.delete-group').remove();
		}
	}

	// 表单验证 ＋ 团期（不是form元素， 额外处理）
	function isValid() {
		var $form = $("#form");
		if (window.Placeholders && !Placeholders.nativeSupport) {
			Placeholders.disable($form[0]);
		}
		var flag = true;
		var tourType = $("#plan-tourtype").val();
		var dateType = $(":radio[name=__type]:checked", $content).val();
		var ctx = tourType == "freewalker" ?
			$("#free_dialog_price") :
				tourType == "ship" ?
					$("#ship_dialog_price") : $("#dialog_price");
		if (tourType != "group" || dateType != "everyday") {
			var dates = $(".J_timeContent > .group .dates", ctx);
			for (var i = 0, l = dates.length; i < l; ++i) {
				if ($(dates[i]).find("> .dataItem").length == 0) {
					flag = false;
					Tour.utils.showError($(dates[i]), "至少添加一个日期", "topLeft");
					break;
				}
			}
		}
		
		if (flag) {
			flag = flag && $form.validationEngine('validate');
			if (window.Placeholders && !Placeholders.nativeSupport) {
				Placeholders.enable($form[0]);
			}
		}
		return flag;
	}


	// attchment end
	var module = {
			hide : function(){
				$body.hide();
			},
			show : function(){
				$("#nextBtn").show();
				$("#btnSave").hide();
				$body.show();
				
				//init flash upload .隐藏层后.flash失效.需要重新init
				$files_ad = $(".product-ad .upFileInfo");
				$filediv_ad = $(".product-ad .upfile");
				$fbefore_ad = $(".beforeUp", $filediv_ad);
				$fdoing_ad = $(".doingUp", $filediv_ad); 
				$fsuccess_ad = $(".successUp", $filediv_ad);
				$fcancel_ad = $(".cancle", $filediv_ad);
				$fcover_ad = $(".cover", $filediv_ad);
				webUpload({
					id : "#upBannerBtnID",
					label : "从电脑上传",
					process : function(percent) {
						if (!$fbefore_ad.hasClass("opacity")) {
							$fbefore_ad.addClass("opacity");
							$fdoing_ad.show();
							$uploading = true;
						}
						$("span", $fdoing_ad).text("上传中（{percent}）".template({"percent" : percent }));
					},
					success : function(response){
						if(!response.notUsewebUploader){
							$fdoing_ad.hide();
						}
						$uploading = false;
						var filename = response.name;
						if (!filename) {
							Tour.utils.showError($("#upBannerBtnID"), "文件格式错误");
							$fbefore_ad.removeClass("opacity");
							$fcover_ad.hide();
							return ;
						} else {
							$fsuccess_ad.show();
							$("span", $fdoing_ad).text("上传中（0%）");
							
							setTimeout(function(){
								$fsuccess_ad.hide();
								$fbefore_ad.removeClass("opacity");
								if ($("[data-name=attachments]", $files).length < 5) {
									$fcover_ad.hide();
								}  else {
									$fcover_ad.show();
								}
								
							},2000);
							var maxname = 25;
							if (filename.length >= maxname) {
								var lastIdx = filename.lastIndexOf(".");
								var staff = filename.substring(lastIdx);

								if (staff.length >= maxname) {
									Tour.utils.showError($("#upBannerBtnID"), "文件格式错误");
									return ;
								}
								filename =  filename.substring(0, 25 - staff.length) + staff;
								
							}
							//附件名字
							var attchment = {
									url : response.url,
									name : filename,
									size : response.size,
									width: response.width,
									height: response.height
							}
							//$files.append(template("tmp_step_base_banner", attchment));
							var bannerWrapper = $body.find('.product-ad');
							bannerWrapper.find('[name=id]').val("");
							bannerWrapper.find('[name=url]').val(attchment.url);
							bannerWrapper.find('[name=width]').val(attchment.width);
							bannerWrapper.find('[name=height]').val(attchment.height);
							bannerWrapper.find('[name=size]').val(attchment.size);
							bannerWrapper.find('img').attr("src", attchment.url).show();
						}
						

						
					},
					error : function(id,msg){
						$uploading = false;
						$fbefore_ad.removeClass("opacity");
						Tour.utils.showError($("#upBannerBtnID"), msg);
						$fdoing_ad.hide();
						$fcover_ad.hide();
					},
					cancelsuccess : function(){
						$uploading = false;
						$fbefore_ad.removeClass("opacity");
						$fdoing_ad.hide();
						$fcover_ad.hide();
					},
					positionable:true,
					target:".upfile",
					//tipmessage:"<small class='upload-tips'>最多5个jpg、office文件供用户下载（若没有不可传）</small>",
					corver:'<div class="cover hidden"><span class="upBtn">上传附件</span></div>',
					messagejson:true,
					operateType : "tour_corver_image",
					useDefault:1,
					accept:{ 
					title: 'Images',
			          	extensions: 'png,jpg'
			         },
					cancel : $fcancel
				});

				$files_atc = $(".product-attachments .upFileInfo");
				$filediv_atc = $(".product-attachments .upfile");
				$fbefore_atc = $(".beforeUp", $filediv_atc);
				$fdoing_atc = $(".doingUp", $filediv_atc); 
				$fsuccess_atc = $(".successUp", $filediv_atc);
				$fcancel_atc = $(".cancle", $filediv_atc);
				$fcover_atc = $(".cover", $filediv_atc);

				webUpload({
					id : "#upBtnID",
					label : "上传附件",
					process : function(percent) {
						
						if (!$fbefore_atc.hasClass("opacity")) {
							$fbefore_atc.addClass("opacity");
							$fdoing_atc.show();
							$uploading = true;
						}
						$("span", $fdoing_atc).text("上传中（{percent}）".template({"percent" : percent }));
					},
					success : function(response){
						if(!response.notUsewebUploader){
							$fdoing_atc.hide();
						}
						$uploading = false;
						var filename = response.name;
						if (!filename) {
							Tour.utils.showError($("#upBtnID"), "文件格式错误");
							$fbefore_atc.removeClass("opacity");
							$fcover_atc.hide();
							return ;
						} else {
							$fsuccess_atc.show();
							$("span", $fdoing_atc).text("上传中（0%）");
							
							setTimeout(function(){
								$fsuccess_atc.hide();
								$fbefore_atc.removeClass("opacity");
								if ($("[data-name=attachments]", $files).length < 5) {
									$fcover_atc.hide();
								}  else {
									$fcover_atc.show();
								}
								
							},2000);
							var maxname = 25;
							if (filename.length >= maxname) {
								var lastIdx = filename.lastIndexOf(".");
								var staff = filename.substring(lastIdx);

								if (staff.length >= maxname) {
									Tour.utils.showError($("#upBtnID"), "文件格式错误");
									return ;
								}
								filename =  filename.substring(0, 25 - staff.length) + staff;
								
							}
							//附件名字
							var attchment = {
									url : response.url,
									name : filename,
									size : response.size
							}
							$files_atc.append(template("tmp_step_base_file", attchment));
							
						}
						

						
					},
					error : function(id,msg){
						$uploading = false;
						$fbefore_atc.removeClass("opacity");
						Tour.utils.showError($("#upBtnID"), msg);
						$fdoing_atc.hide();
						$fcover_atc.hide();
					},
					cancelsuccess : function(){
						$uploading = false;
						$fbefore_atc.removeClass("opacity");
						$fdoing_atc.hide();
						$fcover_atc.hide();
					},
					positionable:true,
					target:".upfile",
					tipmessage:"<small class='upload-tips'>最多5个jpg、office文件供用户下载（若没有不可传）</small>",
					corver:'<div class="cover hidden"><span class="upBtn">上传附件</span></div>',
					messagejson:true,
					operateType : "tour_attach",
					useDefault:1,
					accept:{ 
						title: 'Images',
			            extensions: 'png,jpg,docx,xlsx,doc,xls'
			           },
					cancel : $fcancel
				});
				//init flash upload end
			},
			clear : function(){
				inited = false;
				$body.html("");
			},
			isInit : function(){
				return inited;
			},
			init : function(){
				//供应商系统专用
				// if (!Tour.current.lineId) {
				// 	alert("没找找到专线ID");
				// 	return false;
				// }
				inited  = true;
				
				$tour = Tour.current.data;
				$tour.product.defaultImg = WEB_STATIC + '/common/image/gm1.png'; // 默认背景图
				//从出团计划团过来。
				var tourName = $("#urlTourName").val();
				var planData = Tour.current.data.product;
				var isNew = !Tour.utils.getUrlParam("id");
				if (!planData.tourType) {
					planData.tourType = Tour.current.tourtype;
				}

				// 新增产品时，从专线读取出发地信息
				if (!planData.departurePlace) {
					// planData.departurePlace = JSON.parse(JSON.stringify(__defaultDeparture)); // 深复制
					planData.departurePlace = __defaultDeparture;
				}

				$content = $(template("tmp_step_base", $tour.product || {}));
				$body.html($content);
				$($content).on("click",".stepBtn", Tour.nextStep);
				$d_price = $("#dialog_price");
				$d_price_c = $d_price.find(".J_timeContent");
				
				if (tourName) {
					$("#tourName").val(tourName);
				}

				// 包机
				$content.on("change", ".J_charter .J_option", function() {
					var $charter = $(this).closest(".J_charter");
					var $items = $(this).closest(".dataItems");
					$charter.find("input[type='radio']").attr("checked", false);
					var val = $(this).find("input[type='radio']").attr("checked", "checked").val();
					$items.find("input[name='charter']").val(val);
				});
				$content.on("blur",".J-title-display",function(){
					$(this).attr("title",$(this).val())
				})

				$content.on("blur",".J-title-display",function(){
					$(this).attr("title",$(this).val());
				})
				// 天天发团与指定日期发团切换
				$content.on("change", ":radio[name=__type]", function(e, data) {
					$d_price_c.find(".group").each(function(k, elem) {
						Tour.current.jsondom.remove($(elem));
					});
					var type = this.value;
					$("#dialog_price input[name=tourPlanType]").val(type);
					updateCloseDeadline(e.isTrigger && !isNew);
					$.each(data && data.length > 0 && data || [ false ], function(k, v) {

						var item = v ? $.extend({idx: k, type: type}, this) : {type: type};
						var $new = buildGroupContent(item);
						
						
						if (type == "date") {
							$d_price.find(".btn-add-group-item").show();
							window.type_Gourp = ""
							// 渲染截止收客模板。
							// buildCloseOffDeadline({
							// 	closedOffDeadline: Tour.current.data.product.closedOffDeadline || $("#lineSelect > option:selected").attr("closedOffDeadline")
							// });
							// $("#closedOffDeadlineDL").show();
						} else {
							$new.find(".show-date").hide();
							$new.find(".show-everyday").show().find(".cols4").html(template("tpl_price_everyday", item));
							$d_price.find(".btn-add-group-item").hide();
							// $("#closedOffDeadline").empty();
							// $("#closedOffDeadlineDL").hide();
							$new.find(".cols2 .input.flight").remove();
							window.type_Gourp = "day"
							var len = $d_price_c.find(".group").length;
							u.hideError($new.find("#extraPrice-" + (len - 1)));
						}
						new Plan.Group($new, item);
						$(".table-pos").find(".dataItem").length ? $(".J-all-remove").show : $(".J-all-remove").hide();
						// 去除第一个价格/团期的删除按钮
						if ($d_price_c.find(".group").length > 0) {
							$($d_price_c.find(".group")[0]).find('.delete-group').remove();
						}
					});
				});

				// 初始化出发地选择控件
				$('#fromcity').querycity({
					defaultText : "",
					data : citysFlight,
					tabs : labelFromcity,
					hotList : hotList,
					selector : $("#choiceCity"),
					callback : function(d) {
						if (!d.inputText && !$("#fromcity").val()) { 
							$("#fromcity").val('');
							return;
						}else{
							d.inputText && $("#fromcity").val(d.inputText).css('color', '#000');
							d.inputText && $("#cityId").val(d.inputId);
						}
					}
				});
				
				// 初始化出发地选择控件
				/*$('#J-destination').querycity({
					defaultText : "",
					data : citysFlight,
					tabs : labelFromcity,
					hotList : hotList,
					selector : $("#choiceCity2"),
					callback : function(d) {
					}
				});*/
				
				$("#pop_city_fromcity .close").click(function() {
					$("#pop_city_fromcity").hide();
				});
				
				/*$("#pop_city_J-destination .close").click(function() {
					$("#pop_city_J-destination").hide();
				});*/

				// 设置截至收客日期或不设置
				$content.on("change", "#closedOffDeadline :radio", function(e) {
					if (this.value == 1) {
						$("#closedOffDeadline").find('[name="closedOffDeadline"]').removeAttr("disabled").val(getClosedOffDeadline());
					} else {
						$("#closedOffDeadline").find('[name="closedOffDeadline"]').attr("disabled", "disabled").val("");
					}
				});

				// 跟团游自由行切换
				$("#plan-tourtype").on("change", function(e) {
					var type = $(this).val();
					$body.find(".plan_dialog .J_timeContent [data-name=items]").each(function(k, elem) {
						Tour.current.jsondom.remove($(elem));
					});
					planData.tourType = this.value;
					if (planData.tourType == "group") {
						var tourPlanType = planData.tourPlanType || "date";
						var radio = $d_price.find(":radio[value=" + tourPlanType  + "]");
						radio[0].checked = true;
						radio.parent().addClass("active").siblings().removeClass("active");
					}
					updateCloseDeadline(e.isTrigger && !isNew);
					initGroupPrice(planData);
				});

				// 统一入口（根据专线或游行方式初始化团期及报价信息）
				var initGroupPrice = function(planData) {
					if (planData.tourType == "ship") {
					    	addShipPlanGroup(planData);
						$("#dialog_price").hide();
						$("#free_dialog_price").hide();
						$("#ship_dialog_price").show();
					} else if (planData.tourType == "freewalker") {
						addFreePlanGroup(planData);
						$("#dialog_price").hide();
						$("#free_dialog_price").show();
						$("#ship_dialog_price").hide();
					} else {
					    	addGroupPlanGroup(planData);
						$("#dialog_price").show();
						$("#free_dialog_price").hide();
						$("#ship_dialog_price").hide();
						
					}
				};

				// 添加一组游轮报价团期信息
				$content.on("click", "#ship_dialog_price .J_add_group", function(e) {
					e.stopPropagation();
					if (isValid()) {
						addShipPlanGroup();
					}
					return false;
				})
				// 添加一组自由行报价团期信息
				.on("click", "#free_dialog_price .J_add_group", function(e) {
					e.stopPropagation();
					if (isValid()) {
						addFreePlanGroup();
					}
					return false;
				});

				// 删除一组报价团期信息
				$content.on("click", ".delete-group .btn", function() {
					var curr = $(this).closest(".group-wrapper").parent();
					var wrap = curr.parent();
					var type = wrap.attr("data-group-type") || "";
					var items = {
						"": {
							selector: "> .group",
							msg: "至少添加一组报价",
							confirmMsg: "确认要删除该组报价吗？"
						},
						"freewalker_price_item": {
							selector: "> .fgroup",
							msg: "至少添加一组报价",
							confirmMsg: "确认要删除该组报价吗？"
						}
					};
					var item = items[type];
					var isOnly = wrap.find(item.selector).length == 1;
					if (isOnly) {
						Tour.utils.showError(curr.parent(), item.msg, "topLeft");
					} else {
						$.confirm(item.confirmMsg, "确认提示", function() {
							Tour.current.jsondom.remove(curr);
						}, function() {});
					}
				});

				$content.on("click", "#dialog_price .btn-add-group-item", function(e) {
					if (!isValid()) { return; }
					var type = $("#dialog_price .select-group input[name=tourPlanType]").val();
					var item = {type: type};
					var $new = buildGroupContent(item);
					$new.find(".J-all-remove").hide();
					updateCloseDeadline();
					if (type == "date") {
						$d_price.find(".btn-add-group-item").show();
						// 渲染截止收客模板。
						// buildCloseOffDeadline(Tour.current.data);
						// $("#closedOffDeadlineDL").show();
					} else {
						$new.find(".show-date").hide();
						$new.find(".show-everyday").show().find(".cols4").html(template("tpl_price_everyday", this || {}));
						$d_price.find(".btn-add-group-item").hide();

						// $("#closedOffDeadline").empty();
						// $("#closedOffDeadlineDL").hide();
						$new.find(".cols2 .input.flight").remove();
						var len = $d_price_c.find(".group").length;
						u.hideError($new.find("#extraPrice-" + (len - 1)));
					}
					new Plan.Group($new, item);
					// 去除第一个价格/团期的删除按钮
					if ($d_price_c.find(".group").length > 0) {
						$($d_price_c.find(".group")[0]).find('.delete-group').remove();
					}
					return false;
				});
				
				// 初始化专线
				$.getJSON('/touristline.json?_=' + Math.random(), function(res) {
					var options = "<option value=''>点击选择专线（必填）</option>";
		        	var list = res.touristlines;
		        	var $product = Tour.current.data.product;
		        	for (var i = 0; i < list.length; i++) {
		        		options += '<option value="{id}" {shipLine} closedOffDeadline="{closedOffDeadline}" recommendExtraPrice="{recommendExtraPrice}">{name}</option>'.template({
		        			'id' : list[i].id,
		        			'name' : list[i].name,
		        			'closedOffDeadline': list[i].closedOffDeadline,
		        			'recommendExtraPrice': list[i].recommendExtraPrice,
		        			'shipLine': list[i].shipLine ? "data-shipline='1'" : ""
		        		});
		        	}

		        	var lineId = $product.touristLine && $product.touristLine.id || Tour.current.lineId;
		        	$("#lineSelect").html(options).val(lineId);

		        	// if (lineId) {
		        	// 	$("#lineSelect").attr("disabled", "disabled");
		        	// }
		        	updateTourType(planData.tourType);

		        	// 判断是否是正确的专线或tourtype
		        	// if(!$("#lineSelect").val() || !$("#plan-tourtype").val()){
		        	// 	location.href = '/product/category';
		        	// }
				});

				// 载入某专线下的行程路线
				/*$("#lineSelect").on("change", function() {
					var line = this.value;

					Tour.current.lineId = line;
					updateTourType();
					// loadTripsOfLine(line);
				});*/

				function getClosedOffDeadline(onlyPassed) {
					return onlyPassed ? Tour.current.data.product.closedOffDeadline :
						Tour.current.data.product.closedOffDeadline || $("#lineSelect > option:selected").attr("closedOffDeadline");
				}

				function updateCloseDeadline(onlyPassedDeadline) {
					if ($("#plan-tourtype").val() == "group" && $("#dialog_price .select-group input[name=tourPlanType]").val() == "everyday") {
						$("#closedOffDeadline").empty();
						$("#closedOffDeadlineDL").hide();
					} else {
						buildCloseOffDeadline({
							closedOffDeadline: getClosedOffDeadline(onlyPassedDeadline)
						});
						$("#closedOffDeadlineDL").show();
					}
				}

				function updateTourType(tourType) {
					// var select = $("#lineSelect");
					// var selectedIndex = select.prop("selectedIndex");
					// var selectedItem = select.prop("options")[selectedIndex];

					// if ($(selectedItem).attr("data-shipline") == 1) {
					// 	$("#plan-tourtype").append("<option value='ship'></option>");
					// 	$("#plan-tourtype").val("ship").trigger("change");
					// } else {
					// 	$("#plan-tourtype").show().find("[value=ship]").remove();
					// 	$("#plan-tourtype").val(tourType || "group").trigger("change");
					// }

					$("#plan-tourtype").val(tourType).trigger("change");
				}

				/*function loadTripsOfLine(lineId) {
					var $product = Tour.current.data.product;
					var options = "<option value=''>点击选择行程线路（必填）</option>";

					if(lineId){
						$.getJSON('/line/play/{line}.json?_={random}'.template({'line' : lineId,  'random' : Math.random()}), function(res){
			            	var list = res.list;
			            	for(var i = 0; i < list.length; i++){
			            		options += '<option value="{id}">{name}</option>'.template({'id' : list[i].id, 'name' : list[i].name});
			            	}
			            	$("#playSelect").html(options).val($product.playOption && $product.playOption.id);
			            });
		            }else{
		            	$("#playSelect").html(options);
		            }
				}

				if (Tour.current.lineId) {
					loadTripsOfLine(Tour.current.lineId);
				}*/
				
				
				// attchment 
				$files = $(".upFileInfo");
				$filediv = $(".upfile");
				$fbefore = $(".beforeUp", $filediv);
				$fdoing = $(".doingUp", $filediv); 
				$fsuccess = $(".successUp", $filediv);
				$fcancel = $(".cancle", $filediv);
				$fcover = $(".cover", $filediv);
				var idx = 0;
				$(Tour.current.data.attachments).each(function(){
					$files.append(template("tmp_step_base_file", $.extend({},this, {"idx":idx++})));
				});
				
				
				if ($("[data-name=attachments]", $files).length >= 5) {
					$fcover.show();
				}

				// 渲染广告
				if (planData.bannerImage && planData.bannerImage.url) {
					$("#product-ad-image").attr("src", planData.bannerImage.url).show();
				}

				// 渲染附件
				if (planData.attachments) {
					$.each(planData.attachments, function(k, attachment) {
						$(".product-attachments .upFileInfo").append(template("tmp_step_base_file", $.extend({idx: k}, attachment)));
					});
				}

				Tour.current.jsondom.event.afterRemove.push(function(action, target){
					if (target.attr("data-del-target") == "attachment") {
						$(".product-attachments .upfile .cover").hide();
					}
				});
				// attchment end;
				
				$content.find("textarea[tag=edit]").each(function(i){
					if(i==0){
						initUEditor({textareaObj: $(this), touristLineId:Tour.current.lineId, galleryImageType: "s_brightspot",galleryImageTypeObj:""});
					}else{
					initUEditor({textareaObj: $(this), touristLineId:Tour.current.lineId, galleryImageTypeObj: $("#editorGalleryImageType")});
					}
				});

				/***update by zlm***/
				$("#upload_img_but").gmgallery({
					touristLineObj: $("#lineSelect"),
					multiSelect: false,
					imageTypeObj:$("#galleryImageType"),
					operateType: "tour_corver_image",
					options_id: new Date().getTime(),
					onOk: function(image){
						$("#coverImg").attr("src", image.url + '@298w_183h_1e_1c');
						$("#coverImgId").val(image.id);
					}
				});

				// 解决页面滚动时日历控件固定不动
				$('#page-content-viewport').on('scroll.datepicker', function(){
			        if($(document.activeElement).is('.datepicker')){
			            $(document.activeElement).datepicker('hide').blur();
			        }
			    });
			},
			submit : function(){
				var valid = Tour.utils.vaildDatas();
				if($("#coverImgId").val()==""){
					Tour.utils.showError($("#upload_img_but"),"请选择一张封面图片！");
					valid = false;
				}
				var tourType = $("#plan-tourtype").val();
				var dateType = $(":radio[name=__type]:checked", $content).val();
				var ctx = tourType == "freewalker" ?
					$("#free_dialog_price") :
						tourType == "ship" ?
							$("#ship_dialog_price") : $("#dialog_price");
				if (tourType != "group" || dateType != "everyday") {
					var dates = $(".J_timeContent > .group .dates", ctx);
					for (var i = 0, l = dates.length; i < l; ++i) {
						if ($(dates[i]).find("> .dataItem").length == 0) {
							valid = false;
							Tour.utils.showError($(dates[i]), "至少添加一个日期", "topLeft:0, 22");
							break;
						}
					}
				}
				// if ($(":radio[name=__type]", $content).val() == "date") {
        //     $("[data-name=items]", $content).each(function(){
        //         var $this = $(this)
        //         if ($("[data-name=dates]", $this).length == 0) {
        //             valid = false;
        //             Tour.utils.showError($(".datepicker", $this), "至少添加一个日期");
        //         }
        //     });
        // }
				if(!valid) return false;
				
				if ($uploading) {
					alert("文件上传中.请稍后..");
					return false;
				}
				$("textarea[tag=edit]").each(function(){
                    UE.getEditor($(this).attr('editorId')).execCommand('removePlaceHolder');
					//KindEditor.removePlaceholder($(this));
				});
				
				Tour.current.jsondom.refresh($body);
				
				return true;
			}
	};
	
	w.Tour = w.Tour || {};
	w.Tour.module = w.Tour.module || {};
	w.Tour.module.base = w.Tour.module.base || {};
	$.extend(w.Tour.module.base, module);
}))(jQuery, window);