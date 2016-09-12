;( function( $, window, undefined ) {
	'use strict';
	// global
	var $window = $( window ),
		Modernizr = window.Modernizr;

	$.GmAjaxGet = function( options ) {
		this._init( options );
	};
	
	$.GmAjaxGet.defaults = {
		url : '/product/list.json',
		listObj : $("#plan-content"),
		ul : $("#loading"),
		loading : $("#loading"),
		noMore : $("#noMore"),
		noResult : $("#noResult"),
		total : $("#total"),
		// 初始化列表，使用默认排序
		params : {
			size : 20,
			page : 1
		},
		initLodding : true,
		template : 'tmp_list_tpl',
		ajaxCall : function(){},
		scrollTimer : null,
		moreGet : true
	};
	$.GmAjaxGet.prototype = {
		_init : function( options ) {
			this.options = $.extend( true, {}, $.GmAjaxGet.defaults, options );
			this._validate();
			this.options.initLodding && this.loadData();
			var self = this;
			$(window).on("scroll", function(){
				self.onScroll(self, self.options);
			});
		},
		_validate : function( options ) {
			if('' == this.options.url || null == this.options.url){
				this.options.url = '/product/list.json';
			}
			if('' == this.options.listObj || null == this.options.listObj){
				this.options.listObj = $("#plan-content");
			}
			if('' == this.options.ul || null == this.options.ul){
				this.options.ul = $("#loading");
			}
			if('' == this.options.loading || null == this.options.loading){
				this.options.loading = $("#loading");
			}
			if('' == this.options.noMore || null == this.options.noMore){
				this.options.noMore = $("#noMore");
			}
			if('' == this.options.noResult || null == this.options.noResult){
				this.options.noResult = $("#noResult");
			}
			if('' == this.options.lineSelet || null == this.options.lineSelet){
				this.options.lineSelet = $("#lineSelet");
			}
			if(this.options.params.page <= 0 || null == this.options.params.page){
				this.options.params.page = 1;
			}
			if(this.options.params.size <= 0 || null == this.options.params.size){
				this.options.params.size = 20;
			}
		},
		loadData : function(){
			var options = this.options;
			if(options.loading.hasClass("loading")) {
				return false;
			}
			if (options.moreGet) {
				options.loading.text("");
				options.loading.removeClass();
				options.noResult.add(options.noMore).hide();
				options.loading.addClass("loading").show();
				$.ajax({
					type : "GET",
					url  : options.url,
					data : options.params,
					dataType : 'json',
					error : function(request) {
						options.ul.add(options.loading).add(options.noMore).hide();
						options.noResult.css({"display":"inline-block"});
			        },
					success : function(data){
						options.loading.removeClass("loading");
						options.total && null != options.total && options.total.text('共' + data.pagination.count + '条计划');
						if(data.pagination.pageCount <= options.params["page"]) {
							options.loading.hide();
							if(options.params["page"] == 1 && data.tourPlanList == '') {
								options.noResult.css({"display":"inline-block"});
							} else {
								options.noMore.css({"display":"inline-block"});
							}
							options.moreGet = false;
						}
						typeof options.ajaxCall === 'function' && options.ajaxCall(data);
					}
				});
			}
		},
		onScroll : function(self, options) {
			null != options.scrollTimer && clearTimeout(options.scrollTimer);
			if(options.loading.is(":visible")){
				options.scrollTimer = setTimeout(function() {
					var bottom = options.loading.offset().top;
					var scrollTop = $(window).scrollTop();
					var windowHeight = $(window).height();
					if (scrollTop >= bottom - windowHeight) {
						if(options.params["page"] < 4) {
							self.options.params.page = options.params["page"] +1;
							self.loadData();
						} else {
							options.loading.show().addClass("load-more");
							options.loading.text("点击加载更多");
						}
					}
				},400);
			}
		}
//		,
//		setParam : function(params){
//			var options = this.options;
//			this.options.params = $.extend( true, {}, options.params, params );
//		}
	};
})(jQuery,window);