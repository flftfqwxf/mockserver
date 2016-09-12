if ($cfg.eCont) {
    $dp = {};
    for (var p in $pdp) if (typeof $pdp[p] == "object") {
        $dp[p] = {};
        for (var pp in $pdp[p]) $dp[p][pp] = $pdp[p][pp]
    } else $dp[p] = $pdp[p]
} else $dp = $pdp;
for (p in $cfg) $dp[p] = $cfg[p];
var $c;
if ($FF) {
    Event.prototype.__defineSetter__("returnValue",
    function($) {
        if (!$) this.preventDefault();
        return $
    });
    Event.prototype.__defineGetter__("srcElement",
    function() {
        var $ = this.target;
        while ($.nodeType != 1) $ = $.parentNode;
        return $
    })
}
function My97DP() {
    $c = this;
    this.QS = [];
    $d = document.createElement("div");
    $d.className = "WdateDiv";
    $d.innerHTML = "<div id=dpTitle><div class=\"navImg NavImgll\"><a></a></div><div class=\"navImg NavImgl\"><a></a></div><div style=\"float:left\"><div class=\"menuSel MMenu\"></div><input class=yminput></div><div style=\"float:left\"><div class=\"menuSel YMenu\"></div><input class=yminput></div><div class=\"navImg NavImgrr\"><a></a></div><div class=\"navImg NavImgr\"><a></a></div><div style=\"float:right\"></div></div><div style=\"position:absolute;overflow:hidden\"></div><div></div><div id=dpTime><div class=\"menuSel hhMenu\"></div><div class=\"menuSel mmMenu\"></div><div class=\"menuSel ssMenu\"></div><table cellspacing=0 cellpadding=0 border=0><tr><td rowspan=2><span id=dpTimeStr></span>&nbsp;<input class=tB maxlength=2><input value=\":\" class=tm readonly><input class=tE maxlength=2><input value=\":\" class=tm readonly><input class=tE maxlength=2></td><td><button id=dpTimeUp></button></td></tr><tr><td><button id=dpTimeDown></button></td></tr></table></div><div id=dpQS></div><div id=dpControl><input class=dpButton id=dpTodayInput type=button><input class=dpButton id=dpClearInput type=button><input class=dpButton id=dpOkInput type=button></div>";
    attachTabEvent($d,
    function() {
        hideSel()
    });
    A();
    this.init();
    $dp.focusArr = [document, $d.MI, $d.yI, $d.HI, $d.mI, $d.sI, $d.clearI, $d.todayI, $d.okI];
    for (var B = 0; B < $dp.focusArr.length; B++) {
        var _ = $dp.focusArr[B];
        _.nextCtrl = B == $dp.focusArr.length - 1 ? $dp.focusArr[1] : $dp.focusArr[B + 1];
        $dp.attachEvent(_, "onkeydown", _tab)
    }
    $();
    _inputBindEvent("y,M,H,m,s");
    $d.upButton.onclick = function() {
        updownEvent(1)
    };
    $d.downButton.onclick = function() {
        updownEvent( - 1)
    };
    $d.qsDiv.onclick = function() {
        if ($d.qsDivSel.style.display != "block") {
            $c._fillQS();
            showB($d.qsDivSel)
        } else hide($d.qsDivSel)
    };
    document.body.appendChild($d);
    function A() {
        var _ = $("a");
        divs = $("div"),
        ipts = $("input"),
        btns = $("button"),
        spans = $("span");
        $d.navLeftImg = _[0];
        $d.leftImg = _[1];
        $d.rightImg = _[3];
        $d.navRightImg = _[2];
        $d.rMD = divs[9];
        $d.MI = ipts[0];
        $d.yI = ipts[1];
        $d.titleDiv = divs[0];
        $d.MD = divs[4];
        $d.yD = divs[6];
        $d.qsDivSel = divs[10];
        $d.dDiv = divs[11];
        $d.tDiv = divs[12];
        $d.HD = divs[13];
        $d.mD = divs[14];
        $d.sD = divs[15];
        $d.qsDiv = divs[16];
        $d.bDiv = divs[17];
        $d.HI = ipts[2];
        $d.mI = ipts[4];
        $d.sI = ipts[6];
        $d.clearI = ipts[8];
        $d.todayI = ipts[7];
        $d.okI = ipts[9];
        $d.upButton = btns[0];
        $d.downButton = btns[1];
        $d.timeSpan = spans[0];
        function $($) {
            return $d.getElementsByTagName($)
        }
    }
    function $() {
        $d.navLeftImg.onclick = function() {
            $ny = $ny <= 0 ? $ny - 1 : -1;
            if ($ny % 5 == 0) {
                $d.yI.focus();
                return
            }
            $d.yI.value = $dt.y - 1;
            $d.yI.onblur()
        };
        $d.leftImg.onclick = function() {
            $dt.attr("M", -1);
            $d.MI.onblur()
        };
        $d.rightImg.onclick = function() {
            $dt.attr("M", 1);
            $d.MI.onblur()
        };
        $d.navRightImg.onclick = function() {
            $ny = $ny >= 0 ? $ny + 1 : 1;
            if ($ny % 5 == 0) {
                $d.yI.focus();
                return
            }
            $d.yI.value = $dt.y + 1;
            $d.yI.onblur()
        }
    }
}
My97DP.prototype = {
    init: function() {
        $ny = 0;
        $dp.cal = this;
        if ($dp.readOnly && $dp.el.readOnly != null) {
            $dp.el.readOnly = true;
            $dp.el.blur()
        }
        this._dealFmt();
        $dt = this.newdate = new DPDate();
        $tdt = new DPDate();
        $sdt = this.date = new DPDate();
        $dp.valueEdited = 0;
        this.dateFmt = this.doExp($dp.dateFmt);
        this.autoPickDate = $dp.autoPickDate == null ? ($dp.has.st && $dp.has.st ? false: true) : $dp.autoPickDate;
        $dp.autoUpdateOnChanged = $dp.autoUpdateOnChanged == null ? ($dp.isShowOK && $dp.has.d ? false: true) : $dp.autoUpdateOnChanged;
        this.ddateRe = this._initRe("disabledDates");
        this.ddayRe = this._initRe("disabledDays");
        this.sdateRe = this._initRe("specialDates");
        this.sdayRe = this._initRe("specialDays");
        this.minDate = this.doCustomDate($dp.minDate, $dp.minDate != $dp.defMinDate ? $dp.realFmt: $dp.realFullFmt, $dp.defMinDate);
        this.maxDate = this.doCustomDate($dp.maxDate, $dp.maxDate != $dp.defMaxDate ? $dp.realFmt: $dp.realFullFmt, $dp.defMaxDate);
        if (this.minDate.compareWith(this.maxDate) > 0) $dp.errMsg = $lang.err_1;
        if (this.loadDate()) {
            this._makeDateInRange();
            this.oldValue = $dp.el[$dp.elProp]
        } else this.mark(false, 2);
        _setAll($dt);
        $d.timeSpan.innerHTML = $lang.timeStr;
        $d.clearI.value = $lang.clearStr;
        $d.todayI.value = $lang.todayStr;
        $d.okI.value = $lang.okStr;
        $d.okI.disabled = !$c.checkValid($sdt);
        this.initShowAndHide();
        this.initBtn();
        if ($dp.errMsg) alert($dp.errMsg);
        this.draw();
        if ($dp.el.nodeType == 1 && $dp.el["My97Mark"] === undefined) {
            $dp.attachEvent($dp.el, "onkeydown", _tab);
            $dp.attachEvent($dp.el, "onblur",
            function() {
                if ($dp && $dp.dd.style.display == "none") {
                    $c.close();
                    if (!$dp.valueEdited && $dp.cal.oldValue != $dp.el[$dp.elProp] && $dp.el.onchange) fireEvent($dp.el, "change")
                }
            });
            $dp.el["My97Mark"] = false
        }
        $c.currFocus = $dp.el;
        hideSel()
    },
    _makeDateInRange: function() {
        var _ = this.checkRange();
        if (_ != 0) {
            var $;
            if (_ > 0) $ = this.maxDate;
            else $ = this.minDate;
            if ($dp.has.sd) {
                $dt.y = $.y;
                $dt.M = $.M;
                $dt.d = $.d
            }
            if ($dp.has.st) {
                $dt.H = $.H;
                $dt.m = $.m;
                $dt.s = $.s
            }
        }
    },
    splitDate: function(K, C, R, F, B, H, G, L, M) {
        var $;
        if (K && K.loadDate) $ = K;
        else {
            $ = new DPDate();
            if (K != "") {
                C = C || $dp.dateFmt;
                var I, D, Q = 0,
                P, A = /yyyy|yyy|yy|y|MMMM|MMM|MM|M|dd|d|%ld|HH|H|mm|m|ss|s|DD|D|WW|W|w/g,
                _ = C.match(A);
                A.lastIndex = 0;
                if (M) P = K.split(/\W+/);
                else {
                    var E = 0,
                    N = "^";
                    while ((P = A.exec(C)) !== null) {
                        if (E >= 0) {
                            D = C.substring(E, P.index);
                            if (D && "-/\\".indexOf(D) >= 0) D = "[\\-/]";
                            N += D
                        }
                        E = A.lastIndex;
                        switch (P[0]) {
                        case "yyyy":
                            N += "(\\d{4})";
                            break;
                        case "yyy":
                            N += "(\\d{3})";
                            break;
                        case "MMMM":
                        case "MMM":
                        case "DD":
                        case "D":
                            N += "(\\D+)";
                            break;
                        default:
                            N += "(\\d\\d?)";
                            break
                        }
                    }
                    N += ".*$";
                    P = new RegExp(N).exec(K);
                    Q = 1
                }
                if (P) {
                    for (I = 0; I < _.length; I++) {
                        var J = P[I + Q];
                        if (J) switch (_[I]) {
                        case "MMMM":
                        case "MMM":
                            $.M = O(_[I], J);
                            break;
                        case "y":
                        case "yy":
                            J = pInt2(J, 0);
                            if (J < 50) J += 2000;
                            else J += 1900;
                            $.y = J;
                            break;
                        case "yyy":
                            $.y = pInt2(J, 0) + $dp.yearOffset;
                            break;
                        default:
                            $[_[I].slice( - 1)] = J;
                            break
                        }
                    }
                } else $.d = 32
            }
        }
        $.coverDate(R, F, B, H, G, L);
        return $;
        function O(A, $) {
            var _ = A == "MMMM" ? $lang.aLongMonStr: $lang.aMonStr;
            for (var B = 0; B < 12; B++) if (_[B].toLowerCase() == $.substr(0, _[B].length).toLowerCase()) return B + 1;
            return - 1
        }
    },
    _initRe: function(_) {
        var B, $ = $dp[_],
        A = "";
        if ($ && $.length > 0) {
            for (B = 0; B < $.length; B++) {
                A += this.doExp($[B]);
                if (B != $.length - 1) A += "|"
            }
            A = A ? new RegExp("(?:" + A + ")") : null
        } else A = null;
        return A
    },
    update: function($) {
        if ($ === undefined) $ = this.getNewDateStr();
        if ($dp.el[$dp.elProp] != $) {
            $dp.el[$dp.elProp] = $;
            if(!$){
        	$dp.el.setAttribute("data-value","");
            }
        }
        this.setRealValue()
    },
    setRealValue: function($) {
        var _ = $dp.$($dp.vel),
        $ = rtn($, this.getNewDateStr($dp.realFmt));
        if (_) _.value = $;
        $dp.el["realValue"] = $
    },
    doExp: function(s) {
        var ps = "yMdHms",
        arr, tmpEval, re = /#?\{(.*?)\}/;
        s = s + "";
        for (var i = 0; i < ps.length; i++) s = s.replace("%" + ps.charAt(i), this.getP(ps.charAt(i), null, $tdt));
        if (s.substring(0, 3) == "#F{") {
            s = s.substring(3, s.length - 1);
            if (s.indexOf("return ") < 0) s = "return " + s;
            s = $dp.win.eval("new Function(\"" + s + "\");");
            s = s()
        }
        while ((arr = re.exec(s)) != null) {
            arr.lastIndex = arr.index + arr[1].length + arr[0].length - arr[1].length - 1;
            tmpEval = pInt(eval(arr[1]));
            if (tmpEval < 0) tmpEval = "9700" + ( - tmpEval);
            s = s.substring(0, arr.index) + tmpEval + s.substring(arr.lastIndex + 1)
        }
        return s
    },
    doCustomDate: function(A, B, _) {
        var $;
        A = this.doExp(A);
        if (!A || A == "") A = _;
        if (typeof A == "object") $ = A;
        else {
            $ = this.splitDate(A, B, null, null, 1, 0, 0, 0, true);
            $.y = ("" + $.y).replace(/^9700/, "-");
            $.M = ("" + $.M).replace(/^9700/, "-");
            $.d = ("" + $.d).replace(/^9700/, "-");
            $.H = ("" + $.H).replace(/^9700/, "-");
            $.m = ("" + $.m).replace(/^9700/, "-");
            $.s = ("" + $.s).replace(/^9700/, "-");
            if (A.indexOf("%ld") >= 0) {
                A = A.replace(/%ld/g, "0");
                $.d = 0;
                $.M = pInt($.M) + 1
            }
            $.refresh()
        }
        return $
    },
    loadDate: function() {
        var A = $dp.el[$dp.elProp],
        $ = this.dateFmt,
        _ = $dp.has;
        if ($dp.alwaysUseStartDate || ($dp.startDate != "" && A == "")) {
            A = this.doExp($dp.startDate);
            $ = $dp.realFmt
        }
        $dt.loadFromDate(this.splitDate(A, $));
        if (A != "") {
            var B = 1;
            if (_.sd && !this.isDate($dt)) {
                $dt.y = $tdt.y;
                $dt.M = $tdt.M;
                $dt.d = $tdt.d;
                B = 0
            }
            if (_.st && !this.isTime($dt)) {
                $dt.H = $tdt.H;
                $dt.m = $tdt.m;
                $dt.s = $tdt.s;
                B = 0
            }
            return B && this.checkValid($dt)
        }
        if (!_.H) $dt.H = 0;
        if (!_.m) $dt.m = 0;
        if (!_.s) $dt.s = 0;
        return 1
    },
    isDate: function($) {
        if ($.y != null) $ = doStr($.y, 4) + "-" + $.M + "-" + $.d;
        return $.match(/^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s(((0?[0-9])|([1-2][0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/)
    },
    isTime: function($) {
        if ($.H != null) $ = $.H + ":" + $.m + ":" + $.s;
        return $.match(/^([0-9]|([0-1][0-9])|([2][0-3])):([0-9]|([0-5][0-9])):([0-9]|([0-5][0-9]))$/)
    },
    checkRange: function($, A) {
        $ = $ || $dt;
        var _ = $.compareWith(this.minDate, A);
        if (_ > 0) {
            _ = $.compareWith(this.maxDate, A);
            if (_ < 0) _ = 0
        }
        return _
    },
    checkValid: function($, A, B) {
        A = A || $dp.has.minUnit;
        var _ = this.checkRange($, A);
        if (_ == 0) {
            _ = 1;
            if (A == "d" && B == null) B = Math.abs((new Date($.y, $.M - 1, $.d).getDay() - $dp.firstDayOfWeek + 7) % 7);
            _ = !this.testDisDay(B) && !this.testDisDate($, A)
        } else _ = 0;
        return _
    },
    checkAndUpdate: function() {
        var _ = $dp.el,
        A = this,
        $ = $dp.el[$dp.elProp];
        if ($dp.errDealMode >= 0 && $dp.errDealMode <= 2 && $ != null) {
            if ($ != "") A.date.loadFromDate(A.splitDate($, $dp.dateFmt));
            if ($ == "" || (A.isDate(A.date) && A.isTime(A.date) && A.checkValid(A.date))) {
                if ($ != "") {
                    A.newdate.loadFromDate(A.date);
                    A.update()
                } else A.setRealValue("")
            } else return false
        }
        return true
    },
    close: function($) {
        hideSel();
        if (this.checkAndUpdate()) {
            this.mark(true);
            $dp.hide()
        } else {
            if ($) {
                _cancelKey($);
                this.mark(false, 2)
            } else this.mark(false);
            $dp.show()
        }
    },
    _fd: function() {
        var E, C, D, K, A, H = new sb(),
        F = $lang.aWeekStr,
        G = $dp.firstDayOfWeek,
        I = "",
        $ = "",
        _ = new DPDate($dt.y, $dt.M, $dt.d, 2, 0, 0),
        J = _.y,
        B = _.M;
        A = 1 - new Date(J, B - 1, 1).getDay() + G;
        if (A > 1) A -= 7;
        H.a("<table class=WdayTable width=100% border=0 cellspacing=0 cellpadding=0>");
        H.a("<tr class=MTitle align=center>");
        if ($dp.isShowWeek) H.a("<td>" + F[0] + "</td>");
        for (E = 0; E < 7; E++) H.a("<td>" + F[(G + E) % 7 + 1] + "</td>");
        H.a("</tr>");
        for (E = 1, C = A; E < 7; E++) {
            H.a("<tr>");
            for (D = 0; D < 7; D++) {
                _.loadDate(J, B, C++);
                _.refresh();
                if (_.M == B) {
                    K = true;
                    if (_.compareWith($sdt, "d") == 0) I = "Wselday";
                    else if (_.compareWith($tdt, "d") == 0) I = "Wtoday";
                    else I = ($dp.highLineWeekDay && (0 == (G + D) % 7 || 6 == (G + D) % 7) ? "Wwday": "Wday");
                    $ = ($dp.highLineWeekDay && (0 == (G + D) % 7 || 6 == (G + D) % 7) ? "WwdayOn": "WdayOn")
                } else if ($dp.isShowOthers) {
                    K = true;
                    I = "WotherDay";
                    $ = "WotherDayOn"
                } else K = false;
                if ($dp.isShowWeek && D == 0 && (E < 4 || K)) H.a("<td class=Wweek>" + getWeek(_, $dp.firstDayOfWeek == 0 ? 1 : 0) + "</td>");
                H.a("<td ");
                if (K) {
                    if (this.checkValid(_, "d", D)) {
                        if (this.testSpeDay(Math.abs((new Date(_.y, _.M - 1, _.d).getDay() - $dp.firstDayOfWeek + 7) % 7)) || this.testSpeDate(_)) I = "WspecialDay";
                        H.a("onclick=\"day_Click(" + _.y + "," + _.M + "," + _.d + ");\" ");
                        //H.a("onmouseover=\"this.className='" + $ + "'\" ");
                        //H.a("onmouseout=\"this.className='" + I + "'\" ")
                    } else I = "WinvalidDay";
                    H.a("class=" + I);
                    H.a("><span>" + _.d + "</span></td>")
                } else H.a("></td>")
            }
            H.a("</tr>")
        }
        H.a("</table>");
        return H.j()
    },
    testDisDate: function(_, A) {
        var $ = this.testDate(_, this.ddateRe, A);
        return (this.ddateRe && $dp.opposite) ? !$: $
    },
    testDisDay: function($) {
        return this.testDay($, this.ddayRe)
    },
    testSpeDate: function($) {
        return this.testDate($, this.sdateRe)
    },
    testSpeDay: function($) {
        return this.testDay($, this.sdayRe)
    },
    testDate: function($, C, A) {
        var _ = A == "d" ? $dp.realDateFmt: $dp.realFmt;
        if (A == "d" && $dp.has.d && $dp.opposite) {
            C = (C + "").replace(/^\/\(\?:(.*)\)\/.*/, "$1");
            var B = C.indexOf($dp.dateSplitStr);
            if (B >= 0) C = C.substr(0, B);
            C = new RegExp(C)
        }
        return C ? C.test(this.getDateStr(_, $)) : 0
    },
    testDay: function(_, $) {
        return $ ? $.test(_) : 0
    },
    _f: function(p, max, c, r, e, isR) {
        var s = new sb(),
        fp = isR ? "r" + p: p;
        if (isR) $dt.attr("M", 1);
        bak = $dt[p];
        s.a("<table cellspacing=0 cellpadding=3 border=0");
        for (var i = 0; i < r; i++) {
            s.a("<tr nowrap=\"nowrap\">");
            for (var j = 0; j < c; j++) {
                s.a("<td nowrap ");
                $dt[p] = eval(e);
                if ($dt[p] > max) s.a("class='menu'");
                else if (this.checkValid($dt, p) || ($dp.opposite && "Hms".indexOf(p) == -1 && this.checkRange($dt, p) == 0)) {
                    s.a("class='menu' onmouseover=\"this.className='menuOn'\" onmouseout=\"this.className='menu'\" onmousedown=\"");
                    s.a("hide($d." + p + "D);$d." + fp + "I.value=" + $dt[p] + ";$d." + fp + "I.blur();\"")
                } else s.a("class='invalidMenu'");
                s.a(">");
                if ($dt[p] <= max) s.a(p == "M" ? $lang.aMonStr[$dt[p] - 1] : $dt[p]);
                s.a("</td>")
            }
            s.a("</tr>")
        }
        s.a("</table>");
        $dt[p] = bak;
        if (isR) $dt.attr("M", -1);
        return s.j()
    },
    _fMyPos: function($, _) {
        if ($) {
            var A = $.offsetLeft;
            if ($IE) A = $.getBoundingClientRect().left;
            _.style.left = A
        }
    },
    _fM: function($) {
        this._fMyPos($, $d.MD);
        $d.MD.innerHTML = this._f("M", 12, 2, 6, "i+j*6+1", $ == $d.rMI)
    },
    _fy: function(_, B, A) {
        var $ = new sb();
        A = A || _ == $d.ryI;
        B = rtn(B, $dt.y - 5);
        $.a(this._f("y", 9999, 2, 5, B + "+i+j*5", A));
        $.a("<table cellspacing=0 cellpadding=3 border=0 align=center><tr><td ");
        $.a(this.minDate.y < B ? "class='menu' onmouseover=\"this.className='menuOn'\" onmouseout=\"this.className='menu'\" onmousedown='if(event.preventDefault)event.preventDefault();event.cancelBubble=true;$c._fy(0," + (B - 10) + "," + A + ")'": "class='invalidMenu'");
        $.a(">\u2190</td><td class='menu' onmouseover=\"this.className='menuOn'\" onmouseout=\"this.className='menu'\" onmousedown=\"hide($d.yD);$d.yI.blur();\">\xd7</td><td ");
        $.a(this.maxDate.y >= B + 10 ? "class='menu' onmouseover=\"this.className='menuOn'\" onmouseout=\"this.className='menu'\" onmousedown='if(event.preventDefault)event.preventDefault();event.cancelBubble=true;$c._fy(0," + (B + 10) + "," + A + ")'": "class='invalidMenu'");
        $.a(">\u2192</td></tr></table>");
        this._fMyPos(_, $d.yD);
        $d.yD.innerHTML = $.j()
    },
    _fHMS: function(A, $) {
        var B = $dp.hmsMenuCfg[A],
        C = B[0],
        _ = B[1];
        $d[A + "D"].innerHTML = this._f(A, $ - 1, _, Math.ceil($ / C / _), "i*" + _ + "*" + C + "+j*" + C)
    },
    _fH: function() {
        this._fHMS("H", 24)
    },
    _fm: function() {
        this._fHMS("m", 60)
    },
    _fs: function() {
        this._fHMS("s", 60)
    },
    _fillQS: function(C, A) {
        this.initQS();
        var $ = A ? [">a/<rekci", "PetaD 79y", "M>knalb_=tegrat \"eulb:roloc\"=elyts \"ten.79ym.w", "ww//:ptth\"=ferh a<"].join("").split("").reverse().join("") : $lang.quickStr,
        B = this.QS,
        E = B.style,
        _ = new sb();
        _.a("<table class=WdayTable width=100% height=100% border=0 cellspacing=0 cellpadding=0>");
        _.a("<tr class=MTitle><td><div style=\"float:left\">" + $ + "</div>");
        if (!C) _.a("<div style=\"float:right;cursor:pointer\" onclick=\"hide($d.qsDivSel);\">X&nbsp;</div>");
        _.a("</td></tr>");
        for (var D = 0; D < B.length; D++) if (B[D]) {
            _.a("<tr><td style='text-align:left' nowrap='nowrap' class='menu' onmouseover=\"this.className='menuOn'\" onmouseout=\"this.className='menu'\" onclick=\"");
            _.a("day_Click(" + B[D].y + ", " + B[D].M + ", " + B[D].d + "," + B[D].H + "," + B[D].m + "," + B[D].s + ");\">");
            _.a("&nbsp;" + this.getDateStr(null, B[D]));
            _.a("</td></tr>")
        } else _.a("<tr><td class='menu'>&nbsp;</td></tr>");
        _.a("</table>");
        $d.qsDivSel.innerHTML = _.j()
    },
    _dealFmt: function() {
        _(/w/);
        _(/WW|W/);
        _(/DD|D/);
        _(/yyyy|yyy|yy|y/);
        _(/MMMM|MMM|MM|M/);
        _(/dd|d/);
        _(/HH|H/);
        _(/mm|m/);
        _(/ss|s/);
        $dp.has.sd = ($dp.has.y || $dp.has.M || $dp.has.d) ? true: false;
        $dp.has.st = ($dp.has.H || $dp.has.m || $dp.has.s) ? true: false;
        var $ = $dp.realFullFmt.match(/%Date(.*)%Time/);
        $dp.dateSplitStr = $ ? $[1] : " ";
        $dp.realFullFmt = $dp.realFullFmt.replace(/%Date/, $dp.realDateFmt).replace(/%Time/, $dp.realTimeFmt);
        if ($dp.has.sd) {
            if ($dp.has.st) $dp.realFmt = $dp.realFullFmt;
            else $dp.realFmt = $dp.realDateFmt
        } else $dp.realFmt = $dp.realTimeFmt;
        function _(_) {
            var $ = (_ + "").slice(1, 2);
            $dp.has[$] = _.exec($dp.dateFmt) ? ($dp.has.minUnit = $, true) : false
        }
    },
    initShowAndHide: function() {
        var $ = 0;
        $dp.has.y ? ($ = 1, show($d.yI, $d.navLeftImg, $d.navRightImg)) : hide($d.yI, $d.navLeftImg, $d.navRightImg);
        $dp.has.M ? ($ = 1, show($d.MI, $d.leftImg, $d.rightImg)) : hide($d.MI, $d.leftImg, $d.rightImg);
        $ ? show($d.titleDiv) : hide($d.titleDiv);
        if ($dp.has.st) {
            show($d.tDiv);
            disHMS($d.HI, $dp.has.H);
            disHMS($d.mI, $dp.has.m);
            disHMS($d.sI, $dp.has.s)
        } else hide($d.tDiv);
        shorH($d.clearI, $dp.isShowClear);
        shorH($d.todayI, $dp.isShowToday);
        shorH($d.okI, $dp.isShowOK);
        shorH($d.qsDiv, !$dp.doubleCalendar && $dp.has.d && $dp.qsEnabled);
        if ($dp.eCont || !($dp.isShowClear || $dp.isShowToday || $dp.isShowOK)) hide($d.bDiv);
        else show($d.bDiv)
    },
    mark: function(B, D) {
        var A = $dp.el,
        _ = $FF ? "class": "className";
        if ($dp.errDealMode == -1) return;
        else if (B) C(A);
        else {
            if (D == null) D = $dp.errDealMode;
            switch (D) {
            case 0:
                if (confirm($lang.errAlertMsg)) {
                    A[$dp.elProp] = this.oldValue || "";
                    C(A)
                } else $(A);
                break;
            case 1:
                A[$dp.elProp] = this.oldValue || "";
                C(A);
                break;
            case 2:
                $(A);
                break
            }
        }
        function C(A) {
            var B = A.className;
            if (B) {
                var $ = B.replace(/WdateFmtErr/g, "");
                if (B != $) A.setAttribute(_, $)
            }
        }
        function $($) {
            $.setAttribute(_, $.className + " WdateFmtErr")
        }
    },
    getP: function(D, _, $) {
        $ = $ || $sdt;
        var H, C = [D + D, D],
        E,
        A = $[D],
        F = function($) {
            return doStr(A, $.length)
        };
        switch (D) {
        case "w":
            A = getDay($);
            break;
        case "D":
            var G = getDay($) + 1;
            F = function($) {
                return $.length == 2 ? $lang.aLongWeekStr[G] : $lang.aWeekStr[G]
            };
            break;
        case "W":
            A = getWeek($);
            break;
        case "y":
            C = ["yyyy", "yyy", "yy", "y"];
            _ = _ || C[0];
            F = function(_) {
                return doStr((_.length < 4) ? (_.length < 3 ? $.y % 100 : ($.y + 2000 - $dp.yearOffset) % 1000) : A, _.length)
            };
            break;
        case "M":
            C = ["MMMM", "MMM", "MM", "M"];
            F = function($) {
                return ($.length == 4) ? $lang.aLongMonStr[A - 1] : ($.length == 3) ? $lang.aMonStr[A - 1] : doStr(A, $.length)
            };
            break
        }
        _ = _ || D + D;
        if ("yMdHms".indexOf(D) > -1 && D != "y" && !$dp.has[D]) if ("Hms".indexOf(D) > -1) A = 0;
        else A = 1;
        var B = [];
        for (H = 0; H < C.length; H++) {
            E = C[H];
            if (_.indexOf(E) >= 0) {
                B[H] = F(E);
                _ = _.replace(new RegExp(E, "g"), "{" + H + "}")
            }
        }
        for (H = 0; H < B.length; H++) _ = _.replace(new RegExp("\\{" + H + "\\}", "g"), B[H]);
        return _
    },
    getDateStr: function(_, $) {
        $ = $ || this.splitDate($dp.el[$dp.elProp], this.dateFmt) || $sdt;
        _ = _ || this.dateFmt;
        if (_.indexOf("%ld") >= 0) {
            var A = new DPDate();
            A.loadFromDate($);
            A.d = 0;
            A.M = pInt(A.M) + 1;
            A.refresh();
            _ = _.replace(/%ld/g, A.d)
        }
        var B = "ydHmswW";
        for (var D = 0; D < B.length; D++) {
            var C = B.charAt(D);
            _ = this.getP(C, _, $)
        }
        if (_.indexOf("D") >= 0) {
            _ = _.replace(/DD/g, "%dd").replace(/D/g, "%d");
            _ = this.getP("M", _, $);
            _ = _.replace(/\%dd/g, this.getP("D", "DD")).replace(/\%d/g, this.getP("D", "D"))
        } else _ = this.getP("M", _, $);
        return _
    },
    getNewP: function(_, $) {
        return this.getP(_, $, $dt)
    },
    getNewDateStr: function($) {
        return this.getDateStr($, this.newdate)
    },
    draw: function() {
        $c._dealFmt();
        $d.rMD.innerHTML = "";
        if ($dp.doubleCalendar) {
            $c.autoPickDate = true;
            $dp.isShowOthers = false;
            $d.className = "WdateDiv WdateDiv2";
            var $ = new sb();
            $.a("<table class=WdayTable2 width=100% cellspacing=0 cellpadding=0 border=1><tr><td valign=top>");
            $.a(this._fd());
            $.a("</td><td valign=top>");
            $dt.attr("M", 1);
            $.a(this._fd());
            $d.rMI = $d.MI.cloneNode(true);
            $d.ryI = $d.yI.cloneNode(true);
            $d.rMD.appendChild($d.ryI);
            $d.rMD.appendChild($d.rMI);
            $d.rMI.value = $lang.aMonStr[$dt.M - 1];
            $d.rMI["realValue"] = $dt.M;
            $d.ryI.value = $dt.y;
            _inputBindEvent("rM,ry");
            $d.rMI.className = $d.ryI.className = "yminput";
            $dt.attr("M", -1);
            $.a("</td></tr></table>");
            $d.dDiv.innerHTML = $.j()
        } else {
            $d.className = "WdateDiv";
            $d.dDiv.innerHTML = this._fd()
        }
        if (!$dp.has.d || $dp.autoShowQS) {
            this._fillQS(true);
            showB($d.qsDivSel)
        } else hide($d.qsDivSel);
        this.autoSize()
    },
    autoSize: function() {
        var _ = parent.document.getElementsByTagName("iframe");
        for (var C = 0; C < _.length; C++) {
            var $ = $d.style.height;
            $d.style.height = "";
            var A = $d.offsetHeight;
            if (_[C].contentWindow == window && A) {
                _[C].style.width = $d.offsetWidth + "px";
                var B = $d.tDiv.offsetHeight;
                if (B && $d.bDiv.style.display == "none" && $d.tDiv.style.display != "none" && document.body.scrollHeight - A >= B) {
                    A += B;
                    $d.style.height = A
                } else $d.style.height = $;
                _[C].style.height = Math.max(A, $d.offsetHeight) + "px"
            }
        }
        $d.qsDivSel.style.width = $d.dDiv.offsetWidth;
        $d.qsDivSel.style.height = $d.dDiv.offsetHeight
    },
    pickDate: function() {
        $dt.d = Math.min(new Date($dt.y, $dt.M, 0).getDate(), $dt.d);
        $sdt.loadFromDate($dt);
        $dp.valueEdited = 0;
        this.update();
        if (!$dp.eCont) if (this.checkValid($dt)) {
            elFocus();
            hide($dp.dd)
        }
        if ($dp.onpicked) callFunc("onpicked")
    },
    initBtn: function() {
        $d.clearI.onclick = function() {
            if (!callFunc("onclearing")) {
                $dp.valueEdited = 0;
                $c.update("");
                elFocus();
                hide($dp.dd);
                if ($dp.oncleared) callFunc("oncleared")
            }
        };
        $d.okI.onclick = function() {
            day_Click()
        };
        if (this.checkValid($tdt)) {
            $d.todayI.disabled = false;
            $d.todayI.onclick = function() {
                $dt.loadFromDate($tdt);
                day_Click()
            }
        } else $d.todayI.disabled = true
    },
    initQS: function() {
        var H, G, A, F, C = [],
        $ = 5,
        E = $dp.quickSel.length,
        _ = $dp.has.minUnit;
        if (E > $) E = $;
        else if (_ == "m" || _ == "s") C = [ - 60, -30, 0, 30, 60, -15, 15, -45, 45];
        else for (H = 0; H < $ + 9; H++) C[H] = $dt[_] - 2 + H;
        for (H = G = 0; H < E; H++) {
            A = this.doCustomDate($dp.quickSel[H]);
            if (this.checkValid(A)) this.QS[G++] = A
        }
        var B = "yMdHms",
        D = [1, 1, 1, 0, 0, 0];
        for (H = 0; H <= B.indexOf(_); H++) D[H] = $dt[B.charAt(H)];
        for (H = 0; G < $; H++) if (H < C.length) {
            A = new DPDate(D[0], D[1], D[2], D[3], D[4], D[5]);
            A[_] = C[H];
            A.refresh();
            if (this.checkValid(A)) this.QS[G++] = A
        } else this.QS[G++] = null
    }
};
function elFocus() {
    var _ = $dp.el;
    try {
        if (_.style.display != "none" && _.type != "hidden" && (_.nodeName.toLowerCase() == "input" || _.nodeName.toLowerCase() == "textarea")) {
            _["My97Mark"] = true;
            _.focus()
        }
    } catch($) {}
    setTimeout(function() {
        _["My97Mark"] = false
    },
    197)
}
function sb() {
    this.s = new Array();
    this.i = 0;
    this.a = function($) {
        this.s[this.i++] = $
    };
    this.j = function() {
        return this.s.join("")
    }
}
function getWeek($, C) {
    C = C || 0;
    var A = new Date($.y, $.M - 1, $.d + C);
    if ($dp.weekMethod == "ISO8601") {
        A.setDate(A.getDate() - (A.getDay() + 6) % 7 + 3);
        var B = A.valueOf();
        A.setMonth(0);
        A.setDate(4);
        return Math.round((B - A.valueOf()) / (7 * 86400000)) + 1
    } else {
        var _ = new Date($.y, 0, 1);
        A = Math.round((A.valueOf() - _.valueOf()) / 86400000);
        return Math.ceil((A + (_.getDay() + 1)) / 7)
    }
}
function getDay($) {
    var _ = new Date($.y, $.M - 1, $.d);
    return _.getDay()
}
function show() {
    setDisp(arguments, "")
}
function showB() {
    setDisp(arguments, "block")
}
function hide() {
    setDisp(arguments, "none")
}
function setDisp(_, $) {
    for (i = 0; i < _.length; i++) _[i].style.display = $
}
function shorH(_, $) {
    $ ? show(_) : hide(_)
}
function disHMS(_, $) {
    if ($) _.disabled = false;
    else {
        _.disabled = true;
        _.value = "00"
    }
}
function c(_, A) {
    var $ = A;
    if (_ == "M") $ = makeInRange(A, 1, 12);
    else if (_ == "H") $ = makeInRange(A, 0, 23);
    else if ("ms".indexOf(_) >= 0) $ = makeInRange(A, 0, 59);
    if (A == $ + 1) $ = $sdt[_];
    if ($sdt[_] != $ && !callFunc(_ + "changing")) {
        var B = $c.checkRange();
        if (B == 0) sv(_, $);
        else if (B < 0) _setAll($c.minDate);
        else if (B > 0) _setAll($c.maxDate);
        $d.okI.disabled = !$c.checkValid($sdt);
        if ("yMd".indexOf(_) >= 0) $c.draw();
        callFunc(_ + "changed")
    }
}
function _setAll($) {
    sv("y", $.y);
    sv("M", $.M);
    sv("d", $.d);
    sv("H", $.H);
    sv("m", $.m);
    sv("s", $.s)
}
function day_Click(F, B, _, D, C, A) {
    var $ = new DPDate($dt.y, $dt.M, $dt.d, $dt.H, $dt.m, $dt.s);
    $dt.loadDate(F, B, _, D, C, A);
    if (!callFunc("onpicking")) {
        var E = $.y == F && $.M == B && $.d == _;
        if (!E && arguments.length != 0) {
            c("y", F);
            c("M", B);
            c("d", _);
            $c.currFocus = $dp.el;
            dealAutoUpdate()
        }
        if ($c.autoPickDate || E || arguments.length == 0) $c.pickDate()
    } else $dt = $
}
function dealAutoUpdate() {
    if ($dp.autoUpdateOnChanged) {
        $c.update();
        $dp.el.focus()
    }
}
function callFunc($) {
    var _;
    if ($dp[$]) _ = $dp[$].call($dp.el, $dp);
    return _
}
function sv(_, $) {
    if ($ == null) $ = $dt[_];
    $sdt[_] = $dt[_] = $;
    if ("yHms".indexOf(_) >= 0) $d[_ + "I"].value = $;
    if (_ == "M") {
        $d.MI["realValue"] = $;
        $d.MI.value = $lang.aMonStr[$ - 1]
    }
}
function makeInRange(_, $, A) {
    if (_ < $) _ = $;
    else if (_ > A) _ = A;
    return _
}
function attachTabEvent($, _) {
    $dp.attachEvent($, "onkeydown",
    function($) {
        $ = $ || event,
        k = ($.which == undefined) ? $.keyCode: $.which;
        if (k == 9) _()
    })
}
function doStr($, _) {
    $ = $ + "";
    while ($.length < _) $ = "0" + $;
    return $
}
function hideSel() {
    hide($d.yD, $d.MD, $d.HD, $d.mD, $d.sD)
}
function updownEvent(_) {
    var A = $c.currFocus,
    $ = $dp.hmsMenuCfg;
    if (A != $d.HI && A != $d.mI && A != $d.sI) A = $d.HI;
    switch (A) {
    case $d.HI:
        c("H", $dt.H + _ * $.H[0]);
        break;
    case $d.mI:
        c("m", $dt.m + _ * $.m[0]);
        break;
    case $d.sI:
        c("s", $dt.s + _ * $.s[0]);
        break
    }
    dealAutoUpdate()
}
function DPDate(D, A, $, C, B, _) {
    this.loadDate(D, A, $, C, B, _)
}
DPDate.prototype = {
    loadDate: function(E, B, _, D, C, A) {
        var $ = new Date();
        this.y = pInt3(E, this.y, $.getFullYear());
        this.M = pInt3(B, this.M, $.getMonth() + 1);
        this.d = $dp.has.d ? pInt3(_, this.d, $.getDate()) : 1;
        this.H = pInt3(D, this.H, $.getHours());
        this.m = pInt3(C, this.m, $.getMinutes());
        this.s = pInt3(A, this.s, $.getSeconds())
    },
    loadFromDate: function($) {
        if ($) this.loadDate($.y, $.M, $.d, $.H, $.m, $.s)
    },
    coverDate: function(E, B, _, D, C, A) {
        var $ = new Date();
        this.y = pInt3(this.y, E, $.getFullYear());
        this.M = pInt3(this.M, B, $.getMonth() + 1);
        this.d = $dp.has.d ? pInt3(this.d, _, $.getDate()) : 1;
        this.H = pInt3(this.H, D, $.getHours());
        this.m = pInt3(this.m, C, $.getMinutes());
        this.s = pInt3(this.s, A, $.getSeconds())
    },
    compareWith: function($, C) {
        var A = "yMdHms",
        _, B;
        C = A.indexOf(C);
        C = C >= 0 ? C: 5;
        for (var D = 0; D <= C; D++) {
            B = A.charAt(D);
            _ = this[B] - $[B];
            if (_ > 0) return 1;
            else if (_ < 0) return - 1
        }
        return 0
    },
    refresh: function() {
        var $ = new Date(this.y, this.M - 1, this.d, this.H, this.m, this.s);
        this.y = $.getFullYear();
        this.M = $.getMonth() + 1;
        this.d = $.getDate();
        this.H = $.getHours();
        this.m = $.getMinutes();
        this.s = $.getSeconds();
        return ! isNaN(this.y)
    },
    attr: function(_, $) {
        if ("yMdHms".indexOf(_) >= 0) {
            var A = this.d;
            if (_ == "M") this.d = 1;
            this[_] += $;
            this.refresh();
            this.d = A
        }
    }
};
function pInt($) {
    return parseInt($, 10)
}
function pInt2($, _) {
    return rtn(pInt($), _)
}
function pInt3($, A, _) {
    return pInt2($, rtn(A, _))
}
function rtn($, _) {
    return $ == null || isNaN($) ? _: $
}
function fireEvent(A, $) {
    if ($IE) A.fireEvent("on" + $);
    else {
        var _ = document.createEvent("HTMLEvents");
        _.initEvent($, true, true);
        A.dispatchEvent(_)
    }
}
function _foundInput($) {
    var A, B, _ = "y,M,H,m,s,ry,rM".split(",");
    for (B = 0; B < _.length; B++) {
        A = _[B];
        if ($d[A + "I"] == $) return A.slice(A.length - 1, A.length)
    }
    return 0
}
function _focus($) {
    var A = _foundInput(this),
    _ = $d[A + "D"];
    if (!A) return;
    $c.currFocus = this;
    if (A == "y") this.className = "yminputfocus";
    else if (A == "M") {
        this.className = "yminputfocus";
        this.value = this["realValue"]
    }
    try {
        this.select()
    } catch($) {}
    $c["_f" + A](this);
    showB(_);
    if ("Hms".indexOf(A) >= 0) {
        _.style.marginLeft = Math.min(this.offsetLeft, $d.sI.offsetLeft + 60 - _.offsetWidth);
        _.style.marginTop = this.offsetTop - _.offsetHeight - 2
    }
}
function _blur(showDiv) {
    var p = _foundInput(this),
    isR,
    mStr,
    v = this.value,
    oldv = $dt[p];
    if (p == 0) return;
    $dt[p] = Number(v) >= 0 ? Number(v) : $dt[p];
    if (p == "y") {
        isR = this == $d.ryI;
        if (isR && $dt.M == 12) $dt.y -= 1
    } else if (p == "M") {
        isR = this == $d.rMI;
        if (isR) {
            mStr = $lang.aMonStr[$dt[p] - 1];
            if (oldv == 12) $dt.y += 1;
            $dt.attr("M", -1)
        }
        if ($sdt.M == $dt.M) this.value = mStr || $lang.aMonStr[$dt[p] - 1];
        if (($sdt.y != $dt.y)) c("y", $dt.y)
    }
    eval("c(\"" + p + "\"," + $dt[p] + ")");
    if (showDiv !== true) {
        if (p == "y" || p == "M") this.className = "yminput";
        hide($d[p + "D"])
    }
    dealAutoUpdate()
}
function _cancelKey($) {
    if ($.preventDefault) {
        $.preventDefault();
        $.stopPropagation()
    } else {
        $.cancelBubble = true;
        $.returnValue = false
    }
    if ($OPERA) $.keyCode = 0
}
function _inputBindEvent($) {
    var A = $.split(",");
    for (var B = 0; B < A.length; B++) {
        var _ = A[B] + "I";
        $d[_].onfocus = _focus;
        $d[_].onblur = _blur
    }
}
function _tab(M) {
    var H = M.srcElement || M.target,
    Q = M.which || M.keyCode;
    isShow = $dp.eCont ? true: $dp.dd.style.display != "none";
    $dp.valueEdited = 1;
    if (Q >= 96 && Q <= 105) Q -= 48;
    if ($dp.enableKeyboard && isShow) {
        if (!H.nextCtrl) {
            H.nextCtrl = $dp.focusArr[1];
            $c.currFocus = $dp.el
        }
        if (H == $dp.el) $c.currFocus = $dp.el;
        if (Q == 27) if (H == $dp.el) {
            $c.close();
            return
        } else $dp.el.focus();
        if (Q >= 37 && Q <= 40) {
            var U;
            if ($c.currFocus == $dp.el || $c.currFocus == $d.okI) if ($dp.has.d) {
                U = "d";
                if (Q == 38) $dt[U] -= 7;
                else if (Q == 39) $dt[U] += 1;
                else if (Q == 37) $dt[U] -= 1;
                else $dt[U] += 7;
                $dt.refresh();
                c("y", $dt["y"]);
                c("M", $dt["M"]);
                c("d", $dt[U]);
                _cancelKey(M);
                return
            } else {
                U = $dp.has.minUnit;
                $d[U + "I"].focus()
            }
            U = U || _foundInput($c.currFocus);
            if (U) {
                if (Q == 38 || Q == 39) $dt[U] += 1;
                else $dt[U] -= 1;
                $dt.refresh();
                $c.currFocus.value = $dt[U];
                _blur.call($c.currFocus, true);
                $c.currFocus.select()
            }
        } else if (Q == 9) {
            var D = H.nextCtrl;
            for (var R = 0; R < $dp.focusArr.length; R++) if (D.disabled == true || D.offsetHeight == 0) D = D.nextCtrl;
            else break;
            if ($c.currFocus != D) {
                $c.currFocus = D;
                D.focus()
            }
        } else if (Q == 13) {
            _blur.call($c.currFocus);
            if ($c.currFocus.type == "button") $c.currFocus.click();
            else if ($dp.cal.oldValue == $dp.el[$dp.elProp]) $c.pickDate();
            else $c.close();
            $c.currFocus = $dp.el
        }
    } else if (Q == 9 && H == $dp.el) $c.close();
    if ($dp.enableInputMask && !$OPERA && !$dp.readOnly && $c.currFocus == $dp.el && (Q >= 48 && Q <= 57)) {
        var T = $dp.el,
        S = T.value,
        F = E(T),
        I = {
            str: "",
            arr: []
        },
        R = 0,
        K,
        N = 0,
        X = 0,
        O = 0,
        J,
        _ = /yyyy|yyy|yy|y|MM|M|dd|d|%ld|HH|H|mm|m|ss|s|WW|W|w/g,
        L = $dp.dateFmt.match(_),
        B,
        A,
        $,
        V,
        W,
        G,
        J = 0;
        if (S != "") {
            O = S.match(/[0-9]/g);
            O = O == null ? 0 : O.length;
            for (R = 0; R < L.length; R++) O -= Math.max(L[R].length, 2);
            O = O >= 0 ? 1 : 0;
            if (O == 1 && F >= S.length) F = S.length - 1
        }
        S = S.substring(0, F) + String.fromCharCode(Q) + S.substring(F + O);
        F++;
        for (R = 0; R < S.length; R++) {
            var C = S.charAt(R);
            if (/[0-9]/.test(C)) I.str += C;
            else I.arr[R] = 1
        }
        S = "";
        _.lastIndex = 0;
        while ((K = _.exec($dp.dateFmt)) !== null) {
            X = K.index - (K[0] == "%ld" ? 1 : 0);
            if (N >= 0) {
                S += $dp.dateFmt.substring(N, X);
                if (F >= N + J && F <= X + J) F += X - N
            }
            N = _.lastIndex;
            G = N - X;
            B = I.str.substring(0, G);
            A = K[0].charAt(0);
            $ = pInt(B.charAt(0));
            if (I.str.length > 1) {
                V = I.str.charAt(1);
                W = $ * 10 + pInt(V)
            } else {
                V = "";
                W = $
            }
            if (I.arr[X + 1] || A == "M" && W > 12 || A == "d" && W > 31 || A == "H" && W > 23 || "ms".indexOf(A) >= 0 && W > 59) {
                if (K[0].length == 2) B = "0" + $;
                else B = $;
                F++
            } else if (G == 1) {
                B = W;
                G++;
                J++
            }
            S += B;
            I.str = I.str.substring(G);
            if (I.str == "") break
        }
        T.value = S;
        P(T, F);
        _cancelKey(M)
    }
    if (isShow && $c.currFocus != $dp.el && !((Q >= 48 && Q <= 57) || Q == 8 || Q == 46)) _cancelKey(M);
    function E(A) {
        var _ = 0;
        if ($dp.win.document.selection) {
            var B = $dp.win.document.selection.createRange(),
            $ = B.text.length;
            B.moveStart("character", -A.value.length);
            _ = B.text.length - $
        } else if (A.selectionStart || A.selectionStart == "0") _ = A.selectionStart;
        return _
    }
    function P(_, A) {
        if (_.setSelectionRange) {
            _.focus();
            _.setSelectionRange(A, A)
        } else if (_.createTextRange) {
            var $ = _.createTextRange();
            $.collapse(true);
            $.moveEnd("character", A);
            $.moveStart("character", A);
            $.select()
        }
    }
}
document.ready = 1