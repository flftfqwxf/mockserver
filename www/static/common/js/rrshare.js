var Renren = Renren || {};
if(!Renren.share){
Renren.share = function() {
    var isIE = navigator.userAgent.match(/(msie) ([\w.]+)/i);
    var hl = location.href.indexOf('#');
    var resUrl = (hl == -1 ? location.href : location.href.substr(0, hl));
    var shareImgs = "";
	var sl = function(str) {
		var placeholder = new Array(23).join('x');
		str = str
				.replace(
						/(https?|ftp|gopher|telnet|prospero|wais|nntp){1}:\/\/\w*[\u4E00-\u9FA5]*((?![\"| |\t|\r|\n]).)+/ig,
						function(match) {
							return placeholder + match.substr(171);
						}).replace(/[^\u0000-\u00ff]/g, "xx");
		return Math.ceil(str.length / 2);
	};
	var cssImport = function(){
	    var static_url = 'http://xnimg.cn/xnapp/share/css/v2/rrshare.css';
		var b = document.createElement("link");
        b.rel = "stylesheet";
        b.type = "text/css";
        b.href = static_url;
        (document.getElementsByTagName("head")[0] || document.body).appendChild(b)
	};
    var getShareType = function (dom) {
        return dom.getAttribute("type") || "button"
    };
    var opts = {};
    if(typeof(imgMinWidth)!='undefined'){
    	opts.imgMinWidth = imgMinWidth || 60;
    } else {
    	opts.imgMinWidth = 60;
    }
    if(typeof(imgMinHeight)!='undefined'){
    	opts.imgMinHeight = imgMinHeight || 60;
    } else {
    	opts.imgMinHeight = 60;
    }
	var renderShareButton = function (btn,index) {
		if(btn.rendered){
			return;
		}
		btn.paramIndex = index;
        var shareType = getShareType(btn).split("_");
        var showType = shareType[0] == "icon" ? "icon" : "button";
        var size = shareType[1] || "small";
        var shs = "xn_share_"+showType+"_"+size;
        var innerHtml = [
                         '<span class="xn_share_wrapper ',shs,'"></span>'
                         ];
	    btn.innerHTML = innerHtml.join("");
	    btn.rendered = true;
	};
	var postTarget = function(opts) {
		var form = document.createElement('form');
		form.action = opts.url;
		form.target = opts.target;
		form.method = 'POST';
		form.acceptCharset = "UTF-8";
		for (var key in opts.params) {
			var val = opts.params[key];
			if (val !== null && val !== undefined) {
				var input = document.createElement('textarea');
				input.name = key;
				input.value = val;
				form.appendChild(input);
			}
		}
		var hidR = document.getElementById('renren-root-hidden');
		if (!hidR) {
			hidR = document.createElement('div'), syl = hidR.style;
			syl.positon = 'absolute';
			syl.top = '-10000px';
			syl.width = syl.height = '0px';
			hidR.id = 'renren-root-hidden';
			(document.body || document.getElementsByTagName('body')[0])
					.appendChild(hidR);
		}
		hidR.appendChild(form);
		try {
			var cst = null;
			if (isIE && document.charset.toUpperCase() != 'UTF-8') {
				cst = document.charset;
				document.charset = 'UTF-8';
			}
			form.submit();
		} finally {
			form.parentNode.removeChild(form);
			if (cst) {
				document.charset = cst;
			}
		}
	};
	var getCharSet = function(){
		if(document.charset){
			return document.charset.toUpperCase();
		} else {
			var metas = document.getElementsByTagName("meta");
			for(var i=0;i < metas.length;i++){
				var meta = metas[i];
				var metaCharset = meta.getAttribute('charset');
				if(metaCharset){
					return meta.getAttribute('charset');
				}
				var metaContent = meta.getAttribute('content');
				if(metaContent){
					var contenxt = metaContent.toLowerCase();
					var begin = contenxt.indexOf("charset=");
					if(begin!=-1){
						var end = contenxt.indexOf(";",begin+"charset=".length);
						if(end != -1){
							return contenxt.substring(begin+"charset=".length,end);
						}
						return contenxt.substring(begin+"charset=".length);
					}
				}
			}
		}
		return '';
	}
	var charset = getCharSet();
    var getParam = function (param){
    	param = param || {};
		param.api_key = param.api_key || '';
    	param.resourceUrl = param.resourceUrl || resUrl;
    	param.title = param.title || '';
    	param.pic = param.pic || '';
    	param.description = param.description || ''; 
    	if(resUrl == param.resourceUrl){
    		param.images = param.images || shareImgs;//涓€鑸氨鏄綋鍓嶉〉闈㈢殑鍒嗕韩,鍥犳鍙栧綋鍓嶉〉闈㈢殑img
    	}
    	param.charset = param.charset || charset || '';
    	return param;
    }
	var onclick = function(data) {
		var submitUrl = 'http://widget.renren.com/dialog/share';
		var p = getParam(data);
		var prm = [];
		for (var i in p) {
			if (p[i])
				prm.push(i + '=' + encodeURIComponent(p[i]));
		}
		var url = submitUrl+"?" + prm.join('&'), maxLgh = (isIE
				? 2048
				: 4100), wa = 'width=700,height=650,left=0,top=0,resizable=yes,scrollbars=1';
		if (url.length > maxLgh) {
			window.open('about:blank', 'fwd', wa);
			postTarget({
				url : submitUrl,
				target : 'fwd',
				params : p
			});
		} else {
			window.open(url, 'fwd', wa);
		}
		return false;
	};
	window["rrShareOnclick"] = onclick;
	var init = function() {
		if (Renren.share.isReady || document.readyState !== 'complete')
			return;
		var imgs = document.getElementsByTagName('img'), imga = [];
		for (var i = 0; i < imgs.length; i++) {
			if (imgs[i].width >= opts.imgMinWidth
					&& imgs[i].height >= opts.imgMinHeight) {
				imga.push(imgs[i].src);
			}
		}
		window["rrShareImgs"] = imga;
		if (imga.length > 0)
			shareImgs = imga.join('|');
		if (document.addEventListener) {
			document.removeEventListener('DOMContentLoaded', init, false);
		} else {
			document.detachEvent('onreadystatechange', init);
		}
		cssImport();
		var shareBtn = document.getElementsByName("xn_share");
		var len = shareBtn?shareBtn.length:0;
        for (var b = 0; b < len; b++) {
            var a = shareBtn[b];
            renderShareButton(a,b);
        }
		Renren.share.isReady = true;
	};
	if (document.readyState === 'complete') {
		init();
	} else if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', init, false);
		window.addEventListener('load', init, false);
	} else {
		document.attachEvent('onreadystatechange', init);
		window.attachEvent('onload', init);
	}
};
Renren.share();
}