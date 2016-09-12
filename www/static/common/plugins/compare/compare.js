/*******************************************************************************
* compare.js -  product compare Script library
* Copyright (C) 2015
*
* @Author Skiny
* @Email lavenler@live.cn
* @UpdateTime (2015-11-12)
*******************************************************************************/
(function($){
	
	/*session*/
	$.session=function(key,value){
			 if(key==undefined||key==null||key=="") return null;
			 
			 var storage={};
			 if(window.name&&window.name.indexOf("{")>=0){
				 storage=$.parseJSON(window.name);
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
				 window.name=JSON.stringify(storage);
			 }
	};
	$.delSession=function(key){
			var storage={};
			if(window.name&&window.name.indexOf("{")>=0){
				storage=$.parseJSON(window.name);
			}
			if(key!=undefined) delete storage[key];
			else storage={};
			window.name=JSON.stringify(storage);
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
							'<div class="compare-btn unlogin">'+
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
		    	 return ($('.login-state').size()>0?true:false);
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
					 api.showMsg("最多允许添加三个。");
					 return false;
				 }
				 
				 //product info
				 item.attr("data-id",data.id);
				 $("a",item).attr("href",opts.productUrl+data.id);
				 $("img",item).attr("src",data.pic);
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
					 
					 //页面重载还原数据
					 var compare=$("tr[data-id="+data.id+"]").find("."+opts.addBtn);
					 compare.addClass("compare-added");
					 compare.find("i").text("-");
					 compare.find("b").text("已加入");
					 
					 $(".compare-tips",container).hide();
					 container.removeClass("empty").append(item);
					 api.btnStatus();
					 api.flying=false;
				 }
			 },
			 showPosition:function(){
				var winW=$(window).width(),
			  	    width=$this.outerWidth(true)+20,
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
				 
				 //compare data remove
				 item.prev(".compare-tips").show();
				 item.parent().addClass("empty");
				 item.remove();
				 
				 //compare btn update
				 var compare=$("tr[data-id="+id+"]").find("."+opts.addBtn);
				 compare.removeClass("compare-added").removeClass("compare-cancel");
				 compare.find("i").text("+");
				 compare.find("b").text("对比");
				 
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
				 return $(".compare-data",tpl).map(function(){return $(this).attr("data-id");}).get().join(",");
			 },
			 clear:function(){
				 $(".compare-tips",tpl).show();
				 $(".compare-data",tpl).each(function(){
					 var id=$(this).attr("data-id"),
					 	 btn=$("tr[data-id="+id+"]").find("."+opts.addBtn);
					 
					 $(this).parent().addClass("empty");
					 btn.removeClass().addClass("compare");
					 $("i",btn).text("+");
					 $("b",btn).text("对比");
					 
				 }).remove();
				 
				 $.session("compareShow",false);
				 api.delTempData();
				 api.btnStatus();
				 tpl.hide();
			 },
			 btnStatus:function(){
				 if(api.isLogin()){
					 //对比按钮按钮置灰
					 if($(".compare-data",tpl).size()<2){
						 $(".compare-btn .btn",tpl).removeClass("btn-info").addClass("disabled");
					 }
					 else{
						 $(".compare-btn .btn",tpl).removeClass("disabled").addClass("btn-info");
					 }
				 }
			 },
			 showMsg:function(msg){
				 var tpl=$('<span class="common-tips btn btn-warning" type="msg" style="visibility: hidden;z-index:999999;">'+
		            		'<i class="gm-icon gm-info-remind"></i>'+msg+
		            	'</span>');
				 if($(".common-tips[type=msg]").size()==0){
					$("body").append(tpl);
					tpl.css({"position":"fixed","top":"3px","left":"50%","margin-left":"-"+(tpl.outerWidth(true)/2)+"px"});
					tpl.css("visibility","visible");
					setTimeout(function(){tpl.fadeOut("slow",function(){tpl.remove();})},2000);
				 }
			 }
		  };
		  
		  
		  //append dom
		  $(window).resize(function(){
			  api.showPosition();
		  }).resize();
		  if(api.isLogin()==true) $(".compare-btn",tpl).removeClass("unlogin");
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
				  var temp=$(".price em","tr[data-id="+v.id+"]");
				  v.price=(temp.size()>0?temp.text():v.price);
				  api.add(v);
			  }
		  });
		  
		  //event
		  $("."+opts.addBtn).click(function(event){
			  var id=$(this).parents("tr").attr("data-id");
			  if(!$(this).hasClass("compare-disabled")){
				  	
				    var list=tpl;
 
				    //显示及打开对比栏
				    tpl.show();
				    $(".compare-control-close",tpl).click();
				    
					if(!$(this).hasClass("compare-cancel")){

						//加入对比
						if($(this).find("b").text()=="已加入") return false;

						var tr=$(this).parents("tr"),
							data={},
							img=$(".pic img",$(this).parents("tr"));
						
						data.pic=img.attr("src");
						data.id=tr.attr("data-id");
						data.title=$(".info h1",tr).text();
						data.startPlace=$(".info h2 .dark-greens",tr).text();
						data.price=$(".price p em",tr).text();
						
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
		  }).hover(function(){
				if($(this).hasClass("compare-added")){
					$(this).addClass("compare-cancel");
					$(this).find("b").text("取消");
				}
		  },function(){
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
			  $("[name=productsId]",form).val(api.getIds());
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
})(jQuery);