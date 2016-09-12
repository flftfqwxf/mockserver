// 记录侧边栏导航的收起和展开状态
var _sidebar_mini_class = 'sidebar-mini';
localStorage.__navStatus && $('html').addClass(_sidebar_mini_class);

// 全局超时处理 
$.ajaxSetup({
    complete:function(xhr){
        var responseText = xhr.responseText,
            res;

        if(this.dataType != 'script'){
            res = (typeof responseText === 'string' && /^\{/.test(responseText)) ? JSON.parse(responseText) : responseText;
            if(res && res.result && res.result.isReload){
            	$.unbindbeforeout && $.unbindbeforeout();
            	location.reload();
            }
        }
    }
});

$(function() {
	(function(){
		// 右侧可视区域(滚动容器)
		var viewport = $("#page-content-viewport");
		// 需要fixed的元素
		var toolbar = $(".scope-toolbar");
		// 滚动事件定时器
		var watcher = null;
		// 每隔多少时间处理一次滚动事件
		var polling = 0;
		// 滚动元素的位置信息
		var toolbarOffset = toolbar.position();
		toolbar.length && viewport.on("scroll", function() {
			if (watcher) {
				clearTimeout(watcher);
			}
			watcher = setTimeout(function() {
				var scrollTop = viewport.scrollTop();
				if (scrollTop + 5 >= toolbarOffset.top) {
					toolbar.addClass("secondbar-fixed");
				} else {
					toolbar.removeClass("secondbar-fixed");
				}
				watcher = null;
			}, polling);
		});
	})();

    if(localStorage.__navStatus){
        $('#nav-button').addClass('btn-info');
    }
	$('#nav-button').on('click', function(){
		$('html').toggleClass(_sidebar_mini_class);
        $(this).toggleClass('btn-info');

		localStorage.__navStatus = $('html').hasClass(_sidebar_mini_class) ? 1 : '';
	});
});