(function(){
	var tpl = '<div class="browser">'+
			'<span class="browser_desc"><i class="browser_info"></i>您的浏览器版本过低，访问港马时可能会出现功能异常，建议升级浏览器以确保正常使用</span>'+
			'<span class="downBrowser">'+
				'<a href="http://se.360.cn/"  class="browser_btn"><img src="'+ WEB_STATIC +'/common/plugins/browser/images/2.png"></a>'+
				'<a href="http://www.google.cn/chrome/browser/desktop/index.html"  class="browser_btn"><img src="'+ WEB_STATIC +'/common/plugins/browser/images/1.png"></a>'+
				'<a href="http://ie.sogou.com/" class="browser_btn"><img src="'+ WEB_STATIC +'/common/plugins/browser/images/3.png"></a>'+
			'</span>'+
		'</div>';
	if(((!window.FormData))&&(navigator.appVersion.toUpperCase().indexOf("MSIE 9.0")<0)){
	    $('body').prepend(tpl);
	}
})();
