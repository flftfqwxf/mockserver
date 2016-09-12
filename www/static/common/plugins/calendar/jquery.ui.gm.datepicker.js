$.datepicker._attachHandlers = function(inst) {
		var stepMonths = this._get(inst, "stepMonths"),
			id = "#" + inst.id.replace( /\\\\/g, "\\" );
		inst.dpDiv.find("[data-handler]").map(function () {
			var handler = {
				prev: function () {
					$.datepicker._adjustDate(id, -stepMonths, "M");
				},
				next: function () {
					$.datepicker._adjustDate(id, +stepMonths, "M");
				},
				hide: function () {
					$.datepicker._hideDatepicker();
				},
				today: function () {
					$.datepicker._gotoToday(id);
				},
				selectDay: function () {
					$.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
					return false;
				},
				selectMonth: function () {
					$.datepicker._selectMonthYear(id, this, "M");
					return false;
				},
				selectYear: function () {
					$.datepicker._selectMonthYear(id, this, "Y");
					return false;
				},
				showMonth: function(){
					$.datepicker._setMonthShow(id, $(this).attr("data-month"));
					return false;
				}
			};
			$(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
		});
	};
$.datepicker._generateMonthYearHeader = function(inst, drawMonth, drawYear,
		minDate, maxDate, secondary, monthNames, monthNamesShort) {

	var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear, changeMonth = this
			._get(inst, "changeMonth"), changeAllMonth = this._get(inst,
			"changeAllMonth"), changeYear = this._get(inst, "changeYear"), showMonthAfterYear = this
			._get(inst, "showMonthAfterYear"), html = "<div class='ui-datepicker-title'>", monthHtml = "";

	// month selection
	if (!changeAllMonth) {
		if (secondary || !changeMonth) {
			monthHtml += "<span class='ui-datepicker-month'>"
					+ monthNames[drawMonth] + "</span>";
		} else {
			inMinYear = (minDate && minDate.getFullYear() === drawYear);
			inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
			monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
			for (month = 0; month < 12; month++) {
				if ((!inMinYear || month >= minDate.getMonth())
						&& (!inMaxYear || month <= maxDate.getMonth())) {
					monthHtml += "<option value='" + month + "'"
							+ (month === drawMonth ? " selected='selected'" : "") + ">" + monthNamesShort[month] + "</option>";
				}
			}
			monthHtml += "</select>";
		}
	}

	if (!showMonthAfterYear) {
		html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
	}

	// year selection
	if (!inst.yearshtml) {
		inst.yearshtml = "";
		if (secondary || !changeYear) {
			html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
		} else {
			// determine range of years to display
			years = this._get(inst, "yearRange").split(":");
			thisYear = new Date().getFullYear();
			determineYear = function(value) {
				var year = (value.match(/c[+\-].*/) ? drawYear
						+ parseInt(value.substring(1), 10) : (value
						.match(/[+\-].*/) ? thisYear + parseInt(value, 10)
						: parseInt(value, 10)));
				return (isNaN(year) ? thisYear : year);
			};
			year = determineYear(years[0]);
			endYear = Math.max(year, determineYear(years[1] || ""));
			year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
			endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear())
					: endYear);
			inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
			for (; year <= endYear; year++) {
				inst.yearshtml += "<option value='" + year + "'"
						+ (year === drawYear ? " selected='selected'" : "")
						+ ">" + year + "</option>";
			}
			inst.yearshtml += "</select>";

			html += inst.yearshtml;
			inst.yearshtml = null;
		}
	}

	html += this._get(inst, "yearSuffix");
	if (showMonthAfterYear) {
		html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "")
				+ monthHtml;
	}
	html += "</div>"; // Close datepicker_header
	// 2015-07-14 wfq 扩展展示所有的月份。
	var instid = "#" + inst.id.replace(/\\\\/g, "\\");
	var htmlMonth = "";
	if (changeAllMonth) {
		inMinYear = (minDate && minDate.getFullYear() === drawYear);
		inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
		var nowYear = (new Date()).getFullYear();
		var nowMonth = (new Date()).getMonth();
		htmlMonth = "<div class='ui-datepicker-title-months'><table><tr>";
		for (month = 0; month < 12; month++) {
			if(month == 6){
				htmlMonth += "</tr><tr>";
			}
			htmlMonth += "<td><span data-month='" + month + "'"
						+ " attr-instid='" + instid + "' "
						+ ((month < nowMonth && drawYear <= nowYear) ? " month-disabled='true' " : "")
						+ " class='show-all-month-li"
						+ (month === drawMonth ? " month-selected " : "") 
						+ ((month < nowMonth && drawYear <= nowYear) ? " month-disabled " : "")
//						+ "' " + ">" + monthNamesShort[month] + "</span>";
						+ "' " + " data-event='click' data-handler='showMonth'>" + (month*1+1) + "月" + "</span></td>";
		}
		htmlMonth += "</tr></table></div>";
	}
	return html + htmlMonth;
};
$.extend($.datepicker, {
	_setMonthShow : function(id, month){
		var target = $(id),
			inst = this._getInst(target[0]);
		inst["selectedMonth"] = inst["drawMonth"] = parseInt(month, 10);
		inst["selectedDay"] = inst["currentDay"] = 1;

		this._notifyChange(inst);
		this._adjustDate(target);
		(typeof inst.settings.monthSetCallBack === 'function') && inst.settings.monthSetCallBack(inst);
	},
	_selectDiyDays : function(inst, defaultValues){
		for(var i = 0 ; i < defaultValues.length; i++){
			var d = defaultValues[i].split("-"),day = parseInt(d[2]);
			inst.dpDiv.find("td[data-month="+(parseInt(d[1])-1)+"][data-year="+d[0]+"]").each(function(){
				if ($.trim($(this).text()) == day) {
					$(this).find("a").closest("td").attr("date-id", defaultValues[i]); // modified by wuxing
					$(this).find("a").addClass("selected");
				}
			});
		}
	}
});
//function dpAllMonthLi(datepicker, month, defaultValues){
//	var date = getDateByStr(datepicker.find(".ui-datepicker-calendar").find("td:eq(10)"));
//	date.setMonth(month);
//	toDayShow(datepicker, date.format(), defaultValues);
//}
function toDayShow(datepicker, m, defaultValues){
	datepicker.datepicker("setDate",m);
	datepicker.find(".ui-state-active").removeClass("ui-state-active");
	for(var i = 0 ; i < defaultValues.length; i++){
		var d = defaultValues[i].split("-"),day = parseInt(d[2]);
		datepicker.find("td[data-month="+(parseInt(d[1])-1)+"][data-year="+d[0]+"]").each(function(){
			if ($.trim($(this).text()) == day) {
				$(this).find("a").closest("td").attr("date-id", defaultValues[i]); // modified by wuxing
				$(this).find("a").addClass("selected");
			}
		});
	}
}
function getDateByStr(t){
	if(t.attr("data-year") && t.attr("data-month") && null != t.attr("data-year") && "" != t.attr("data-year") && null != t.attr("data-month") && "" != t.attr("data-month")){
		var str = (t.attr("data-year")+"-"+(parseInt(t.attr("data-month"))+1)+"-"+t.text()+" 00:00:00").replace(/-/g, "/");
		return new Date(str);
	}else{
		return new Date();
	}
}