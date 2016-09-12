(function($){$.browserTest=function(a,z){var u='unknown',x='X',m=function(r,h){for(var i=0;i<h.length;i=i+1){r=r.replace(h[i][0],h[i][1]);}return r;},c=function(i,a,b,c){var r={name:m((a.exec(i)||[u,u])[1],b)};r[r.name]=true;r.version=(c.exec(i)||[x,x,x,x])[3];if(r.name.match(/safari/)&&r.version>400){r.version='2.0';}if(r.name==='presto'){r.version=($.browser.version>9.27)?'futhark':'linear_b';}r.versionNumber=parseFloat(r.version,10)||0;r.versionX=(r.version!==x)?(r.version+'').substr(0,1):x;r.className=r.name+r.versionX;return r;};a=(a.match(/Opera|Navigator|Minefield|KHTML|Chrome/)?m(a,[[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/,''],['Chrome Safari','Chrome'],['KHTML','Konqueror'],['Minefield','Firefox'],['Navigator','Netscape']]):a).toLowerCase();$.browser=$.extend((!z)?$.browser:{},c(a,/(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/,[],/(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));$.layout=c(a,/(gecko|konqueror|msie|opera|webkit)/,[['konqueror','khtml'],['msie','trident'],['opera','presto']],/(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);$.os={name:(/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase())||[u])[0].replace('sunos','solaris')};if(!z){$('html').addClass([$.os.name,$.browser.name,$.browser.className,$.layout.name,$.layout.className].join(' '));}};$.browserTest(navigator.userAgent);})(jQuery);

// 此处不能放在$().ready()里面，由于低版本浏览器（IE7）js会报错导致放进去的话不会执行
(function(){
	var tpl = '<div class="browser">'+
			'<span class="browser_desc"><i class="browser_info"></i>您的浏览器版本过低，访问港马时可能会出现功能异常，建议升级浏览器以确保正常使用</span>'+
			'<span class="downBrowser">'+
				'<a href="http://se.360.cn/"  class="browser_btn"><img src="'+ WEB_STATIC +'/common/plugins/browser/images/2.png"></a>'+
				'<a href="http://www.google.cn/chrome/browser/desktop/index.html"  class="browser_btn"><img src="'+ WEB_STATIC +'/common/plugins/browser/images/1.png"></a>'+
				'<a href="http://ie.sogou.com/" class="browser_btn"><img src="'+ WEB_STATIC +'/common/plugins/browser/images/3.png"></a>'+
			'</span>'+
		'</div>';
	var name = $.browser.name;
	var vsNumber = $.browser.versionNumber;

	if(name == 'msie' && vsNumber < 9 || 
		( name == 'firefox' && vsNumber < 5 ) || 
		( name == 'safari' && vsNumber < 6 )){

		$('body').prepend(tpl);
	}
})();