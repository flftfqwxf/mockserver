/*
 * gmgallery.js - 图片库选择 - 0.2
 * author : wfq 2015-10-13
 * usage : $(".showgallery").gmgallery({});
 */
(function($) {
	$.fn.gmgallery = function(options) {
		var settings = $.extend({}, {
			url : "http://www.gmmtour.com/gallery/search.json", // 搜搜url
			tagUrl: "http://www.gmmtour.com/gallery/highlight.json", // 编辑器内获取标签的url
			editor: "", // 编辑器实例对象，用于获取内容
			touristLineId : "", //专线ID
			touristLineObj : null,  // 专线对象
			imageType: "", // 获取图片类型
			imageTypeObj: null, // 获取图片类型
			pageSize : 15,
			width : 972,
			imgTooltipMaxWidth : 500,//图片预览最大宽度px
			maxFileSize : 2,//上传文件的最大尺寸M
			maxAreaDisplay : 3,
			onlyOneArea : true,//只选择一个区域
			multiSelect : true,//支持图片多选
			onOk : $.noop,//回调函数（选中的图片）
			debug : false,
			zIndex : 1000,
			options_id:0,
			mainPageImage:'',
			operateType: 'other_image', // 上传图片的类型
			isResetInit: false,  // 状态监控， 是否改变了专线
			showUploadBut : true, // 是否显示
			showUserUploadList : true, // 是否显示自己上传列表
			selfListUrl : "/gallery/uploaded.json?format=json", // 默认显示自己上传列表的链接
			uploadUrl : "/gallery/save-image.json"
		}, options);
		var spe = 0,inited = false, getError = false, $tab, $dialog, $activeTab;
		init();
		return this.off("click.gmgallery").on("click.gmgallery",function(){
			if (getError) {
				initPagination(true);
			}
			_getTouristLineId();  // 点击时重置专线编号和初始化状态。
			if(inited && (settings.isResetInit || settings.editor)){ // 如果是在编辑器内打开图片每次需要重新加载图库，因为标签会一直变
		    	settings.isResetInit = false;
		    	initPagination(true);
	    	}

			if(inited  && null != $dialog.html() && "" != $dialog.html()){
				$("li.imglist.selected",$dialog).removeClass("selected");
				$dialog.dialog("open");
				setDialogPosition($dialog);
				//add by zlm
				if(uploadtabcheck){
					inituploader();
				}
				initTags(settings.editor, settings.touristLineId); // 初始化标签索引
				return false;
			}
			inited = true;
			var h = '<ul><li><a index=0 href="#galleryTabSystem">系统图库</a></li>';
			h += (settings.showUserUploadList ? '<li><a index="1" href="#galleryTabuploaded">我上传的图片</a></li>' : '');
			h += '</ul>';

			var c = '<div class="input-group searchdiv"><input class="serach-images-input form-control" placeholder="搜索城市、景点"/><span class="input-group-btn"><button class="btn btn-info search_btn_" type="button">搜索</button></span></div>';						
			
			c += "<div id='galleryTabSystem'><div class='tag-list'></div><ul class='gallery_thumbnails'></ul><div class='pagination-wrap'><div class='pagination'></div></div></div>";
			if (settings.showUserUploadList) {
				c += "<div id='galleryTabuploaded'><ul class='gallery_thumbnails'></ul><div class='pagination-wrap'><div class='pagination'></div></div></div>";
			}
			
			h += c;
			
			$tab.html(h).tabs({
				active : 0,
				create : function( event, ui ) {
					$activeTab = ui.panel;
					initPagination();
					initTags(settings.editor, settings.touristLineId);
				},
				beforeActivate : function(event,ui){
					$activeTab = ui.newPanel;
					var $tar = $(".searchdiv",$dialog);
					if (settings.showUserUploadList) {
						if ($activeTab.is("#galleryTabuploaded")) {
							$tar.hide();
						} else {
							$tar.show();
						}
					}
					initPagination();
				},
				activate: function(){
					setDialogPosition($dialog);
				}
			});
			$dialog.empty().append($tab).dialog('open').parent().css({zIndex:((settings.zIndex && settings.zIndex > 1000)?settings.zIndex:1010)});

			$('.ui-widget-overlay').css('z-index', settings.zIndex - 1);
		});
		
		function _getTouristLineId() {
			if( settings.touristLineObj && null != settings.touristLineObj ) {
				settings.isResetInit = (settings.touristLineId == settings.touristLineObj.val()) ? false : true;
				settings.touristLineId = null == settings.touristLineObj.val() || "" == settings.touristLineObj.val() ? "" : settings.touristLineObj.val();
			}
			return null == settings.touristLineId ? "" : settings.touristLineId;
		}
		function _getQueryImageType() {
			if (settings.imageTypeObj && null != settings.imageTypeObj && typeof settings.imageTypeObj !="string") {
				settings.imageType = null == settings.imageTypeObj.val() || "" == settings.imageTypeObj.val() ? "" : settings.imageTypeObj.val();
			}
			return null == settings.imageType ? "" : settings.imageType;
		}
		function getUrl() {
			var rtnurl = settings.url;
			rtnurl += ((rtnurl.indexOf("?") > -1) ? "&queryType=" + _getQueryImageType() : "?queryType=" + _getQueryImageType());
			rtnurl += ((rtnurl.indexOf("?") > -1) ? "&line=" + _getTouristLineId() : "?line=" + _getTouristLineId());
			return rtnurl;
		}
		function init() {
			$tab = $("<div class='gallery_tab'></div>");
			$dialog = $("<div class='gallery_dialog'></div>").appendTo("body").dialog({
					autoOpen: false,
					dialogClass: "no-title",
					modal: true,
					width:settings.width,
					title:false,
					buttons: [{
				      	text: '完成',
				      	class: 'btn btn-info',
				      	click: function() {
			        		var res = [];
			        		$("li.imglist.selected",settings.onlyOneArea ? $activeTab : $dialog).each(function(){
			        			//res.push(JSON.parse($(this).attr("imgdata")));
			        			res.push(eval('(' + $(this).attr("imgdata") + ')'));
			        		})
			        		log(res);
			        		if(res.length > 0){
			        			var res = settings.onOk.call($dialog,settings.multiSelect?res:res[0]);
			        		//if(res!==false){
			        			$dialog.dialog("close");
			        		//}
			        		}else{
			        			$.alert("请至少选择一张图片", null, null, null, (settings.zIndex && settings.zIndex > 1000)?settings.zIndex*1 + 2:1010+2);
			        		}
				        }
			        }
			      ]
			}).on("click",".imglist",function(){
				$(this).toggleClass("selected");
				if(!settings.multiSelect){
					$(".selected",$dialog).not(this).removeClass("selected");
				}
			}).on("click",".search_btn_",function(){
				if(window.Placeholders && !Placeholders.nativeSupport) {
					Placeholders.disable($(this).prev("input")[0]);
				}
				var keyword = $(this).parents(".searchdiv").find("input").val();
				if(window.Placeholders && !Placeholders.nativeSupport) {
					Placeholders.enable($(this).prev("input")[0]);
				}
				var s = getUrl() + "&keyword=" + escape(keyword);

				$activeTab.find('.tag-list .btn-info').addClass('btn-default').removeClass('btn-info');
				initPagination(true,s);
			}).on("dblclick",".imglist",function(){
				var res = [];
				$(this).toggleClass("selected").addClass("selected");
				$("li.imglist.selected",settings.onlyOneArea ? $activeTab : $dialog).each(function(){
	      			res.push(eval('(' + $(this).attr("imgdata") + ')'));
	      		})

	      		var res = settings.onOk.call($dialog,settings.multiSelect?res:res[0]);
	      		$dialog.dialog("close");
			}).on("keydown", ".serach-images-input", function(){
				var e = window.event || arguments.callee.caller.arguments[0];
				if (e && e.keyCode == 13){
					e.returnValue=false;
					e.cancel = true;
					$(".search_btn_").click();
				}
			}).on('click', '.tag-list button', searchTag);

			getPaginationPlugin();
			getUploadPlugin();
			initUploader.call($dialog.next(".ui-dialog-buttonpane"));
		}
		function initUploader() {
			var $thiz = $(this),
			propMessage = "";
		    (settings.mainPageImage === "modifyMainIamge")&& (propMessage = "<p class='propMessage'>上传图片尺寸必须为750*1134。</p>");
			$thiz.prepend("<div class='upload_div'><form id='form_"+settings.options_id+"'><div class='btns'>"+propMessage+"<button class='btn btn-default cancel' type='button'>取消</button>"+ (settings.showUploadBut ? "<div id='options_id_"+settings.options_id+"' class='uploadbtn'>从电脑上传</div>" : "")	+"</div><div class='result'></div></form></div>");

			$thiz.find(".cancel").click(function(){
				log("cancel click");
				$dialog.dialog( "close" );
			});
			if (settings.showUploadBut) {
				inituploader();
			}
		}
		/***add by zlm****/
		function inituploader(){
			var options_id = settings.options_id;
			//编辑器上传图片
			var submitdata = {"operateType":settings.operateType,"width":settings.allowWidth||"-1",height:settings.allowHeight||"-1",compareType:_getQueryImageType(),compareFn:_getQueryImageType};
			if(settings.uploadOpts && settings.uploadOpts!=null && settings.uploadOpts!="undefined"){
				submitdata = {"operateType":settings.operateType,"width":settings.uploadOpts.allowWidth||"-1",height:settings.uploadOpts.allowHeight||"-1",compareType:settings.uploadOpts.imageType,minRadio:settings.uploadOpts.minRadio,maxRadio:settings.uploadOpts.maxRadio};
			}
			//行程封面
			var dom_process = $("#options_id_"+options_id)
			var $res = dom_process.parent().parent().find(".result");
			var activeFirst = true;
			$activeTab = $("#galleryTabuploaded");
			inituploaderGmgallery("#options_id_"+options_id,$res,submitdata,function(response){
				$res.html("<span class='success'>上传成功</span>");
				$.ajax({
					type:"POST",
					dataType:"json",
					async : true,
					url: settings.uploadUrl + (settings.uploadUrl.indexOf("?") > -1 ? "?_=" + (new Date()).getTime() : "&_=" + (new Date()).getTime()),
					data:{format:"json",fileInfo:JSON.stringify(response),m:Math.random()},
					success:function(){
						$tab.tabs("option", "active", 1);
						activeFirst = true;
						initPagination(true,false,function(data){
							resetInnerHtml(data);
						});
						$res.html("");
					},
					error:function(){
						alert("error");
						$res.html("");
					}
				});
			},function(id,message){
					if(settings.uploadOpts && settings.uploadOpts!=null && settings.uploadOpts!="undefined" && settings.uploadOpts.errormsg!="undefined"){
						$res.html(settings.uploadOpts.errormsg);
					}else{
						$res.html(message);
					}
					setTimeout(function() {
						$res.html("");
					}, 2000);
			});
			function resetInnerHtml(data){
				$activeTab.find("ul.gallery_thumbnails").empty().html("").html(genImgList(data));
				initTooltip();
				if(activeFirst){
					$tab.tabs("option", "active", 1);
					$(".imglist:first",$activeTab).click();
					activeFirst = false;
				}
			}
		}

		// jquery ui tooltip
		// 由于bootstrap 的tooltip 覆盖了jquery ui 的tooltip，故作此处理
		function initTooltip(){
			$dialog.find('.img-view').each(function(){
				$.ui.tooltip({
					tooltipClass:"gallery-dialog-imgtips",
					position: { my: "left top",at: "right+5 top-5"},
					content: function() {
						return "<img style='max-width: "+settings.imgTooltipMaxWidth+"px' src='"+$(this).attr("data-original")+"'>";
					},
					open : function (){
						$(".ui-tooltip").css({"z-index" : (settings.zIndex && settings.zIndex > 1000)?settings.zIndex*1 + 2:1010+2});
					}
				}, this);
			});
		}
		function initPagination(force,sUrl,callback){
			var $pagination = $('.pagination',$activeTab),
			    $tar = $activeTab.find("ul.gallery_thumbnails");
			if($pagination.attr("paginationInited") === "true"){
				if(force === true){
					try{
						$tar.empty();
						$pagination.attr("paginationInited", "false");
						$pagination.pagination("destroy");
					}catch(e){}
				}else{
					return;
				}
			}
			var pagedata = $tar.html("<li class='gmgallery-loading'><i></i><p>加载中...</p></li>").attr("pagedata");
			var pagination = null;

			if($activeTab.is("#galleryTabuploaded") && (force === true || !pagedata)){
				sUrl = ((settings.selfListUrl.indexOf("?") > -1) ? settings.selfListUrl + "&" : settings.selfListUrl + "?" ) + "size="+settings.pageSize+"&queryType=" + _getQueryImageType();;
				/**
				$.ajax({
					url: sUrl + getRandomStr(),
					async:false,
					success:function(d){
						if(typeof d == "string"){
							d = eval('(' + d + ')');
						}

						$tar.html("").html(genImgList(d.images));
						initTooltip();
						pagination = d.pagination;
					},
					error : function(){
						getError = true;
					}
				})这段代码会引起两次请求**/
			}else{
				pagination = data = eval('(' + pagedata + ')');
			}
			if("true" !== $pagination.attr("paginationInited") && true !== $pagination.attr("paginationInited")){
				$pagination.attr("paginationInited","true").pagination({
					dataSource:(sUrl || getUrl()) + getRandomStr(),
					locator: 'images',
					triggerPagingOnInit:true,
					alias:{
						 pageNumber: 'page',
						 pageSize: 'size'
					},
					getTotalPageByResponse: function (data) {
		                return data.pagination.pageCount;
		            },
					pageSize:settings.pageSize,
					hideWhenLessThanOnePage:false,
					beforePaging:function(){
						log("paging")
						$tar.html("<li>正在加载...</li>");
					},
					callback:function(data,p){
						$pagination[data.length ? 'show' : 'hide']();
						$tar.html("").html(genImgList(data));
						initTooltip();
						callback && callback(data);
						setDialogPosition($dialog);
					}
				});
			}
		}

		// 图库索引
		function initTags(editor, lineId){
			if(!editor || !lineId) return; // 判断是否是编辑器内的上传图片

			var content = editor.getContentTxt();
			var $tagObj = $activeTab.find('.tag-list');

			// 判断编辑器的内容是否是placeholder的值
			if(content && editor.textarea.placeholder == content){
				$tagObj.html('').removeClass('has-tags');
				return;
			}

			$.post(settings.tagUrl, {content: content, touristLine: lineId}, function(res){
				var htmls = '',
					nameAry = {};

				if(res.areas.length || res.sights.length){
					htmls = '<button type="" class="btn btn-default" value="">全部</button>';
					$.each(['areas', 'sights'], function(i, n){
						$.each(res[n], function(ii){
							var name = this.name;

							if(!nameAry[name]){
								htmls += '<button type="'+ n +'" class="btn btn-default" value="'+ this.id +'">'+ name +'</button>';
								nameAry[name] = name;
							}
						});
					});
				}

				if(htmls){
					$tagObj.addClass('has-tags');
				}else{
					$tagObj.removeClass('has-tags');
				}

				$tagObj.html(htmls);
			}, 'json');
		}

		// 搜索标签
		function searchTag(){
			// var keyword = $(this).parents(".searchdiv").find("input").val();
			// var type = $(this).attr('type');
			var keyword = $(this).text();
			var params = {
				keyword: keyword == '全部' ? '' : keyword
			}

			// type && (params[type] = this.value);

			var url = getUrl() + "&" + $.param(params);

			$dialog.find('.searchdiv input').val('');
			$(this).parent().find('.btn-info').removeClass('btn-info').addClass('btn-default');
			$(this).addClass('btn-info').removeClass('btn-default');

			initPagination(true, url);
		}

		function genImgList(data){
			var c = "";
			$.each(data,function(){
				c += "<li class='imglist' imgdata='"+JSON.stringify(this)+"'><img src='"+this.url+"@170w_112h_1e_1c'/><i class='gm-icon gm-success'></i><span class='icon'></span><span class='img-view' data-original='"+this.url+"@"+settings.imgTooltipMaxWidth+"w_100q' title='jquery ui tooltip必须要有title属性'><i class='gm-icon gm-search2'></i></span>"+(this.recommend?"<div class='sight_pic_recommend'>推荐</div>":"")+"</li>";
				// @170w_112h_1e_1c
			})
			return c?c:"<li class='gmgallery-loading'><p style='margin-top: 16px;'>暂无数据</p></li>";
		}
		function getRandomStr(){
			return "&_=" + (new Date()).getTime();
		}
		function getScript(url,callback){
			$.ajax({
				  url: url,
				  dataType: "script",
				  async:false,
				  success: callback || $.noop,
				  error: function(){
					  alert("上传控件加载异常！" + url + "未找到！请检测网络链接！正常后刷新重试！");
				  }
			});
		}
		
		function getPaginationPlugin(){
			$.fn.pagination === undefined && getScript(WEB_STATIC + "/common/plugins/pagination/pagination-with-styles.min.js");
		}
		function getUploadPlugin(){
			$.fn.fileupload === undefined && getScript(WEB_STATIC + "/common/plugins/jqueryui/fileUpload/js/jquery.fileupload.js");
		}
		function log(msg){
			if(settings.debug){
				console.log(msg);
			}
		}
		function setDialogPosition($dialog){
			var clientHeight = document.documentElement ? document.documentElement.clientHeight : $(window).height(); // getBodyHeight();
			thisTop = (clientHeight - $dialog.parent().height()) / 2 + (document.body.scrollTop > 0 ? document.body.scrollTop : $(document).scrollTop());
			thisTop = thisTop > 0 ? thisTop : 0;
			$dialog.parent().css({top : thisTop});
		}
	}
})(jQuery);