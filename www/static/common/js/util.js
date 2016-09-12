/**
 * cookie操作
 * 设置 $.cookie('the_cookie', 'the_value');
 * 获取 $.cookie('the_cookie');
 * 删除 $.cookie('the_cookie', null);
 *     $.cookie('the_cookie', '', {expires:-1,path:'指定path'});
 */
$.cookie = jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
Array.prototype.in_array = function (e) {
    for (i = 0; i < this.length; i++) {
        if (this[i] == e) {
            return i;
        }
    }
    return -1;
}
String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.LTrim = function () {
    return this.replace(/(^\s*)/g, "");
}
String.prototype.RTrim = function () {
    return this.replace(/(\s*$)/g, "");
}
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function getBodyHeight() {
    if (document.compatMode == "BackCompat") {
        var Node = document.body;
    } else {
        var Node = document.documentElement;
    }
    var h = Math.max(Node.scrollHeight, Node.clientHeight);
    if (h > window.screen.height) {
        h = window.screen.height;
    }
    if (h > window.screen.availHeight) {
        h = window.screen.availHeight;
    }
    return h;
}
function getBodyWidth() {
    if (document.compatMode == "BackCompat") {
        var Node = document.body;
    } else {
        var Node = document.documentElement;
    }
    var w = Math.max(Node.scrollHeight, Node.clientWidth);
    if (w > window.screen.width) {
        w = window.screen.width;
    }
    if (w > window.screen.availWidth) {
        w = window.screen.availWidth;
    }
    return w;
}
function iFrameHeight(id) {
    var ifm = document.getElementById(id);
    var subWeb = document.frames ? document.frames[id].document : ifm.contentDocument;
    if (ifm != null && subWeb != null) {
        ifm.height = subWeb.body.scrollHeight + 30;
        ifm.width = subWeb.body.scrollWidth;
    }
}
$.event.special.valuechange = {
    teardown: function (namespaces) {
        $(this).unbind('.valuechange');
    },
    handler: function (e) {
        $.event.special.valuechange.triggerChanged($(this));
    },
    add: function (obj) {
        $(this).on('keyup.valuechange cut.valuechange paste.valuechange input.valuechange', obj.selector, $.event.special.valuechange.handler)
    },
    triggerChanged: function (element) {
        var current = element[0].contentEditable === 'true' ? element.html() : element.val()
            , previous = typeof element.data('previous') === 'undefined' ? element[0].defaultValue : element.data('previous')
        if (current !== previous) {
            element.trigger('valuechange', [element.data('previous')])
            element.data('previous', current)
        }
    }
};
function ShowPriceDialog(url, data, title) {
    var api, wrap, count;
    var dialog = $.dialog({
        title: false,
        cancel: function () {
        },
        cancelVal: '关闭',
        cancelCssClass: 'btn-cancel',
        fixed: true,
        lock: true,
        top: '10%',
        isClickShade: false,
        init: function (here) {
            api = this;
            wrap = api.DOM.wrap;
            wrap.find('.aui_close').css({
                'font-size': '24px',
                'top': '4px',
                'right': '4px',
                'color': '#fff'
            });
        },
        close: function () {
            wrap.find('.aui_close').removeAttr("style");
        }
    }).content("<link rel='stylesheet' type='text/css' href='/common/plugins/fullcalendar/css/fullcalendar.css' />"
        + "<style>#calendar{width:780px;}</style>"
        + "<div id='dialogContent'>"
        + "<div style='border-bottom:4px solid #f2d7c2;margin: -23px -25px 0 -25px;background-color: #A5D2E1;height: 45px;line-height: 45px;padding-left: 20px;color: #fff;'><h2>" + (title || "价格详情") + "</h2></div><br/>"
        + "<div id='calendar'></div>"
        + "</div>"
        + "\<script src='/common/plugins/fullcalendar/js/My97DatePicker/WdatePicker.js'\>\<\/script\>"
        + "\<script src='/common/plugins/fullcalendar/js/fullcalendar.js'\>\<\/script\>");
    $('#calendar').fullCalendar({
        header: {
            left: 'selectYear selectMonth tongji',
            center: '',
            right: 'today'
        },
        events: {
            url: url, data: $.extend({}, data),
            async: false,
            success: function (json) {
                var res = eval('(' + json + ')');
                count = res.pagination.count;
                return res.prices;
            }
        },
        //events: [{"title":"￥3900","start":"2015-04-15 18:00","end":"2015-04-15 22:00"},{"title":"￥3400","start":"2015-04-16 18:00","end":"2015-04-16 22:00"}],
        eventColor: '#fff',
        eventTextColor: '#d23e3e',
        weekMode: 'liquid',
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        updateTongji: function (el, event) {
            $(el).find(".tongji").html('有' + event.length + '个价格 / 共计' + (count || 0) + '个价格');
        },
        dayClick: function (date, allDay, jsEvent, view) {
        }
    });
}
//单图片上传
function simpleUpload(obj, callback, url, maxFileSize) {
    var debug = false;
    $res = $(obj).find(".result");
    maxFileSize = (maxFileSize || 2);
    getUploadPlugin();
    $(obj).dmUploader({
        url: url || '/gallery?format=json',
        dataType: 'json',
        allowedTypes: 'image/*',
        maxFileSize: maxFileSize * 1024 * 1024,
        /* extFilter: 'jpg;png;gif', */
        onInit: function () {
            log('upload plugin initialized :)');
        },
        onBeforeUpload: function (id) {
            log('Starting the upload of #' + id);
        },
        onNewFile: function (id, file) {
            log('New file added to queue #' + id);
            $res.html("<div class='bar'><div class='progress'></div></div>");
        },
        onUploadProgress: function (id, percent) {
            var percentStr = percent + '%';
            $(obj).find('div.progress').width(percent);
        },
        onUploadSuccess: function (id, data) {
            if (typeof data === "string") {
                data = eval('(' + data + ')');
            }
            log('Upload of file #' + id + ' completed');
            log('Server Response for file #' + id + ': ' + JSON.stringify(data));
            $(obj).find('.progress').width('100%');
            if (data.success) {
                if (typeof callback === 'function') {
                    callback.call($(obj), data);
                }
                $(obj).find('.upload_title').hide();
                showInfo("√上传成功", true);
            } else {
                $(obj).find('.upload_title').hide();
                showInfo("上传失败：" + (data.message || data.result.message));
            }
        },
        onUploadError: function (id, message) {
            $(obj).find('.upload_title').hide();
            showInfo("上传失败：" + message)
        },
        onFileTypeError: function (file) {
            $(obj).find('.upload_title').hide();
            showInfo("只能上传图片格式")
        },
        onFileSizeError: function (file) {
            $(obj).find('.upload_title').hide();
            showInfo("文件大小不能超过" + maxFileSize + "M")
        },
        onFallbackMode: function (message) {
            $(obj).find('.upload_title').hide();
            showInfo('您的浏览器暂不支持，建议使用chrome浏览器: ' + message);
        }
    });
    function showInfo(info, right) {
        setTimeout(function () {
            $res.html("");
            $(obj).find('.upload_title').show();
        }, 3000);
        $res.html("<span style='font-size:12px;' class='" + (right ? "success" : "error") + "'>" + info + "</span>");
    }

    function log(msg) {
        if (debug) {
            console.log(msg);
        }
    }

    function getScript(url, callback) {
        $.ajax({
            url: url,
            dataType: "script",
            async: false,
            success: callback || $.noop,
            error: function () {
                alert(url + "未找到！")
            }
        });
    }

    function getUploadPlugin() {
        $.fn.dmUploader === undefined && getScript("/common/plugins/dmuploader/dmuploader.min.js");
    }
}
function initUEditor(opts) {
    var defaultOpions = {
        'textareaObj': null,
        'textlength': 20000,
        'zIndex': 1, 
        'touristLineId': null, 
        'touristLineObj': null, 
        'maxScaleEnaledWidth': null,
        'maxScaleEnaledHeight': null,
        'galleryImageType': '', 
        'galleryImageTypeObj': null,
        'uploadOpts':null,
        "pasteplain":true,
        "autoTransWordToList":true,
        "retainOnlyLabelPasted":true,
        "removeStyle":true
    };
    //pasteplain:true 纯文本粘贴 ,autoTransWordToList：true 禁止粘贴的list列表变成列表标签 removeStyle:true 默认去除粘贴样式
    opts = $.extend({}, defaultOpions, opts || {});
    window.editorIds = window.editorIds || 0;
    var templateObj = $(opts.textareaObj);
    opts.textareaObj = templateObj.length ? templateObj : $('#' + opts.textareaObj);
    var isinit = $(opts.textareaObj).attr('isinit');
    //判断当前的TEXTAREA是否为已初始化为编辑器，如果是则不重新初始化，否则会出现多余的编辑器
    if (isinit === '1') {
        return false;
    }
    var text = opts.textareaObj.text(), editorId = opts.textareaObj[0].id, placeholder = opts.textareaObj.attr('placeholder');
    window.editorIds++;
    if (!editorId) {
        editorId = 'myEditor' + window.editorIds;
    }
    //obj.attr({'id': 'myEditor' + window.editorIds, 'editorId': 'myEditor' + window.editorIds, 'isInit': '1'});
    opts.textareaObj.attr({id: editorId, 'editorId': editorId, 'isInit': '1'});
    //}
    var recentlyuse_url = opts.textareaObj.attr("recentlyuse");
    if (!opts.textlength) {
        opts.textlength = opts.textareaObj.attr("maxlength");
    }
    var ue = window.UE.getEditor(opts.textareaObj[0].id, {
        //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
        toolbars: ((null != recentlyuse_url && "" != recentlyuse_url) ?
            [['Bold', 'italic', 'forecolor', 'insertorderedlist', 'diyupload', 'recentlyuse']]
            : [['Bold', 'italic', 'forecolor', 'insertorderedlist', 'diyupload']]),
        //focus时自动清空初始化时的内容
        autoClearinitialContent: false,
        //关闭elementPath
        elementPathEnabled: false,
        retainOnlyLabelPasted: opts.retainOnlyLabelPasted, //粘贴只保留标签，去除标签所有属性
        pasteplain: opts.pasteplain,//纯文本粘贴
        autoTransWordToList:opts.autoTransWordToList,//禁止word中粘贴进来的列表自动变成列表标签
        imageScaleEnabled: false,//禁止图片缩放大小
        scaleEnabled: (opts.maxScaleEnaledHeight > 0 || opts.maxScaleEnaledWidth > 0) ? true : false,
        enableAutoSave: false,
        saveInterval: 10000000,
        placeholder: placeholder,
        maxScaleEnaledWidth: opts.maxScaleEnaledWidth && opts.maxScaleEnaledWidth > 0 ? opts.maxScaleEnaledWidth : 900,
        maxScaleEnaledHeight: opts.maxScaleEnaledHeight > 0 ? opts.maxScaleEnaledHeight : 600,
        zIndex: opts.zIndex,
        topOffset: 135,
        autoFloatEnabled: false,//是否保持toolbar的位置不动，默认true
        autoHeightEnabled: false,  //是否自动长高，默认true
        //toolbarTopOffset:500,
        recentlyuseUrl: recentlyuse_url,
        touristLineId: opts.touristLineId,
        touristLineObj: opts.touristLineObj,
        enableContextMenu: false,
        touristLineObj: opts.touristLineObj && null != opts.touristLineObj ? opts.touristLineObj : '#lineSelect',
        initialFrameHeight: 250,
        wordCount: false,        //是否开启字数统计
        maximumWords: opts.textlength,
        wordOverFlowMsg: '<span style="color:red;">你输入的字符个数已经超出最大允许值,最多输入' + opts.textlength + '个字符</span>',
        removeFormat: true,
        removeFormatTags: 'b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var,script',
        removeFormatAttributes: 'class,style,lang,width,height,align,hspace,valign,title',
        'galleryImageType': opts.galleryImageType,
        'galleryImageTypeObj': typeof opts.galleryImageTypeObj === 'string' ? opts.galleryImageTypeObj : opts.galleryImageTypeObj.selector,
        uploadOpts:opts.uploadOpts==null?"":opts.uploadOpts,
        themePath: WEB_STATIC + '/common/plugins/UEditor1.4.3/themes/',
        insertorderedlist: {
            //系统自带
            'decimal': '1,2,3...',
            'lower-alpha': '', // 'a,b,c...'
            'lower-roman': '', //'i,ii,iii...'
            'upper-alpha': '', //'A,B,C'
            'upper-roman': '' //'I,II,III...'
        },
        enableContextMenu: false,
        filterRules: function () {
        	var ruels;
        	if(opts.removeStyle == true){
	        	ruels={
	                    span: function (node) {
	                        if (/Wingdings|Symbol/.test(node.getStyle('font-family'))) {
	                            return true;
	                        } else {
	                            node.parentNode.removeChild(node, true);
	                        }
	                    },
	                    p: function (node) {
	                        var listTag;
	                        if (node.getAttr('class') == 'MsoListParagraph') {
	                            listTag = 'MsoListParagraph';
	                        }
	                        node.setAttr();
	                        if (listTag) {
	                            node.setAttr('class', 'MsoListParagraph');
	                        }
	                        if (!node.firstChild()) {
	                            node.innerHTML(UE.browser.ie ? '&nbsp;' : '<br>');
	                        }
	                    },
	                    div: function (node) {
	                        var tmpNode, p = UE.uNode.createElement('p');
	                        while (tmpNode = node.firstChild()) {
	                            if (tmpNode.type == 'text' || !UE.dom.dtd.$block[tmpNode.tagName]) {
	                                p.appendChild(tmpNode);
	                            } else {
	                                if (p.firstChild()) {
	                                    node.parentNode.insertBefore(p, node);
	                                    p = UE.uNode.createElement('p');
	                                } else {
	                                    node.parentNode.insertBefore(tmpNode, node);
	                                }
	                            }
	                        }
	                        if (p.firstChild()) {
	                            node.parentNode.insertBefore(p, node);
	                        }
	                        node.parentNode.removeChild(node);
	                    },
	                    //$:{}表示不保留任何属性
	                    br: {$: {}},
	                    ol: {$: {}},
	                    ul: {$: {}},
	                    dl: function (node) {
	                        node.tagName = 'ul';
	                        node.setAttr()
	                    },
	                    dt: function (node) {
	                        node.tagName = 'li';
	                        node.setAttr()
	                    },
	                    dd: function (node) {
	                        node.tagName = 'li';
	                        node.setAttr()
	                    },
	                    li: function (node) {
	                        var className = node.getAttr('class');
	                        if (!className || !/list\-/.test(className)) {
	                            node.setAttr()
	                        }
	                        var tmpNodes = node.getNodesByTagName('ol ul');
	                        UE.utils.each(tmpNodes, function (n) {
	                            node.parentNode.insertAfter(n, node);
	                        });
	                    },
	                    table: function (node) {
	                        UE.utils.each(node.getNodesByTagName('table'), function (t) {
	                            UE.utils.each(t.getNodesByTagName('tr'), function (tr) {
	                                var p = UE.uNode.createElement('p'), child, html = [];
	                                while (child = tr.firstChild()) {
	                                    html.push(child.innerHTML());
	                                    tr.removeChild(child);
	                                }
	                                p.innerHTML(html.join('&nbsp;&nbsp;'));
	                                t.parentNode.insertBefore(p, t);
	                            })
	                            t.parentNode.removeChild(t);
	                        });
	                        var val = node.getAttr('width');
	                        node.setAttr();
	                        if (val) {
	                            node.setAttr('width', val);
	                        }
	                    },
	                    tbody: {$: {}},
	                    caption: {$: {}},
	                    th: {$: {}},
	                    td: {$: {valign: 1, align: 1, rowspan: 1, colspan: 1, width: 1, height: 1}},
	                    tr: {$: {}},
	                    h3: {$: {}},
	                    h2: {$: {}},
	                    img: {},
	                    script: {$: {}},
	                    //黑名单，以下标签及其子节点都会被过滤掉
	                    '-': 'script style meta iframe embed object'
	                };
	        	}
	        	else{
	        		ruels=null;
	        	}
            return ruels;
        }()
    });
    ue.ready(function () {
        if (placeholder) {
            var val = $.trim(ue.getContentTxt());
            if (val === '' && placeholder) {
                ue.setContent(setPlaceholder(placeholder));
            }
            ue.addListener('focus', function () {
                var val = $.trim(ue.getContentTxt()),
                    html = $.trim(ue.getContent()),
                    hasImg = ue.hasContents(['img']);

                if (placeholder === val && html == '<p>' + setPlaceholder(placeholder) + '</p>') {
                    ue.setContent('');
                }
            });
            ue.addListener('blur', function () {
                var val = $.trim(ue.getContentTxt()), hasImg = ue.hasContents();
                if (val === '' && !hasImg) {
                    ue.setContent(setPlaceholder(placeholder));
                }
            });
        }

        function setPlaceholder(text){
            return '<span class="ue-placeholder">' + text + '</span>';
        }
    })
    return ue;
}
/**
 * 销毁所有编辑器
 */
function destoryUEditor() {
    $("textarea[tag=edit]").each(function () {
        UE.getEditor($(this).attr('editorId')).completeDestroy();
    });
}
/**
 * 销毁所有编辑器
 */
function destoryUEditorBySelector(editorElements) {
    $(editorElements).filter("textarea[tag=edit]").each(function () {
        UE.getEditor($(this).attr('editorId')).completeDestroy();
    });
}
function checkUEditor() {
    var valid = true;
    $("textarea[tag^=edit]").each(function () {
        var editorId = $(this).attr('editorId'), currEditor = UE.getEditor(editorId), placeholder = $(this).attr("placeholder");
        currEditor.sync();
        var value = currEditor.getContentTxt();
        var html = currEditor.getContent();
        if (value == placeholder) {
            value = "";
        }
        //console.log($(this).attr('editorId'));
        var max = $(this).attr("maxlength") || 20000;
        var $tar = $(this).is(":visible") ? $(this) : $(this).parent();
        var requiredVal = $(this).attr("required");
        var required = requiredVal && requiredVal == "required";
        if (required && !value) {
            var text = /<img/.test(html) ? '* 请输入文字' : '* 不能为空'; 
            showValidError($tar, text);
            valid = false;
            currEditor.body.focus();
            return false;
        }
        if (value.length > max) {
            showValidError($tar, "* 最多 " + max + " 个字符");
            valid = false;
            currEditor.body.focus();
            return false;
        }
    });
    return valid;
}
function showValidError($tar, msg, pos) {
    var viewport = $('#page-content-viewport');

    // 当所有绑定在form上的验证通过时再滚动
    if(!$('.error').length){
        // 容器内滚动时，实际相对容器的偏移量等于offset().top +　容器的滚动条的便宜　　180：顶部fix的高度 +　微调
        viewport.animate({scrollTop : $tar.offset().top + viewport.scrollTop() - 180}, function(){
            $tar.validationEngine('showPrompt',msg,'error',pos,true);
        });
    }else{
        $tar.validationEngine('showPrompt',msg,'error',pos,true);
    }
}
var _IE = (function () {
    var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]
        );
    return v > 4 ? v : 10;
}());
function jqfileUpload(obj, callback, url, maxFileSize) {
    var option = {};
    if (_IE <= 9) {
        $.extend(option, {contentType: "text/html,application/xhtml+xml,multipart/*,application/json; charset=utf-8"})
    }
    if ($(obj).attr("inited"))
        return false;
    var debug = false;
    var $res = $(obj).find(".message");
    maxFileSize = (maxFileSize || 100);
    //getUploadPlugin();
    $(obj).attr("inited", true).fileupload($.extend(option, {
        url: url || '/attachment.json',
        dataType: 'json',
        sequentialUploads: false,
        maxFileSize: maxFileSize,
        done: function (e, d) {
            var data = d.result, id = d.index;
            if (typeof data === "string") {
                data = eval('(' + data + ')');
            }
            if (data.success) {
                if (typeof callback === 'function') {
                    callback.call($(obj), data);
                }
                $(obj).parent().find('#file-item' + id).find('.progress_bar').width('0%');
                $(obj).parent().find('#file-item' + id).find('.file_title').text(data.name);
                $(obj).parent().find('#file-item' + id).find('input').val(data.id);
                $(obj).find('.upload_title').hide();
                showInfo("√上传成功", true);
            } else {
                $(obj).find('.upload_title').hide();
                showInfo("上传失败：" + data.message);
                removeItem(id);
            }
        }
    })).bind('fileuploadadd', function (e, data) {
        data.index = new Date().getTime();
        addItem(data.index);
    }).bind('fileuploadprogress', function (e, data) {
        var $progress = $(obj).parent().find('#file-item' + data.index).find('.progress_bar')
        var text = Math.min((data.loaded / data.total) * 100, 100) + "%"
        $progress.width(text).text(text);
    });
    function addItem(id) {
        var $tar = $(obj).parent();
        if ($tar.find(".attachment_item").length > 4) {
            $.alert("最多上传5个附件！");
            return false;
        }
        var item = '<div id="file-item' + id + '" class="attachment_item" pname="attachments">'
            + '<div class="result">'
            + '<div class="file_title"></div>'
            + '<input type="hidden" name="id" value="' + id + '"/>'
            + '<div class="progress_bar"></div>'
            + '<a class="del_file"></a>'
            + '</div>'
            + '</div>';
        $tar.append(item);
    }

    function removeItem(id) {
        $(obj).parent().find('#file-item' + id).remove();
    }

    function showInfo(info, right) {
        setTimeout(function () {
            $res.html("");
            $(obj).find('.upload_title').show();
        }, 3000);
        $res.html("<span style='font-size:12px;' class='" + (right ? "success" : "error") + "'>" + info + "</span>");
    }

    function log(msg) {
        if (debug && console) {
            console.log(msg);
        }
    }
}
function fileUpload(objE, callback, url, maxFileSize) {
    var debug = false;
    var option = {};
    if (_IE <= 9) {
        $.extend(option, {contentType: "text/html,application/xhtml+xml,multipart/*,application/json; charset=utf-8"})
    }
    maxFileSize = (maxFileSize || 100);
    console.log(maxFileSize);
    $(objE).fileupload($.extend(option, {
        url: url || '/attachment?format=json',
        dataType: 'json',
        sequentialUploads: false,
        maxFileSize: maxFileSize,
        done: function (e, data) {
            var dataResult = data.result;
            if (typeof data.result === "string") {
                dataResult = eval('(' + data.result + ')');
            }
            if (dataResult.success) {
                $(e.target).parent().parent().find(".message").text(dataResult.name);
                callback(e.target, dataResult);
            } else {
                $.alert("上传失败!" + dataResult.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (413 == jqXHR.status) {
                $.alert("上传文件超出服务器限制范围!");
            }
        }
    }));
}