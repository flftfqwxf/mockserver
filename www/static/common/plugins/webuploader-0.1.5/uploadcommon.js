var uploadtabcheck = false;
var alreadyinitupload = false;
var usewebUploader = true;
var serverurl = "http://www.gmmtour.com/api/upload?format=json";
var serverurl2 = "http://www.gmmtour.com/api/upload2?format=text";
var swfUrl = "http://www.gmmtour.com/common/plugins/webuploader-0.1.5/Uploader.swf";
var imageArray = new Array("JPG","JPEG","PNG","GIF");
function checkSupport(){
	  /**var brow=$.browser;
	  var bInfo="";
	  if($.browser.msie) {bInfo="Microsoft Internet Explorer "+brow.version;}
	  if(brow.mozilla) {bInfo="Mozilla Firefox "+brow.version;}
	  if(brow.safari) {bInfo="Apple Safari "+brow.version;}
	  if(brow.opera) {bInfo="Opera "+brow.version;}
	  **/
	  if(usewebUploader){
			 if (!WebUploader.Uploader.support() ) {
			        alert( 'Web Uploader 不支持您的浏览器！请尝试升级 flash 播放器,否则将影响您的正常使用！');
			        //throw new Error( 'WebUploader does not support the browser you are using.' );
			        return false;
			   }
		}else{
			return false;
		}
	 return true;
}


function showError(code,options,assign) {
	var isImgUpload = true;
	if(options.accept && options.accept.extensions && options.accept.extensions!=""){
		var extensions = options.accept.extensions.split(",");
		for(var i=0;i<extensions.length;i++){
			var ext =  $.trim(extensions[i]).toUpperCase();
			var imgup = false;
			for(var j=0;j<imageArray.length;j++){
				var extimg =  $.trim(imageArray[j]);
				if(ext==extimg){
					imgup = true;
					break;
				}
			 }
			if(imgup==false){
				isImgUpload = false;
				break;
			}
		}
	}else{
		isImgUpload = false;
	}
	var message ="";
	if(isImgUpload==true){
		message = getSystemKindMessage(code,options);
	}else{
		message = getWebUploadMessage(code,options,assign);
	}
	return message;
};

function callJqueryUpload(options){
		var defaultUpload = true;//使用默认的上传
		if(options.useDefault && options.useDefault==1){
			defaultUpload = false;
		}
		defaultUpload = true;
		var processdom,successdom;
		var label = options.label||"从电脑上传";
		var operateType = options.operateType||"sight";//类型
		var corver = options.corver||"";//类型
		var tipmessage = options.tipmessage || "";
		var	formData = {"operateType":operateType};
		
		var id = new Date().getTime();
		//取消
		$(options.target).html('<form><div id="id_'+id+'" class="uploadbeforeUp"><a class="'+id+' uploadupBtn" href="javascript:void(0);"><span class="uploadtip">'+label+'</span><input type="file" class="gmUploadLogoButfile" name="file" hidefocus/></a>'+tipmessage+'</div><div class="uploaddoingUp opacity webup-hidden"><span class="uploadupBtn doing" >上传中（5%）</span><a href="javascript:;" class="cancle"></a></div><div class="uploadsuccessUp opacity webup-hidden"><span class="uploadupBtn success" >&nbsp;&nbsp;上传成功</span></div></form>');
		//alert($(options.target).html())
		$("#id_"+id).css("clear","both");
		processdom = $("#id_"+id).next();
		successdom = processdom.next();
		//alert(processdom.html())
		processdom.css("width","160px");
		id = "."+id;
		
		//processdom.removeClass("opacity").removeClass("webup-hidden");
		// $(id).addClass("opacity");
		 if(true){
			 $(id+" .gmUploadLogoButfile").css({
				 "position":"absolute",
				 "top":"0px",
				 "left": "0px"
			 })
			  $(id).css("position","relative");
			 
		 }
		 /**
		 $(id+" input[type=file]").css({
			 "font-size":"50px","overflow":"hidden","opacity":"0","filter":"alpha(opacity=0)","width":"100px","height":"30px"
		 })
		 **/
		 if($.browser.msie){
			// $(".uploadbeforeUp").css("margin-top","10px");
		 }
		var process = options.process || function(percent){
				if(defaultUpload){
					processdom.find('.doing').text("上传中("+percent+")");
				}
		};//进度
		var success = options.success || function(response){
			alert("success:"+response.message);
		};//成功
		var cancelsuccess = options.cancelsuccess || function(){
			
		};//成功
		var error = options.error || function(msg){
			alert(msg)
		};//失败
		
		//文件添加时
		var fileQueued = options.fileQueued || function(){
			if(defaultUpload){
				$(id).addClass("opacity");
				processdom.removeClass("opacity").removeClass("webup-hidden");
				$(".uploadbeforeUp .upload-tips").addClass("webup-hidden");
			}
		};
	
	
		 var uploaderJquery =  $(id+" .gmUploadLogoButfile").fileupload({
				url: serverurl+'&operateType='+formData.operateType,
				dataType: 'json',
				//jsonp: "callback",
			    //contentType:"application/json",
			    iframe:true,
			    maxFileSize: 2 * 1024 * 1024,
			    progressall: function (e, data) {       
		   		 },
			    done: function (e, d) {
			    	var data = d.result;
			    	if (typeof data === "string") {
							data = eval('(' + data + ')');
					}
			    	if(defaultUpload){
			    		processdom.addClass("opacity").addClass("webup-hidden");
			    	}
			    	$(id+' input[type=file]').attr("disabled",false); 
					
					if (data.success) {
						if(defaultUpload){
							successdom.removeClass("opacity").removeClass("webup-hidden");//显示成功
						}
						 var jsonmessage = {};
						 jsonmessage.url=data.url;
						 jsonmessage.fileName=data.name;
						 jsonmessage.name=data.name;
						 jsonmessage.size=data.size;
						 jsonmessage.width=data.width;
						 jsonmessage.height=data.height;
						 jsonmessage.id=0;
						 data.message = JSON.stringify(jsonmessage);
						 data.notUsewebUploader=true;
						 if(defaultUpload){
								 setTimeout(function() {
									successdom.addClass("opacity").addClass("webup-hidden");
									$(id).removeClass("opacity");
									$(".uploadbeforeUp .upload-tips").removeClass("webup-hidden");
				    		   }, 3000);
						 }
					  success(data);
					} else {
						if(defaultUpload){
							$(id).removeClass("opacity");
						}
						error(id,data.message);
					}
					
				},
				fail:function(m){
					if(defaultUpload){
						$(id+' input[type=file]').attr("disabled",false); 
						processdom.addClass("opacity").addClass("webup-hidden");
						$(id).removeClass("opacity");
					}
					error(id,"上传失败");
				}
			}).bind('fileuploadadd',function(){
				fileQueued();
				$(id+' input[type=file]').attr("disabled",true); 
			}).bind('fileuploadprogress', function (e, data) {
				var percent = Math.round((data.loaded/data.total))*100+"%";
				process(percent);
			})
			if(defaultUpload){
				/**+
				processdom.find(".cancle").on("click",function(){
							uploaderJquery.abort();
				  })
				$(id+' input[type=file]').attr("disabled",false); 
				processdom.addClass("opacity").addClass("webup-hidden");
				$(id).removeClass("opacity")
				**/
			}
}
/**
 *  图片选择容器页面上传单图片
 * @param pick 控件容器
 * @param $res 进度元素
 * @param call 上传成功后回调
 */
function inituploaderGmgallery(pick,$res,formData,call,callf,showArea){
	if(checkSupport()){
		var inited = false;
		if(!callf){
			callf = function(msg){
				alert(msg);
			}
		}
		var this_compareFn = formData.compareFn;
		formData.compareFn=null;
		var options = {
				pick: {
		            id: pick,
		            multiple:false,
		            label: '<i class="gm-icon gm-img"></i> 从电脑上传'
		        },
		        duplicate:true,
		        auto:true,//图片自动上传
		        //runtimeOrder:"flash",
		        //dnd: '#uploader .queueList',
		        //paste: document.body,
		        /** **/
		        accept: {
		            title: '图片',
		            extensions: 'jpg,jpeg,png',
		            mimeTypes: 'image/*'
		        },
		        chunked:true,
		        compress:false,
		        formData:formData,
		        swf:swfUrl,
		        // 文件接收服务端。
		        server: serverurl,
		        //fileNumLimit: 1,
		        fileSizeLimit: 2 * 1024 * 1024,    // 200 M
		        fileSingleSizeLimit: 2 * 1024 * 1024    // 50 M
		}
		
			uploader001 = WebUploader.create(options);
		  // 当有文件添加进来的时候
		    uploader001.on('fileQueued', function( file ) {
		    	if(this_compareFn && typeof this_compareFn=="function"){
		    		uploader001.options.formData.compareType=this_compareFn();
		    		options.formData.compareType=this_compareFn();
		    	}else{
		    		uploader001.options.formData.compareType=formData.compareType;
		    		options.formData.compareType=formData.compareType;
		    	}
		    	if(showArea){
		    		showArea(false);
		    	}
		    	if ( file.getStatus() === 'invalid' ) {
		            showError( file.statusText );
		        }else{
		        	fileid = file.id;
		        	$res.html("<div class='bar'>上传中<span class='progress'>(0%)</span><span style='cursor:pointer;' class='cancle'>取消</span></div>");
		        	$res.find(".cancle").on("click",function(){
		        		uploader001.stop(true);
		        		uploader001.removeFile(file,true);
		        		$res.html("");
		        		if(showArea){
		        			showArea(true);
		        		}
		        	})
		        }
		    });
		    
		    //进度
			uploader001.on( 'uploadProgress', function( file, percentage ) {
				var percent = Math.round(percentage * 100) + '%' ;
				if(percent=="100%"){
					percent="99%";
				}
				$res.find('.progress').text("("+percent+")");
		    });
			
			//上传成功
		    uploader001.on('uploadSuccess', function( file,response) {
		    	//alert("上传成功"+response.url+"--"+response.id)
				if (response.success) {
			    	uploader001.reset();
			    	if(call){
			    		call(response);
			    	}
				}else{
					callf(id,response.message)
				}
		    	
		    });
		    
		    uploader001.on('error', function(code,reason ) {
		    		var text = showError(code,options);
		    		callf(id,text);
		    		uploader001.reset();
			 });
		    
		    //上传失败
		    uploader001.on( 'uploadError', function( file,reason ) {
		       //alert('上传出错'+reason);
		    	callf(id,showError(reason,options));
		        uploader001.reset();
		    });

		    //上传完成
		    uploader001.on( 'uploadComplete', function( file ) {
		    });
		    
		    uploader001.on( 'ready', function() {
			    	//调整位置
			    	//$(pick+".webuploader-container").css("width","60px");
					$(pick+".webuploader-container").children().eq(1).css("width","60px").css("height","32px")
					//alert($(pick+".webuploader-container").html());
		    });
	}else{
		if(true){
			return;
		}
		var targetid = pick.split("_")[2];
		var options = {
				target:"#options_id_"+targetid,
				operateType:formData.operateType
		}
		var id = new Date().getTime();
		$(options.target).html('<div id="id_'+id+'"><a class="'+id+'" href="javascript:void(0);"><span class="uploadtip" style="cursor:pointer">从电脑上传</span><input type="file" class="gmUploadLogoButfile" name="file" hidefocus/></a></div>');
		$("#id_"+id).css("clear","both");
		id = "."+id;
		 $(id+" input[type=file]").css({
			 "font-size":"50px","overflow":"hidden","opacity":"0","filter":"alpha(opacity=0)","width":"100px","height":"26px"
		 })
		 $(id+" .gmUploadLogoButfile").fileupload({
				url: serverurl+'&operateType='+formData.operateType,
				dataType: 'json',
			    sequentialUploads: false,
			    maxFileSize: 2 * 1024 * 1024,
			    progressall: function (e, data) {       
		   		 },
			    done: function (e, d) {
			    	$(id+' input[type=file]').attr("disabled",false); 
					var data = d.result;
					if (data.success) {
						 var jsonmessage = {};
						 jsonmessage.url=data.url;
						 jsonmessage.fileName=data.name;
						 jsonmessage.name=data.name;
						 jsonmessage.size=data.size;
						 jsonmessage.width=data.width;
						 jsonmessage.height=data.height;
						 jsonmessage.id=0;
						 data.message = JSON.stringify(jsonmessage);
						 data.notUsewebUploader=true;
						 call(data);
					} else {
						callf(id,data.message);
					}
				},
				fail:function(){
					callf(id,"上传失败");
				}
			}).bind('fileuploadadd',function(){
				$res.html("<div class='bar'>上传中<span class='progress'>(0%)</span><span style='cursor:pointer;' class='cancle'>取消</span></div>");
				$(id+' input[type=file]').attr("disabled",true); 
			}).bind('fileuploadprogress', function (e, data) {
				var percent = Math.round((data.loaded/data.total))*100+"%";
				$res.find('.progress').text("("+percent+")");
			})
	}    
}



/**
 * 页面上传单一图片
 * @param pick 控件容器
 * @param doing 进度元素
 * @param call 上传成功后回调
 */
function uploaderSingle(options){
	if(checkSupport()){
		var removeFile = null;
		var inited = false;
		var defaultUpload = true;//使用默认的上传
		if(options.useDefault && options.useDefault==1){
			defaultUpload = false;
		}
		var processdom,successdom;
		
		var operateType = options.operateType||"sight";//类型
		var	formData ={"operateType":operateType,"width":options.allowWidth||"-1",height:options.allowHeight||"-1",compareType:options.allowType||"",minRadio:options.minRadio||"1",maxRadio:options.maxRadio||"1"};
		options.formData=formData;
		
		var target = options.target;//DOMid
		var cancel = options.cancel;//取消
		var label = options.label||"从电脑上传";
		var auto = options.auto|| true;//自动上传
		var tipmessage = options.tipmessage || "";
		var accept = options.accept||{
            title: '图片',
            extensions: 'JPG,PNG',
            mimeTypes: 'image/*'
        };
        options.accept = accept;
    	var resetwidth = options.resetwidth|| false;//改变大小
		var multiple = options.multiple|| false;//多选
		var fileNumLimit = options.fileNumLimit|| 5;//多选文件数
		var fileSizeLimit = options.fileSizeLimit|| 50 * 1024 * 1024;//总文件大小 
		var fileSingleSizeLimit = options.fileSingleSizeLimit|| 10 * 1024 * 1024;//单个文件大小 
		options.fileSingleSizeLimit=fileSingleSizeLimit;
		var id = new Date().getTime();
		if(defaultUpload){
			var html = '<div id="id_'+id+'" class="uploadbeforeUp"><span class="'+id+' uploadupBtn" >从电脑上传</span>'+tipmessage+'</div><div class="uploaddoingUp opacity webup-hidden"><span class="uploadupBtn doing" >上传中（0%）</span><span class="cancle">取消</span></div><div class="uploadsuccessUp opacity webup-hidden"><span class="uploadupBtn success" >&nbsp;&nbsp;上传成功</span></div>'
			if(options.console){ 
				html = '<div  id="id_'+id+'" class="uploadbeforeUp"><span  class="'+id+' uploadupBtnconsole">上传图片</span></div><div class="uploaddoingUpconsole opacity webup-hidden"><span class="uploadupBtnconsole doing" >上传中（0%）</span><span href="" class="cancle">取消</span></div><div class="uploadsuccessUp opacity webup-hidden"><span class="uploadupBtnconsole success" >&nbsp;&nbsp;上传成功</span></div>';
			}
			$(target).html(html);
			$("#id_"+id).css("clear","both");
			processdom = $("#id_"+id).next();
			successdom = processdom.next();

			processdom.css("width","160px")
			id = "."+id;
		}else{
			id = options.id;
		}
		//进度
		var process = options.process || function(percent){
				if(defaultUpload){
					processdom.find('.doing').text("上传中("+percent+")");
				}
		};
		//成功
		var success = options.success || function(response){
			alert("success:"+response.message);
		};
		//成功
		var cancelsuccess = options.cancelsuccess || function(){
			
		};
		//失败
		var error = options.error || function(msg){
			alert(msg)
		};
		
		//文件添加时
		var fileQueued = options.fileQueued || function(file){
			if(options.addFile){
				options.addFile(file);
			}
			removeFile = file;
			if ( file.getStatus() === 'invalid' ) {
	            showError( file.statusText );
	        }else{
	        	if(defaultUpload){
		        	$(id).addClass("opacity");
		        	$(".uploadbeforeUp .upload-tips").addClass("webup-hidden");
		        	processdom.removeClass("opacity").removeClass("webup-hidden");
		        	if(inited==false){
		        		processdom.find(".cancle").css("cursor","pointer");
			        	processdom.find(".cancle").on("click",function(){
			        		uploader.stop(true);
			        		uploader.removeFile(file,true);
			        		uploader.reset();
			        		processdom.addClass("opacity").addClass("webup-hidden");
			        		$(id).removeClass("opacity");
			        	})
			        	inited = true;
		        	}
	        	}
	        }
		};
		
		var uploader = WebUploader.create({
			    	 	//swf文件路径
						pick: {
				            id: id,
				            multiple:false,
				            label: label
				        },
				        auto:auto,
				        //runtimeOrder:"flash",
				        //dnd: '#uploader .queueList',
				        //paste: document.body,
				        /**  **/
				        accept:accept,
				        compress:false,
				        chunked:true,
				        formData:formData,
				        swf:swfUrl,
				        // 文件接收服务端。
				        server: serverurl,
				        fileNumLimit: fileNumLimit,
				        fileSizeLimit: fileSizeLimit,    // 200 M
				        fileSingleSizeLimit: fileSingleSizeLimit    // 50 M
				    });
		
				  // 当有文件添加进来的时候
				uploader.on('fileQueued', function( file ) {
				        fileQueued(file);
				    });
				    
				uploader.on('uploadProgress', function( file, percentage ) {
						var percent = Math.round(percentage * 100) + '%' ;
						if(percent=="100%"){
							percent="99%";
						}
						process(percent);
				 });
	
				uploader.on('uploadSuccess', function(file,response) {
				    	//alert("上传成功"+response.url+"--"+response.message)
						uploader.reset();
						if (response.success) {
							 if(defaultUpload){
								 $(id).addClass("opacity");
								 processdom.addClass("opacity").addClass("webup-hidden");
								 successdom.removeClass("opacity").removeClass("webup-hidden");//显示成功
							 }
							 var jsonmessage = {};
							 jsonmessage.url=response.url;
							 jsonmessage.fileName=response.name;
							 jsonmessage.name=response.name;
							 jsonmessage.size=response.size;
							 jsonmessage.width=response.width;
							 jsonmessage.height=response.height;
							 jsonmessage.id=0;
							 response.message = JSON.stringify(jsonmessage);
							 success(response,target);
							 if(defaultUpload){
								 setTimeout(function() {
					    			 	successdom.addClass("opacity").addClass("webup-hidden");
						 				$(id).removeClass("opacity");
						 				$(".uploadbeforeUp .upload-tips").removeClass("webup-hidden");
					    		 }, 3000);
							 }
						}else{
							 if(defaultUpload){
								$(id).removeClass("opacity");
								processdom.addClass("opacity").addClass("webup-hidden");
								//successdom.removeClass("opacity").removeClass("webup-hidden");//显示成功
							 }
							error(id,response.message);
						}
				    });
				
				uploader.on('uploadError', function( file,reason ) {
					if(defaultUpload){
						$(id).removeClass("opacity");
						processdom.addClass("opacity").addClass("webup-hidden");
						//successdom.removeClass("opacity").removeClass("webup-hidden");//显示成功
					 }
					error(id,showError(reason,options));
					uploader.reset();
				 });
				
				uploader.on('error', function(code,reason ) {
					var text = showError(code,options);
					if(defaultUpload){
						$(id).removeClass("opacity");
						processdom.addClass("opacity").addClass("webup-hidden");
						//successdom.removeClass("opacity").removeClass("webup-hidden");//显示成功
					 }
					error(id,text);
					uploader.reset();
				 });
				
				uploader.on( 'uploadComplete', function( file ) {
			    	
			    });
			
				uploader.on( 'ready', function() {
					//$(id).addClass("opacity");
					//processdom.removeClass("opacity").removeClass("webup-hidden");
				    //调整位置
				    if(options.positionable){
					 	$(id+".webuploader-container").css("position","relative");
						$(id+".webuploader-container").children().eq(1).css("top","0").css("left","0")
				    }
				    if(resetwidth){
				    	var  upload_dom = $(id+" .webuploader-pick").next();
						 var width = parseInt(upload_dom.css("width"));
						 var height = parseInt(upload_dom.css("height"));
						if(width<120){
							upload_dom.css({"width":"120px",height:"26px"})
						}
				    }
			    });
			    if(cancel){
			    	cancel.on("click",function(){
			    		uploader.stop(true);
			    		if(removeFile){
			    			uploader.removeFile(removeFile,true);
			    			removeFile = null;
			    		}
			    		uploader.reset();
			    		cancelsuccess();
			    	})
			    }
			    return uploader;
	}else{
			//callJqueryUpload(options)
	}
}


/**
 * 多文件上传
 */
function uploadmulti(options){
	if(checkSupport()){
		var jsonarray = new Array();
		var process = options.process || function(){};//进度
		var successupload = options.successupload || function(){};//成功
		var complete = options.complete || function(){};//成功
		var cancelsuccess = options.cancelsuccess || function(){};//成功
		var error = options.error || function(){};//失败
		var fileAdd = options.fileAdd || function(){};//进度
		var id = options.id;//DOMid
		var pickwidth = options.pickwidth|| "80px";//
		var resetwidth = options.resetwidth|| false;//改变大小
		var cancel = options.cancel;//取消
		var label = options.label||"从电脑上传";
		var auto = options.auto|| false;//自动上传
		var operateType = options.operateType||"sight";//类型
		var accept = options.accept|| null;
		var multiple = options.multiple|| false;//多选
		var fileNumLimit = options.fileNumLimit|| 10;//多选文件数
		var fileSizeLimit = options.fileSizeLimit|| parseInt(fileNumLimit) * 1024 * 1024;//总文件大小 
		var fileSingleSizeLimit = options.fileSingleSizeLimit|| 2 * 1024 * 1024;//单个文件大小 
		options.fileSingleSizeLimit=fileSingleSizeLimit;
		var	formData ={"operateType":operateType,"width":options.allowWidth||"-1",height:options.allowHeight||"-1",compareType:options.allowType||"",minRadio:options.minRadio||"1",maxRadio:options.maxRadio||"1"};
		options.formData=formData;
		var $ = jQuery,    // just in case. Make sure it's not an other libaray.
	        // 总体进度条
	    	tip = false,
	        // 添加的文件数量
	        fileCount = 0,
	        // 添加的文件总大小
	        fileSize = 0,
	        // 优化retina, 在retina下这个值是2
	        ratio = window.devicePixelRatio || 1,
	        // 可能有pedding, ready, uploading, confirm, done.
	        state = 'pedding',
	        // 所有文件的进度信息，key为file id
	        // 优化retina, 在retina下这个值是2
	        ratio = window.devicePixelRatio || 1,
	        // 缩略图大小
	        thumbnailWidth = 110 * ratio,
	        thumbnailHeight = 110 * ratio,
	        percentages = {};
	        // WebUploader实例
	
	        uploadermulti = WebUploader.create({
	    	 	//swf文件路径
				pick: {
		            id: id,
		            multiple:true,
		            label: label
		        },
		        auto:auto,
		        //runtimeOrder:"flash",
		        //dnd: '#uploader .queueList',
		        //paste: document.body,
		        accept:accept,
		        compress:false,
		        chunked:true,
		        formData:formData,
		        swf:swfUrl,
		        // 文件接收服务端。
		        server: serverurl,
		        fileNumLimit: fileNumLimit,
		        fileSizeLimit: fileSizeLimit,    // 200 M
		        fileSingleSizeLimit: fileSingleSizeLimit    // 50 M
		    });
	
	    
	    
	    //当有文件添加进来时执行，负责view的创建
	    function addFile( file ) {
	        if (file.getStatus() === 'invalid' ) {
	            showError( file.statusText );
	        } else {
	            percentages[ file.id ] = [ file.size, 0 ];
	            file.rotation = 0;
	        }
	
	        file.on('statuschange', function( cur, prev ) {
	            if ( prev === 'progress' ) {
	            } else if ( prev === 'queued' ) {
	            }
	            // 成功
	            if ( cur === 'error' || cur === 'invalid' ) {
	                showError( file.statusText );
	                percentages[ file.id ][ 1 ] = 1;
	            } else if ( cur === 'interrupt' ) {
	    	    	error("上传失败，请稍后重试",file,true);
	            } else if ( cur === 'queued' ) {
	                percentages[ file.id ][ 1 ] = 0;
	            } else if ( cur === 'progress' ) {
	            } else if ( cur === 'complete' ) {
	            }
	
	        });
	        
	        uploadermulti.makeThumb(file, function(error,src ) {
	            if (error) {
	                src = '-1' ;
	            }
	            fileAdd(file,src);
	        }, thumbnailWidth, thumbnailHeight );
	    }
	
	
	    function updateTotalProgress() {
	        var loaded = 0,
	            total = 0,
	            percent;
	
	        $.each( percentages, function( k, v ) {
	            total += v[ 0 ];
	            loaded += v[ 0 ] * v[ 1 ];
	        } );
	
	        percent = total ? loaded / total : 0;
	        percent =  (Math.round(percent)*100)+"%";
	        if(percent=="100%"){
				percent="99%"
			}
	        //process(percent);
	    }
	
	    function setState( val ) {
	        var file, stats;
	
	        if ( val === state ) {
	            return;
	        }
	
	        state = val;
	        switch ( state ) {
	            case 'pedding':
	            	uploadermulti.refresh();
	                break;
	
	            case 'ready':
	            	uploadermulti.refresh();
	                break;
	
	            case 'uploading':
	                break;
	
	            case 'paused':
	                break;
	
	            case 'confirm':
	                stats = uploadermulti.getStats();
	                if ( stats.successNum && !stats.uploadFailNum ) {
	                    setState( 'finish' );
	                    return;
	                }
	                break;
	            case 'finish':
	                stats = uploadermulti.getStats();
	                if (stats.successNum ) {
	                    		complete(jsonarray);
	                    		jsonarray = new Array();
	                    		uploadermulti.reset();
	                } else {
	                    // 没有成功的图片，重设
	                    state = 'done';
	                    location.reload();
	                }
	                break;
	        }
	    }
	
	    uploadermulti.onUploadProgress = function( file, percentage ) {
	        percentages[file.id ][ 1 ] = percentage;
	        //updateTotalProgress();
	        
	        //自动
	        var percent = Math.round(percentage * 100) + '%' ;
			if(percent=="100%"){
				percent="99%";
			}
	        process(file.id,percent,file);
	    };
	
	    
	    
	    uploadermulti.onFileQueued = function( file ) {
		        fileCount++;
		        fileSize += file.size;
		        if ( fileCount === 1 ) {
		        }
		        addFile( file );
		        setState( 'ready' );
		        updateTotalProgress();
	    };
	    
	    
	    // 负责view的销毁
	    function removeFile( file ) {
	        delete percentages[ file.id ];
	        updateTotalProgress();
	    }
	    
	    uploadermulti.onFileDequeued = function( file ) {
	        fileCount--;
	        fileSize -= file.size;
	        if ( !fileCount ) {
	            setState( 'pedding' );
	        }
	        removeFile( file );
	        updateTotalProgress();
	    };
	
	    uploadermulti.on( 'all', function( type ) {
	        var stats;
	        switch( type ) {
	            case 'uploadFinished':
	                setState( 'confirm' );
	                break;
	
	            case 'startUpload':
	                setState( 'uploading' );
	                break;
	
	            case 'stopUpload':
	                setState( 'paused' );
	                break;
	
	        }
	    });
	
	    uploadermulti.onError = function( code ) {
	    	var text = showError(code,options,true);
			error(text);
	    };
	
	    uploadermulti.on('uploadSuccess', function( file,response ) {
	    	//if(response.success){
	    	//	jsonarray.push(response);
	    	//}
	    	if(response && response.success){
	    		 jsonarray.push(response);
		    	 var jsonmessage = {};
				 jsonmessage.url=response.url;
				 jsonmessage.fileName=response.name;
				 jsonmessage.name=response.name;
				 jsonmessage.size=response.size;
				 jsonmessage.width=response.width;
				 jsonmessage.height=response.height;
				 jsonmessage.id=0;
				 response.message = JSON.stringify(jsonmessage);
				 response.fid = file.id;
				 successupload(file.id,response)
	    	}else{
	    		if(response){
	    			error(response.message,file);
	    		}else{
	    			error("上传失败",file);
	    		}
	    	}
	    });
	    
	    uploadermulti.on('uploadComplete', function( file ) {
	    	
	    });
	    
	    uploadermulti.on('uploadError', function( file,message ) {
	    	var text = showError(message,options,true);
	    	error(text,file);
	    });

	    
	    uploadermulti.on('ready', function() {
	    	if(options.addhover){
	    		id.addClass("muiti-uploadupBtn")
	    	}
	    	id.find(".webuploader-pick").css("width",pickwidth);
	    	if(resetwidth){
	    		var  upload_dom = options.id.find(".webuploader-pick").next();
				 var width = parseInt(upload_dom.css("width"));
				 var height = parseInt(upload_dom.css("height"));
				if(width<120){
					upload_dom.css({"width":"100%",height:"26px"})
				}
	    }
	    });
	   
	    return uploadermulti;
	}else{
		
	}
}

/**
 * 删除图片
 * @param jsonarray
 * @param type
 * @param value
 * @returns {Array}
 */
function deleteFile(jsonarray,type,value){
	var newArray= new Array();
	for(var i=0;i<jsonarray.length;i++){
		var temp;
		if(type==1){
			temp = jsonarray[i].url;
		}else if(type==0){
			temp = jsonarray[i].fid;
		}
		if(temp!=value){
			newArray.push(jsonarray[i]);
		}
	}
	return newArray;
}

Array.prototype.indexOf = function(item) { 
	for (var i = 0; i < this.length; i++) { 
	if (this[i] == item) 
	return i; 
	} 
	return -1; 
} 

function initUploadDiv(options2,file,src,data){
	var multi2;
	var jsonarray = new Array();
	var fileNumLimit = options2.fileNumLimit|| 10;//多选文件数
	var id = new Date().getTime();
	var html = '<div id="upid_'+id+'" class="filesDiv" style="clear:both;">'+
	'<div class="filesBody">'+
		'<div id="title_'+id+'" class="before_file webup-hidden">'+
			'<span>上传的文件将在这里显示</span>'+
		'</div>'+
		'<ul class="allFile">'+
		'</ul>'+
	'</div>'+
	'<div class="filesBottom">'+
		'<div class="message">'+
			'<span class="erroMessage webup-hidden" >上传失败</span>'+
			'<span class="successMessage">已上传<font class="countnum">0</font>/'+fileNumLimit+'张</span>'+
		'</div>'+
		'<div class="filesBtns">'+
			'<div class=""><span class="mulit-btnAdd">添加文件</span></div>'+
			'<div class=""><span class="mulit-btnDone">完成</span></div>'+
			'<div class="webup-hidden"><span class="mulit-btnDoing ">上传中，请稍等</span></div>'+
		'</div>'+
	'</div>'+
	'</div>';
	var success = options2.success || function(){};//成功
	var dh = $(window).height();
	var updialog = dialog({
		height: "auto",
		isClickShade: false,
		top: (dh-500)/2,
		fixed: false,
		init: function(){
			options2.addhover=false;
			options2.auto=true;
			options2.id=$("#upid_"+id+" .mulit-btnAdd");
			options2.label="添加文件";
			options2.pickwidth="80px";
			options2.fileAdd=function(file,src){
				var imgdom;
				
				if(src=="-1"){
					src = "不能预览";
					imgdom =  $('<li>'+
								'<div class="imgFile">'+
								'<img src="/common/plugins/webuploader-0.1.5/images/bg.png" />'+
								'<div class="fileBefore " id="'+file.id+'"><span>&nbsp;&nbsp;排队中</span></div>'+
								'</div>'+
							'</li>');
				}else{
					imgdom =  $('<li>'+
								'<div class="imgFile">'+
								'<img src="'+src+'" />'+
								'<div class="fileBefore " id="'+file.id+'"><span>&nbsp;&nbsp;排队中</span></div>'+
								'</div>'+
							'</li>');
				}
				
				var n = $("#upid_"+id+" .fileSuccess").length+$("#upid_"+id+" .fileBefore").length;
				if(n<fileNumLimit){
					$("#upid_"+id+" .allFile").append(imgdom);
					var dom = $("#upid_"+id+" #"+file.id);
						addcancelUpload(dom);
						startupload();
				}else{
					multi2.removeFile(file);
					options2.error("最多上传"+n+"个文件")
				}
				if(!$("#title_"+id).hasClass("webup-hidden")){
					$("#title_"+id).addClass("webup-hidden");
				}
			}
			
			var addcancelUpload=function(dom){
				/**	 **/
				dom.append("<span class='cancelupload webup-hidden'>&nbsp;&nbsp;取消上传</span>");
				var divspan = dom.children().eq(1);
				divspan.on("click",null,function(){
					if(file){
						multi2.removeFile(file);
						//multi2.reset();
					}
					dom.parent().parent().remove();
					
					var processing = $(".cancelupload");
					if(processing && processing.length==0){
						compeleteupload();
					}
					
					if($("#upid_"+id+" ul li").length==0){
						$("#title_"+id).removeClass("webup-hidden");
					}
					
				});
				
				dom.on("mouseover",null,function(){
					   divspan.removeClass("webup-hidden");
					   divspan.prev().addClass("webup-hidden")
				});
				
				dom.on("mouseout",function(){
					  divspan.addClass("webup-hidden");
					  divspan.prev().removeClass("webup-hidden")
				 })
			
			}
			var startupload=function(){
				$("#upid_"+id+" .filesBtns").children().eq(1).addClass("webup-hidden");
				$("#upid_"+id+" .filesBtns").children().eq(2).removeClass("webup-hidden");
			}
			var compeleteupload = function(){
				$("#upid_"+id+" .filesBtns").children().eq(1).removeClass("webup-hidden");
				$("#upid_"+id+" .filesBtns").children().eq(2).addClass("webup-hidden");
			}
			
			options2.process=function(fid,p,file){
				var dom = $("#upid_"+id+" #"+fid);
				if(dom && dom.html()){
					dom.children().eq(0).text("上传中("+p+")");
				}
			}
			
			options2.successupload=function(fid,response){
				//$("#upid_"+id+" #"+fid).prev().attr("src",response.url);
				var fileDom = $("#upid_"+id+" #"+fid);
				var successlen = $("#upid_"+id+" .success-span").length;
				if(fileDom && fileDom.html()){
						if(successlen<fileNumLimit){
							fileDom.removeClass("fileBefore").removeClass("fileFail").addClass("fileSuccess");
							fileDom.html("<span class='success-span'>已上传</span>");
							fileDom.append("<span class='delspan webup-hidden'>删除</span>");
							if(response.success){
								$("#upid_"+id+" .countnum").text($("#upid_"+id+" .fileSuccess").length);
								jsonarray.push(response);
								deleteli($("#upid_"+id+" ul li"));
							}
						}else{
							fileDom.parent().remove();
						}
				}else{
				}
				var processing = $(".cancelupload");
				if(processing && processing.length==0){
					compeleteupload();
				}
			}
			
			
			//edit
			options2.complete=compeleteupload;
			//edit
			options2.error=function(message,file){
				if(message && message.indexOf("Unknown")>1){
					message = "上传失败";
				}
				$("#upid_"+id+" .message").children().eq(0).html("&nbsp;&nbsp;&nbsp;&nbsp;"+message).removeClass("webup-hidden");
				if(file){
					var fid = file.id;
					var thisdom = $("#upid_"+id+" #"+fid);
					var htmlreset = '<div>上传失败</div><div><span>重试</span>|<span>删除</span></div>';
					thisdom.removeClass("fileBefore").addClass("fileFail");
					thisdom.html(htmlreset);
					$("#upid_"+id+" #"+fid+" span:eq(0)").on("click",null,function(){
						thisdom.html("<span>&nbsp;&nbsp;排队中</span>")
						thisdom.removeClass("fileFail").addClass("fileBefore");
						addcancelUpload(thisdom);
						startupload();
						multi2.retry(file);
					});
					
					$("#upid_"+id+" #"+fid+" span:eq(1)").on("click",null,function(){
						var deletedom = $(this).parent().parent();
						jsonarray = deleteFile(jsonarray,0,deletedom.attr("id"));
						deletedom.parent().parent().remove();
						
						if($("#upid_"+id+" ul li").length==0){
							$("#title_"+id).removeClass("webup-hidden");
						}
					})
				}
				
				
				if($("#upid_"+id+" ul li").length==0){
					$("#title_"+id).removeClass("webup-hidden");
				}
				
				$("#upid_"+id+" .successMessage").addClass("webup-hidden");
				setTimeout(function() {
					$("#upid_"+id+" .message").children().eq(0).html(message).addClass("webup-hidden");
					$("#upid_"+id+" .successMessage").removeClass("webup-hidden");
    		   },3000);
				
				var processing = $(".cancelupload");
				if(processing && processing.length==0){
					compeleteupload();
				}
			}
			
			
			var deleteli=function(lis){
				lis.each(function(i,ele){
						var divspan = $(this).children().eq(0).find(".fileSuccess");
						$(this).on("mouseover",null,function(){
							    divspan.removeClass("fileSuccess").addClass("fileDelete");
							    divspan.find(".success-span").addClass("webup-hidden");
							    divspan.find(".delspan").removeClass("webup-hidden");
					 }).on("mouseout",function(){
						 divspan.removeClass("fileDelete").addClass("fileSuccess");
						 divspan.find(".success-span").removeClass("webup-hidden");
						 divspan.find(".delspan").addClass("webup-hidden");
					 })
					 
					 divspan.find(".delspan").on("click",null,function(){
									jsonarray = deleteFile(jsonarray,0, divspan.attr("id"));
									$(ele).remove();
									$("#upid_"+id+" .countnum").text($("#upid_"+id+" .fileSuccess").length);
									
									if($("#upid_"+id+" ul li").length==0){
										$("#title_"+id).removeClass("webup-hidden");
									}
					})
				 });
			 
		 
		}
			
			multi2=uploadmulti(options2);
			if(file){
				multi2.addFile(file);
			}
			$(".mulit-btnDone").on("click",null,function(){
				updialog.close();
			})
			if(data && data.length>0){
				var imgarray = new Array("JPG","PNG","JPEG","GIF")
				for(var i=0;i<data.length;i++){
					var imgdom;
					var src = data[i].url;
					var fid = data[i].fid;
					if(!fid){
						fid = "img-"+new Date().getTime();
						if(data[i].id){
							fid = fid+data[i].id;
						}else{
							fid = fid+Math.floor(Math.random()*10000+1);
						}
						data[i].fid=fid;
					}
					var ext = src.substring(src.lastIndexOf(".")+1).toUpperCase();
					if(imgarray.indexOf(ext)==-1){
						imgdom =  '<li>'+
									'<div class="imgFile">'+
									'<img src="/common/plugins/webuploader-0.1.5/images/bg.png" />'+
									'<div class="fileSuccess" id="'+fid+'"><span class="success-span">已上传</span><span class="delspan webup-hidden">删除</span></div>'+
									'</div>'+
								'</li>';
					}else{
						imgdom =  '<li>'+
									'<div class="imgFile">'+
									'<img src="'+src+'" height="90"/>'+
									'<div class="fileSuccess" id="'+fid+'"><span class="success-span">已上传</span><span class="delspan webup-hidden">删除</span></div>'+
									'</div>'+
								'</li>';
					}
					$("#upid_"+id+" .allFile").append(imgdom);
					
					 var jsonmessage = {};
					 jsonmessage.url=data[i].url;
					 jsonmessage.fileName=data[i].name;
					 jsonmessage.name=data[i].name;
					 jsonmessage.size=data[i].size;
					 jsonmessage.width=data[i].width;
					 jsonmessage.height=data[i].height;
					 jsonmessage.id=fid;
					 data[i].message = JSON.stringify(jsonmessage);
				}
				deleteli($("#upid_"+id+" ul li"));
				$("#upid_"+id+" .countnum").text($("#upid_"+id+" .fileSuccess").length);
				jsonarray = data;
			}
			
		},
		close: function() {
			options2.uploadChange(jsonarray);
			success(jsonarray)
		},
		content: html,
		zIndex: 201
	});
	return multi2;
}


function webUpload(options){
	//alert(options.multifile)
	if(options.multifile){
			var rtnmulit;
			var showFileCount = options.showFileCount || false;
			options.addhover=true;
			var optionsnew = $.extend({}, options);
			var multi2;
			var oldhtml = options.id.html();
			var parent = options.id.parent();
			var poldhtml = parent.html();
			var label = options.label;
			optionsnew.uploadChange=function(response){
				optionsnew.data = response;
				multi2 = null;
				if(response.length>0){
					optionsnew.haschange=true;
					parent.html(poldhtml);
					var updom = parent.children().eq(0);
					if(showFileCount){
						updom.html(optionsnew.changetext+"("+response.length+")");
					}else{
						updom.html(optionsnew.changetext)
					}
					updom.on("click",null,function(){
						initUploadDiv(optionsnew,null,null,optionsnew.data);
					})
					updom.addClass("muiti-uploadupBtn")
					updom.css("cursor","pointer")
					
				}else{
					if(optionsnew.haschange){
						parent.html(poldhtml);
						parent.children().eq(0).html(oldhtml)
						options.accept = optionsnew.accept;
						options.id = parent.children().eq(0);
						options.data=null;
						optionsnew.haschange=null;
						webUpload(options);
					}
				}
			}
		
			if(options.data && options.data.length>0){
				if(showFileCount){
					options.id.html(optionsnew.changetext+"("+options.data.length+")");
				}else{
					options.id.html(optionsnew.changetext);
				}
			
				var updom = parent.children().eq(0);
				updom.addClass("muiti-uploadupBtn")
				updom.css("cursor","pointer");

				options.id.on("click",null,function(){
					optionsnew.haschange = true;
					initUploadDiv(optionsnew,null,null,optionsnew.data);
				})
				
			}else{
				options.fileAdd=function(file,src){
					if(multi2){
						multi2.addFile(file,src);
					}else{
						multi2 = initUploadDiv(optionsnew,file,src)
					};
					rtnmulit.reset();
				}
				
				options.error=function(text,file){
					if(multi2){
					}else{
						multi2 = initUploadDiv(optionsnew)
					};
					optionsnew.error(text,file);
				}
				options.auto=false;
				//options.accept=null;
				rtnmulit = uploadmulti(options);
				return rtnmulit;
			}
	}else{

		return uploaderSingle(options);
	}
}



function dialog(options){
	var api, wrap, init = options.init,
	close = options.close, defaults = {
	        title: false,
	        fixed: true,
	        lock: true,
	        minWidth: 120,
	        padding: "0px 0px",
	        content:"加载中...",
	        init: function(here){
	        	if($(".aui_close").attr("href")){
	        		$(".aui_close").removeAttr("href");
	        	}
	            api = this;
	            wrap = api.DOM.wrap;
	            wrap.find('.aui_content').css({
	                    'min-width':'120px',
	                    'text-align': 'center'
	            });
	            wrap.find('.aui_footer').css({
                    'height':'auto'
	            });
	            wrap.find('.aui_main').css({
	            	'padding-top': '0px'
	            });
	            init && init();
	        },
	        close: function(){
	        	wrap.find('.aui_content').removeAttr("style");
	        	wrap.find('.aui_main').removeAttr("style");
	        	wrap.find('.aui_footer').removeAttr("style");
	        	close && close();
	        },
	        isClose: true	
	}, _tourPlanDialog = artDialog.get('tourPlanDialog');
	if (_tourPlanDialog) {
		_tourPlanDialog.close();
	}
	options.init = undefined;
	options.close = undefined;
	_tourPlanDialog = $.dialog($.extend(defaults, options));
	return _tourPlanDialog;
}

var system_json = [
            {"kind":"cover","message":"图片不符合要求，请上传2mb以内jpg/png图片，长宽比为1~2之间"},
            {"kind":"recbig","message":"图片不符合要求，请上传2mb以内jpg/png图片，尺寸880*480"},
            {"kind":"recsmall","message":"图片不符合要求，请上传2mb以内jpg/png图片，尺寸270*160"},
            {"kind":"sitebar","message":"图片不符合要求，请上传2mb以内jpg/png图片，尺寸270*380"},
            {"kind":"siterecbig","message":"图片不符合要求，请上传2mb以内jpg/png图片，尺寸1920*500"},
            {"kind":"siterecsmall","message":"图片不符合要求，请上传2mb以内jpg/png图片，尺寸370*210"},
            {"kind":"sitebg","message":"图片不符合要求，请上传2mb以内jpg/png图片，尺寸750*1134"},
            {"kind":"s_recommend_index","message":"图片不符合要求，请上传2mb以内jpg/png图片，尺寸750*1134"},
            {"kind":"sitehot","message":"图片不符合要求，请上传2mb以内jpg/png图片，尺寸750*300"},
            {"kind":"s_cover","message":"图片不符合要求，请上传2mb以内jpg/png图片，最佳尺寸:宽470高353"},
            {"kind":"s_editor","message":"图片不符合要求，请上传2mb以内jpg/png的方形、长方形图片"},
            {"kind":"d_cover","message":"图片不符合要求，请上传2mb以内jpg/png图片，最佳尺寸:宽470高353"},
            {"kind":"d_editor","message":"图片不符合要求，请上传2mb以内jpg/png的方形、长方形图片"},
            {"kind":"d_sitebg","message":"图片尺寸不符合要求，请上传2MB指定尺寸的jpg/png图片"},
            {"kind":"radio11","message":"为确保最佳效果，请上传2mb以内jpg/png的正方形图片"},
            {"kind":"s_brightspot","message":"图片不符合要求，请上传2mb以内jpg/png图片，宽度在870以内效果最佳"},
            {"kind":"d_advertisement_pc","message":"图片不符合要求，请上传2mb以内jpg/png图片，尺寸1920*100"},
            {"kind":"d_advertisement_m","message":"图片不符合要求，请上传2mb以内jpg/png图片，尺寸750*400"}
            
];

function getSystemKindMessage(code,options){
	var message = "图片不符合要求，请上传2mb以内jpg/png图片";
	if(options && options.formData && options.formData.compareType && options.formData.compareType!="")
		var kind = options.formData.compareType;
		if(kind && kind=="radio" && options.formData.minRadio && options.formData.maxRadio){
			kind = kind+options.formData.minRadio+options.formData.maxRadio;
		}
		if(kind){
			$.each(system_json,function(index,e){
				if(kind==e.kind){
					message = e.message;
					return false;
				}
			})
		}
	return message;
}

function getWebUploadMessage(code,options,assign){
if(code=="Q_EXCEED_SIZE_LIMIT"){
		code = "F_EXCEED_SIZE";
}
 switch(code) {
 	case 'SIZE0':
	    	text = "上传文件不能为空";
	    	break;
     case 'exceed_size':
         text = '文件大小超出限制!';
         break;
    case 'F_EXCEED_SIZE':
 	   if(options){
 		   if(options.accept && options.accept.extensions ){
 			   var extensions = options.accept.extensions;
 			   var title = options.accept.title || "文件";
 			   text = '限'+(options.fileSingleSizeLimit/1024/1024)+"MB以内"+extensions+title;
 		   }else if(assign){
 			   text = '限'+(options.fileSingleSizeLimit/1024/1024)+"MB以内JPG,PNG图片";
 		   }else{
 			   text = '文件大小超出限制!';
 		   }
 	   }else{
 		   text = '文件大小超出限制!';
 	   }
         break;
    case 'Q_TYPE_DENIED':
 	   if(options && options.accept && options.accept.extensions && options.accept.extensions!=""){
 		   var extensions = options.accept.extensions;
 		   text = '限'+(options.fileSingleSizeLimit/1024/1024)+"MB以内"+extensions+"文件";
 	   }else{
 		 text = '文件类型不正确!';
 	   }
        break;
     case 'interrupt':
         text = '上传暂停';
         break;
     case 'Q_EXCEED_NUM_LIMIT':
     	 if(options){
   		   		text = '最多上传'+options.fileNumLimit+"个文件";
   		   }else{
   			   text = "上传文件超出限制";
   		   }
     		break;
     case 'F_DUPLICATE':
     	text = "请不要重复添加相同文件";
     	break;
     case 'server':
     	text = "网络异常,请稍后重试!";
     	break;
     default:
     	if(/^[0-9a-zA-Z_-]+$/.test(code)){
     		text = '上传失败,请稍后重试!';
     	}else{
     		text = code;
     	}
         break;
	 }
 	return text;
}
