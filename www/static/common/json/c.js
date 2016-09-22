function jsonFormat(container, initFormat) {
    this.SINGLE_TAB = "  ";
    this.ImgCollapsed = "/static/common/json/Collapsed.gif";
    this.ImgExpanded = "/static/common/json/Expanded.gif";
    this.QuoteKeys = true;
    this._dateObj = new Date();
    this._regexpObj = new RegExp();
    this.container = $(container);
    this.json = this.container.find('.formContent').val();
    this.Canvas = this.container.find('.formatCanvas');
    this.formatCollapsibleView = this.container.find('.formatCollapsibleView')
    this.IsCollapsible = this.formatCollapsibleView[0].checked;
    var _this = this;
    this.container.find('.formatQuoteKeys').off().on('click', function () {
        var self = this;
        _this.QuoteKeysClicked(self.checked)
    })


    this.formatCollapsibleView.off().on('click', function () {
        var self = this;
        _this.QuoteKeysClicked(self.checked)
    })
    // this.container.find('.formatCollapsibleViewDetail').html('<a href="javascript:void(0);" class="formatExpand">展开</a>' +
    //     '<a href="javascript:void(0);" class="formatCollapse">叠起</a>'
    // )
    var viewDetail = this.container.find('.formatCollapsibleViewDetail')
    viewDetail.find('.formatExpand').off().on('click', function () {
        _this.CollapseOrExpandAll(true)
    })
    viewDetail.find('.formatCollapse').off().on('click', function () {
        _this.CollapseOrExpandAll(false)
    })
    var formLevel = this.container.find('.formatCollapsibleViewDetail').find('.formLevel')
    formLevel.off().on('click', function () {
        _this.CollapseLevel($(this).index() + 1)
    })
    this.container.find('.formatAllSelect').off().on('click', function () {
        _this.SelectAllClicked()
    })
    if (initFormat) {
        this.Process()
    }
}
jsonFormat.prototype = {
    IsArray: function (obj) {
        return obj &&
            typeof obj === 'object' &&
            typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length'));
    },
    Process: function () {
        var _this = this;
        this.json = this.container.find('.formContent').val();
        this.IsCollapsible = this.formatCollapsibleView[0].checked;
        this.Canvas = this.container.find('.formatCanvas');
        this.SetTab();
        var html = "";
        try {
            if (this.json == "") this.json = "\"\"";
            var obj = eval("[" + this.json + "]");
        } catch (e) {
            alert("JSON数据格式不正确:\n" + e.message);
            this.Canvas.html('');
        }
        html = this.ProcessObject(obj[0], 0, false, false, false);
        this.Canvas.html("<pre class='CodeContainer'>" + html + "</pre>");
        if (this.IsCollapsible) {
            this.Canvas.find('.icon_format').off().on('click', function () {
                _this.ExpImgClicked(this);
            })
        }
    },
    GetRow: function (indent, data, isPropertyContent) {
        var tabs = "";
        for (var i = 0; i < indent && !isPropertyContent; i++) tabs += this.TAB;
        if (data != null && data.length > 0 && data.charAt(data.length - 1) != "\n")

            data = data + "\n";
        return tabs + data;
    },
    ExpImgClicked: function (img) {
        var container = img.parentNode.nextSibling;
        if (!container) return;
        var disp = "none";
        var src = this.ImgCollapsed;
        if (container.style.display == "none") {
            disp = "inline";
            src = this.ImgExpanded;
        }
        container.style.display = disp;
        img.src = src;
    },
    FormatFunction: function (indent, obj) {
        var tabs = "";
        for (var i = 0; i < indent; i++) tabs += this.TAB;
        var funcStrArray = obj.toString().split("\n");
        var str = "";
        for (var i = 0; i < funcStrArray.length; i++) {
            str += ((i == 0) ? "" : tabs) + funcStrArray[i] + "\n";
        }
        return str;
    },
    FormatLiteral: function (literal, quote, comma, indent, isArray, style) {
        if (typeof literal == 'string')
            literal = literal.split("<").join("&lt;").split(">").join("&gt;");
        var str = "<span class='" + style + "'>" + quote + literal + quote + comma + "</span>";
        if (isArray) str = this.GetRow(indent, str);
        return str;
    },
    ProcessObject: function (obj, indent, addComma, isArray, isPropertyContent) {
        var html = "";
        var comma = (addComma) ? "<span class='Comma'>,</span> " : "";
        var type = typeof obj;
        var clpsHtml = "";
        if (this.IsArray(obj)) {
            if (obj.length == 0) {
                html += this.GetRow(indent, "<span class='ArrayBrace'>[ ]</span>" + comma, isPropertyContent);
            } else {
                clpsHtml = this.IsCollapsible ? "<span><img class='icon_format' src=\"" + this.ImgExpanded + "\"  /></span><span class='collapsible'>" : "";
                html += this.GetRow(indent, "<span class='ArrayBrace'>[</span>" + clpsHtml, isPropertyContent);
                for (var i = 0; i < obj.length; i++) {
                    html += this.ProcessObject(obj[i], indent + 1, i < (obj.length - 1), true, false);
                }
                clpsHtml = this.IsCollapsible ? "</span>" : "";
                html += this.GetRow(indent, clpsHtml + "<span class='ArrayBrace'>]</span>" + comma);
            }
        } else if (type == 'object') {
            if (obj == null) {
                html += this.FormatLiteral("null", "", comma, indent, isArray, "Null");
            } else if (obj.constructor == this._dateObj.constructor) {
                html += this.FormatLiteral("new Date(" + obj.getTime() + ") /*" + obj.toLocaleString() + "*/", "", comma, indent, isArray, "Date");
            } else if (obj.constructor == this._regexpObj.constructor) {
                html += FormatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp");
            } else {
                var numProps = 0;
                for (var prop in obj) numProps++;
                if (numProps == 0) {
                    html += this.GetRow(indent, "<span class='ObjectBrace'>{ }</span>" + comma, isPropertyContent);
                } else {
                    clpsHtml = this.IsCollapsible ? "<span><img class='icon_format' src=\"" + this.ImgExpanded + "\"  /></span><span class='collapsible'>" : "";
                    html += this.GetRow(indent, "<span class='ObjectBrace'>{</span>" + clpsHtml, isPropertyContent);
                    var j = 0;
                    for (var prop in obj) {
                        var quote = this.QuoteKeys ? "\"" : "";
                        html += this.GetRow(indent + 1, "<span class='PropertyName'>" + quote + prop + quote + "</span>: " + this.ProcessObject(obj[prop], indent + 1, ++j < numProps, false, true));
                    }
                    clpsHtml = this.IsCollapsible ? "</span>" : "";
                    html += this.GetRow(indent, clpsHtml + "<span class='ObjectBrace'>}</span>" + comma);
                }
            }
        } else if (type == 'number') {
            html += this.FormatLiteral(obj, "", comma, indent, isArray, "Number");
        } else if (type == 'boolean') {
            html += this.FormatLiteral(obj, "", comma, indent, isArray, "Boolean");
        } else if (type == 'function') {
            if (obj.constructor == this._regexpObj.constructor) {
                html += this.FormatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp");
            } else {
                obj = this.FormatFunction(indent, obj);
                html += this.FormatLiteral(obj, "", comma, indent, isArray, "Function");
            }
        } else if (type == 'undefined') {
            html += this.FormatLiteral("undefined", "", comma, indent, isArray, "Null");
        } else {
            html += this.FormatLiteral(obj.toString().split("\\").join("\\\\").split('"').join('\\"'), "\"", comma, indent, isArray, "String");
        }
        return html;
    },
    CollapsibleViewClicked: function (CollapsibleViewDetail, isChecked) {
        if (isChecked) {
            $(CollapsibleViewDetail).show()
        } else {
            $(CollapsibleViewDetail).hidden()
        }
        this.Process();
    },
    QuoteKeysClicked: function (isChecked) {
        this.QuoteKeys = isChecked;
        this.Process();
    },
    CollapseOrExpandAll: function (isCollapse) {
        isCollapse = isCollapse ? true : false;
        this.EnsureIsPopulated();
        var _this = this;
        this.TraverseChildren(this.Canvas[0], function (element) {
            if (element.className == 'collapsible') {
                _this.MakeContentVisible(element, isCollapse);
            }
        }, 0);
    },
    MakeContentVisible: function (element, visible) {
        var img = element.previousSibling.firstChild;
        if (!!img.tagName && img.tagName.toLowerCase() == "img") {
            element.style.display = visible ? 'inline' : 'none';
            element.previousSibling.firstChild.src = visible ? this.ImgExpanded : this.ImgCollapsed;
        }
    },
    TraverseChildren: function (element, func, depth) {
        for (var i = 0; i < element.childNodes.length; i++) {
            this.TraverseChildren(element.childNodes[i], func, depth + 1);
        }
        func(element, depth);
    },
    CollapseLevel: function (level) {
        var _this = this;
        this.EnsureIsPopulated();
        this.TraverseChildren(this.Canvas[0], function (element, depth) {
            if (element.className == 'collapsible') {
                if (depth >= level) {
                    _this.MakeContentVisible(element, false);
                } else {
                    _this.MakeContentVisible(element, true);
                }
            }
        }, 0);
    },
    TabSizeChanged: function (IsCollapsible, json, Canvas) {
        this.Process(IsCollapsible, json, Canvas);
    },
    SetTab: function () {
        // var select = $id("TabSize");
        this.TAB = this.MultiplyString(2, this.SINGLE_TAB);
    },
    EnsureIsPopulated: function () {
        if (!this.Canvas.html() && this.json) this.Process();
    },
    MultiplyString: function (num, str) {
        var sb = [];
        for (var i = 0; i < num; i++) {
            sb.push(str);
        }
        return sb.join("");
    },
    SelectAllClicked: function () {
        if (!!document.selection && !!document.selection.empty) {
            document.selection.empty();
        } else if (this.getSelection) {
            var sel = this.getSelection();
            if (sel.removeAllRanges) {
                this.getSelection().removeAllRanges();
            }
        }
        var range =
            (!!document.body && !!document.body.createTextRange)
                ? document.body.createTextRange()
                : document.createRange();
        if (!!range.selectNode)

            range.selectNode(this.Canvas[0]);
        else if (range.moveToElementText)

            range.moveToElementText(this.Canvas[0]);
        if (!!range.select)

            range.select(this.Canvas[0]);
        else

            window.getSelection().addRange(range);
    }
}


