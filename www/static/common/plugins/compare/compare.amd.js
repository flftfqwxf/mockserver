/*******************************************************************************
* compare.js -  product compare Script library
* Copyright (C) 2015
*
* @Author Skiny
* @Email lavenler@live.cn
* @UpdateTime (2015-11-12)
*******************************************************************************/
define(["jquery","flyer"],function(){
	
	(function (factory) {
		if (typeof define === 'function' && define.amd) {
			// AMD
			define(['jquery'], factory);
		} else if (typeof exports === 'object') {
			// CommonJS
			factory(require('jquery'));
		} else {
			// Browser globals
			factory(jQuery);
		}
	}(function ($) {

		var pluses = /\+/g;

		function encode(s) {
			return config.raw ? s : encodeURIComponent(s);
		}

		function decode(s) {
			return config.raw ? s : decodeURIComponent(s);
		}

		function stringifyCookieValue(value) {
			return encode(config.json ? JSON.stringify(value) : String(value));
		}

		function parseCookieValue(s) {
			if (s.indexOf('"') === 0) {
				// This is a quoted cookie as according to RFC2068, unescape...
				s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
			}

			try {
				// Replace server-side written pluses with spaces.
				// If we can't decode the cookie, ignore it, it's unusable.
				// If we can't parse the cookie, ignore it, it's unusable.
				s = decodeURIComponent(s.replace(pluses, ' '));
				return config.json ? JSON.parse(s) : s;
			} catch(e) {}
		}

		function read(s, converter) {
			var value = config.raw ? s : parseCookieValue(s);
			return $.isFunction(converter) ? converter(value) : value;
		}

		var config = $.cookie = function (key, value, options) {

			// Write

			if (value !== undefined && !$.isFunction(value)) {
				options = $.extend({}, config.defaults, options);

				if (typeof options.expires === 'number') {
					var days = options.expires, t = options.expires = new Date();
					t.setTime(+t + days * 864e+5);
				}

				return (document.cookie = [
					encode(key), '=', stringifyCookieValue(value),
					options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					options.path    ? '; path=' + options.path : '',
					options.domain  ? '; domain=' + options.domain : '',
					options.secure  ? '; secure' : ''
				].join(''));
			}

			// Read

			var result = key ? undefined : {};

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			var cookies = document.cookie ? document.cookie.split('; ') : [];

			for (var i = 0, l = cookies.length; i < l; i++) {
				var parts = cookies[i].split('=');
				var name = decode(parts.shift());
				var cookie = parts.join('=');

				if (key && key === name) {
					// If second argument (value) is a function it's a converter...
					result = read(cookie, value);
					break;
				}

				// Prevent storing a cookie that we couldn't decode.
				if (!key && (cookie = read(cookie)) !== undefined) {
					result[name] = cookie;
				}
			}

			return result;
		};

		config.defaults = {};

		$.removeCookie = function (key, options) {
			if ($.cookie(key) === undefined) {
				return false;
			}

			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return !$.cookie(key);
		};

	}));

	/*session*/
	$.session=function(key,value){
			 if(key==undefined||key==null||key=="") return null;
			 
			 var storage={};
			 if($.cookie("compare")){
				 storage=$.parseJSON($.cookie("compare"));
			 }
			 
			 if(value==undefined){
				 var result=storage[key];
				 if(result!=undefined&&typeof result=="string"&&((result.indexOf("{")>=0&&result.indexOf(":")>0)||(result.indexOf("[")>=0))){
					try{
						result=$.parseJSON(result);
					}
					catch(ex){
					}
				 }
				 return (result==undefined)?null:result;
			 }
			 else {
				 storage[key]=((typeof value=="object")?JSON.stringify(value):value);
				 $.cookie("compare",JSON.stringify(storage),{path: "/"});
			 }
	};
	$.delSession=function(key){
			var storage={};
			if($.cookie("compare")){
				storage=$.parseJSON($.cookie("compare"));
			}
			if(key!=undefined) delete storage[key];
			else storage={};
			$.cookie("compare",JSON.stringify(storage));
	};
	
	/*compare*/
	$.fn.compare= function(options) {    
		  var defaults = {  
				  addBtn:"compare",
				  direction:"center",
				  actionUrl:"",
				  postDataName:"",
				  productUrl:"",
				  productTpl:'<div class="compare-data clearfix">'+
					  			'<div class="pic"><a href="" target="_blank"><img src=""/></a></div>'+
					  			'<div class="info">'+
					  				'<h3><a href="" target="_blank"></a></h3>'+
					  				'<p>成都出发</p>'+
					  				'<span class="compare-price">￥<strong>78999</strong>起</span>'+
					  				'<span class="compare-del"><i class="fa fa-trash"></i></span>'+
					  			'</div>'+
					  		  '</div>',
				  tpl:'<div class="compare-toolbar">'+
				  		'<div class="compare-list">'+
							'<ul class="clearfix">'+
								'<li class="empty">'+
									'<div class="compare-tips"><span><i class="num">1</i>您还可以继续添加</span></div>'+
								'</li>'+
								'<li class="empty">'+
									'<div class="compare-tips"><span><i class="num">2</i>您还可以继续添加</span></div>'+
								'</li>'+
								'<li class="empty">'+
									'<div class="compare-tips"><span><i class="num">3</i>您还可以继续添加</span></div>'+
								'</li>'+
							'</ul>'+
							'<div class="compare-action-btn unlogin">'+
								'<p>请先<a href="/login">登录</a></p>'+
								'<button class="btn disabled" action="submit">开始对比</button>'+
								'<div><a action="clear" style="cursor:pointer;">清空对比栏</a></div>'+
							'</div>'+
						'</div>'+
						'<span class="compare-control"><b>隐藏对比栏</b><i class="gm-icon gm-next"></i></span>'+
					'</div>'
				   
		  };    
		  var opts = $.extend(defaults, options);
		  
		  var $this=$(this),
			  tpl=$(opts.tpl);

		  var api={
		     flying:false,
		     addTempData:function(data){
		    	 var compareTemp=$.session("compare");
				 compareTemp=compareTemp||[];
				 compareTemp.push(data);
				 $.session("compare",compareTemp);
		     },
		     isLogin:function(){
		    	 if($("#J-distributor-pc").size()>0){
		    		 return ($(".login_hover").size()>0?true:false);
		    	 }
		    	 else {
		    		 return ($('.login-state').size()>0?true:false);
		    	 }
		     },
		     delTempData:function(id){
		    	 var compareTemp=$.session("compare");
				 compareTemp=compareTemp||[];
				 if(id){
					for(var i=0;i<compareTemp.length;i++){
						if(compareTemp[i]&&compareTemp[i].id==id){
							compareTemp[i]=null;
							break;
						}
					}
				 }
				 else{
					 compareTemp=[];
				 }
				 $.session("compare",compareTemp);
		     },
			 add:function(data,event){
				 var flyer = $('<img class="u-flyer" src="'+data.pic+'"/>'),
				 	 container=$(".empty:first()",tpl),
				 	 item=$(opts.productTpl),
				 	 offset=container.offset();
				 
				 if(api.flying==true) return false;
				 
				 //添加满了
				 if(container.size()==0){
					 $.showMsg("最多允许添加三个。");
					 return false;
				 }
				 
				 //product info
				 item.attr("data-id",data.id);
				 $("a",item).attr("href",opts.productUrl+data.id);
				 var imgSrc=data.pic;
				 imgSrc=imgSrc.replace("240w","150w").replace("180h","114h").replace("470w","150w").replace("354h","114h");
				 if(imgSrc.indexOf("@")<0){
				     imgSrc+="@150w_114h_1e_1c";
				 }
				 $("img",item).attr("src",imgSrc);
				 $(".info h3 a",item).text(data.title);
				 $(".info p",item).text(data.startPlace);
				 $(".info strong",item).text(data.price);
 
				 //img fly
				 if(event){
					 api.addTempData(data);
					 api.flying=true;
					 flyer.fly({
							start: {
								left: event.pageX,
								top: event.pageY-$(window).scrollTop()
							},
							end: {
								left:offset.left+30,
								top: offset.top-$(window).scrollTop(),
								width: 0,
								height: 0
							},
							onEnd: function(){
								$(".compare-tips",container).hide();
								container.removeClass("empty").append(item);
								this.destory();
								api.btnStatus();
								api.flying=false;
							}
					 });
				 }
				 else{
					
					 if(opts.cancelText&&opts.addText){
						 //详细页面，重载还原数据
						 ($("#J-p-info").attr("data-id")==data.id+"")&&$("."+opts.addBtn).text(opts.cancelText);
					 }
					 
					 $(".compare-tips",container).hide();
					 container.removeClass("empty").append(item);
					 api.btnStatus();
					 api.flying=false;
				 }
			 },
			 showPosition:function(){
				var winW=$(window).width(),
			  	    width=($this.outerWidth(true)>1180?1180:$this.outerWidth(true))+20,
				    left=$this.offset().left-20;
				if(opts.direction=="center"){
					  tpl.attr("w",width).css({"right":(left)+"px","width":width+"px"});
				}
				else{
					  tpl.attr("w",width).css({"right":(winW-(left+width-20))+"px","width":width+"px"});
				}
			 },
			 del:function(id){
				 var item=$("[data-id="+id+"]",tpl),
				 	 index=item.parent().index();
				 
				 if(api.flying) return false;
				 
				 //compare data remove
				 item.prev(".compare-tips").show();
				 item.parent().addClass("empty");
				 item.remove();
				 
				 //compare btn update
				 if(opts.cancelText&&opts.addText&&$("#J-p-info").attr("data-id")==id){
					 //主站产品详细，单个
					 var btn=$("."+opts.addBtn);
					 btn.text(opts.addText);
				 }
				 else{
					 //其他列表
					 if(opts.mode=="list"){
						 var compare=$("li[data-id="+id+"]").find("."+opts.addBtn);
						 compare.text(opts.addText);
					 }
					 else{
						 //兼容主站列表
						 var compare=$("tr[data-id="+id+"]").find("."+opts.addBtn);
						 compare.removeClass("compare-added").removeClass("compare-cancel");
						 compare.find("i").text("+");
						 compare.find("b").text("对比");
					 }
					 
				 }
				 
				 //update compare data list
				 api.updateList(index);
				 api.delTempData(id);
				 
				 //update submit btn status
				 api.btnStatus();
				
			 },
			 updateList:function(index){
				 var lis=$("li",tpl),
				 	 length=lis.size();
				 
				 for(var i=index;i<length-1;i++){
					 var prev=lis.eq(i),
					 	 next=lis.eq(i+1),
					 	 data=$(".compare-data",next);
					 
					 if(data.size()>0){
						 prev.removeClass("empty");
						 $(".compare-tips",prev).hide();
						 prev.append(data);
						 
						 next.addClass("empty")
						 $(".compare-tips",next).show();
						 $(".compare-data",next).remove();
					 }
				 }
			 },
			 getIds:function(){
				 var compare=$.session("compare")||[];
				 return $(compare).map(function(i,v){if(v) return v.id}).get().join(",");
			 },
			 clear:function(){
				 $(".compare-tips",tpl).show();
				 if(opts.cancelText&&opts.addText){
					 $(".compare-list li",tpl).addClass("empty");
					 $(".compare-data",tpl).remove();
					 $("."+opts.addBtn).text(opts.addText);
				 }
				 else{
					 $(".compare-data",tpl).each(function(){
						 var id=$(this).attr("data-id"),
						 	 btn=$("tr[data-id="+id+"]").find("."+opts.addBtn);
						 
						 $(this).parent().addClass("empty");
						 btn.removeClass().addClass("compare");
						 $("i",btn).text("+");
						 $("b",btn).text("对比");
						 
					 }).remove();
				 }
				 
				 $.session("compareShow",false);
				 api.delTempData();
				 api.btnStatus();
				 tpl.hide();
			 },
			 btnStatus:function(){
				 if(api.isLogin()){
					 //对比按钮按钮置灰
					 if($(".compare-data",tpl).size()<2){
						 $(".compare-action-btn .btn",tpl).removeClass("btn-info").addClass("disabled");
					 }
					 else{
						 $(".compare-action-btn .btn",tpl).removeClass("disabled").addClass("btn-info");
					 }
				 }
			 }
		  };
		  
		  
		  //append dom
		  $(window).resize(function(){
			  api.showPosition();
		  }).resize();
		  if(api.isLogin()==true) $(".compare-action-btn",tpl).removeClass("unlogin");
		  //event
		  if(!api.isLogin()){
			  //$("."+opts.addBtn).attr("data-placement","bottom").attr("data-toggle","tooltip").attr("data-original-title","登录后使用");
			  $.delSession("compare");
			  $.delSession("compareShow");
		  }
		  else {
			  $("body").append(tpl);
			  //compare init
			  var compareDataTemp=$.session("compare"),
			  	  compareShow=$.session("compareShow"),
			  	  start=0;
			
			  $(compareDataTemp).each(function(i,v){
				  if(v){
					  if(start==0){
						  
						  tpl.show();
						  if(compareShow!=true){
							  $(".compare-control",tpl).addClass("compare-control-close").find("b").text("显示对比栏");
							  tpl.addClass("compare-toolbar-closed");
						  }
						  start++;
					  }
					  var temp=$(".price em","tr[data-id="+v.id+"]"),
					  	  temp2=$("#J-p-info").attr("data-price");
					  
					  v.price=(temp.size()>0?temp.text():v.price);
					  
					  if($("#J-p-info").attr("data-id")==v.id+""){
					  	v.price=(temp2?temp2:v.price);
					  }
					  api.add(v);
				  }
				  
			  });
		  }
		  
		  $.session("compare",compareDataTemp);
		  
		  $(document).on("click","."+opts.addBtn,function(event){
			  
			  if(!api.isLogin()){
				  if($("#J-qq-login").size()==0){
					  window.location.href=$("a.login").attr("href");
				  }
				  return false;
			  }
			  if($(this).hasClass("disabled")) return false;
			  
			  var list=tpl,
			  	  data={},
			  	  _this=$(this);
			  if(opts.cancelText&&opts.addText){
				  //产品详细，分销商，供应商列表
				  if(typeof opts.getData=="function"){
					 data=opts.getData($(this));
				  }

				  if($(this).text()==opts.addText){
					  //add
					  tpl.show();
					  $(".compare-control-close",tpl).click();
					  if(api.add(data,event)!=false){
						 _this.text(opts.cancelText);
					  }
				  }
				  else if($(this).text()==opts.cancelText){
					  //cancel
					  api.del(data.id);
				  }
			  }
			  else{
				  
				  //兼容主站版本
			  	  var id=$(this).parents("tr").attr("data-id");
				  if(!$(this).hasClass("compare-disabled")){

					    //显示及打开对比栏
					    tpl.show();
					    $(".compare-control-close",tpl).click();
					    
						if(!$(this).hasClass("compare-cancel")){
	
								//加入对比
								var data={};
								if($(this).find("b").text()=="已加入") return false;
								
								if(typeof opts.getData=="function"){
									data=opts.getData();
								}
								else{
									var tr=$(this).parents("tr"),
										img=$(".pic img",$(this).parents("tr"));
									
									data.pic=img.attr("src");
									data.id=tr.attr("data-id");
									data.title=$(".info h1",tr).text();
									data.startPlace=$(".info h2 .dark-greens",tr).text();
									data.price=$(".price p em",tr).text();
								}
								
								if(api.add(data,event)!=false){
									$(this).addClass("compare-added");
									$(this).find("i").text("-");
									$(this).find("b").text("已加入");
								}
						}
						else{
							//取消
							api.del(id);
						}
				  }
			  }
		  }).on("mouseenter","."+opts.addBtn,function(){
		  		if($(this).hasClass("compare-added")){
					$(this).addClass("compare-cancel");
					$(this).find("b").text("取消");
				}
		  }).on("mouseleave","."+opts.addBtn,function(){
		  		if($(this).hasClass("compare-added")){
					$(this).removeClass("compare-cancel");
					$(this).find("b").text("已加入");
				}
		  });
		  
		  //对比栏内部操作事件
		  tpl.on("click","[action=clear]",function(){
			  api.clear();
		  }).on("click","[action=submit]",function(){
			  if($(this).hasClass("disabled")) return false;
			  
			  var form=$("<form method=\"get\" target=\"_blank\" style=\"display:none;\"><input type=\"hidden\" name=\""+opts.postDataName+"\"/></form>");
			  $("[name="+opts.postDataName+"]",form).val(api.getIds());
			  $("body").append(form);
			  form.attr("action",opts.actionUrl);
			  form.submit();
			  form.remove();
			  
		  }).on("click",".compare-control",function(){
			  var toolbar=$(this).parents(".compare-toolbar");
			  if($(this).hasClass("compare-control-close")){
				  $(this).removeClass("compare-control-close").find("b").text("隐藏对比栏");
				  toolbar.removeClass("compare-toolbar-closed");
				  $.session("compareShow",true);
			  }
			  else{
				  $(this).addClass("compare-control-close").find("b").text("显示对比栏");
				  toolbar.addClass("compare-toolbar-closed");
				  $.session("compareShow",false);
			  }
		  }).on("click",".compare-del",function(){
			  var id=$(this).parents(".compare-data").attr("data-id");
			  api.del(id);
		  });
	};
});
