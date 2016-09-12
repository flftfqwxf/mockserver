KindEditor.plugin('diyupload', function(K) {  
	var editor = this, name = 'diyupload';
	editor.plugin.diyuploads = function(){
		var editorToolbar = editor.toolbar.div.get();
		var $btn = $(editorToolbar).find("span[data-name='"+name+"']");
		if($btn.attr("galleryInited") == "true")
			return ;
		var btnDivIframe = editor.edit.iframe.get();
		var callback = function(res){
			if(editor.html() == editor.options.placeholder){
				editor.html("");
			}
			for(var i = 0; i < res.length; i++){
				title = res[i].name ? res[i].name : '';
				border = 0;
				var html = '<img src="' + res[i].url + "@500w" + '" attr_src="' + res[i].url + '" data-ke-src="' + res[i].url + '" ';
				html += 'width="500px" ';
				if (title) {
					html += 'title="' + title + '" ';
				}
				html += 'alt="' + title + '" ';
				html += '/>';
				editor.exec('inserthtml', html);
			}
		};
		/**edit by zlm**/
		var thisGallery = $btn.attr("galleryInited", "true").gmgallery({touristLineId:editor.options.touristLineId,touristLineObj:(editor.options.touristLineObj ? editor.options.touristLineObj : null),operateType:"other_image",options_id:new Date().getTime(),onOk:callback,zIndex:'900999'});
		$btn.click();
	}
	// 点击图标时执行
	editor.clickToolbar(name, function() {
		editor.plugin.diyuploads();
	});
});
KindEditor.lang({
	diyupload : '自定义图片上传'
});
KindEditor.plugin('recentlyuse', function(K) {  
	var editor = this, name = 'recentlyuse';
	var dialog;
	editor.plugin.recentlyuse_query_click = function(){
		var uri = null != editor.options.recentlyuseUrl?editor.options.recentlyuseUrl:"";
		if(null != uri && "" != uri){
			if(editor.options.recentlyuseUrl.indexOf("?") >0){
				uri = editor.options.recentlyuseUrl + "&keyword=" + escape($("#typing_keyword").val());
			}else{
				uri = editor.options.recentlyuseUrl+"?keyword=" + escape($("#typing_keyword").val());
			}
			$.ajax({
				url: uri+"&_="+Date.parse(new Date()),
				type:"GET",
				dataType: "html",
				success:function(objData){
					if(objData){
						editor.plugin.recentlyuseSetDefValue(objData);
						dialog.content(objData);
						$("#typing_query").on("click", editor.plugin.recentlyuse_query_click);
					}else{
						dialog.content("<div style='padding:20px 0;text-align:center;' >暂无信息</div>");
					}
				}
			});
		}
	}
	editor.plugin.recentlyuseSetDefValue = function(objData){
		var btnDivIframe = editor.edit.iframe.get();
		var btnDiv = $(btnDivIframe).parent().parent().find(".recentlyuse_def_body");
		if(!btnDiv || null == btnDiv || "" == btnDiv || "undefined" == btnDiv || btnDiv.length <= 0 || btnDiv.html() == ""){
			btnDiv = $("<div class='recentlyuse_def_body' style='display:none;'></div>");
			$(btnDivIframe).parent().parent().append(btnDiv);
		}
		if(editor.html() == editor.options.placeholder){
			editor.html("");
		}
		btnDiv.html(objData);
	}
	editor.clickToolbar(name, function() {
		var uri = null != editor.options.recentlyuseUrl?editor.options.recentlyuseUrl:"";
		if(null != uri && "" != uri){
			// 点击图标时执行  
			dialog = $.artDialog({
				title: '最近使用',
		        width: 680,height: 400,padding: "0px",zIndex: '900999',
		        isOuterBoxShadow: false, isClose: false, lock: true, fixed: true,
		        content: '正在加载，请稍候。。。',
		        ok: function () {
		        	var text = "";
		            $("input[name='typing_set']:checked").each(function(){
		            	text += $(this).parent().parent().find(".check_info").html();
		            });
		            editor.insertHtml(text);
		        },
		        okVal: '确认',
		        okCssClass: 'btn-process',
		        cancel: function () {},
		        cancelVal: '取消',
		        cancelCssClass: ''
			});
			var btnDivIframe = editor.edit.iframe.get();
			var defData = $(btnDivIframe).parent().parent().find(".recentlyuse_def_body").html();
			if(null != defData && "" != defData){
				dialog.content(defData);
				$("#typing_query").on("click", function(){
					editor.plugin.recentlyuse_query_click();
				});
			}else{
				if(editor.options.recentlyuseUrl.indexOf("?") >0){
					uri = editor.options.recentlyuseUrl + "&_=" + Date.parse(new Date());
				}else{
					uri = editor.options.recentlyuseUrl + "?_=" + Date.parse(new Date());
				}
				$.ajax({
					url: uri,
					type:"GET",
					dataType: "html",
					success:function(objData){
						try {
							var json = eval("(" + objData + ")");
							dialog.close();
							$.gmMessage("请重新登录", false);
							return false;
						} catch(e) {
						}
						if(objData){
							editor.plugin.recentlyuseSetDefValue(objData);
							dialog.content(objData);
							$("#typing_query").on("click", function(){
								editor.plugin.recentlyuse_query_click();
							});
						}else{
							dialog.content("<div style='padding:20px 0;text-align:center;' >暂无信息</div>");
						}
					},
					error: function(){
						dialog.close();
						$.alert("加载最近使用失败！请刷新重试", "提示", "warning", function(){ });
					}
				});
			}
		}
	});
});
KindEditor.lang({
	recentlyuse : '最近使用'
});
KindEditor.plugin('cleartexts', function(K) {
	var editor = this, name = 'cleartexts';
	editor.clickToolbar(name, function() {
		editor.html("");
	});
});
KindEditor.lang({
	cleartexts : '清除文档'
});