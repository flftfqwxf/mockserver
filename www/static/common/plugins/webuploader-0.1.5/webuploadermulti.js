var usewebUploader =true;
function checkSupport(){
	//alert(WebUploader.Uploader.support());
	if(usewebUploader){
		 if (!WebUploader.Uploader.support() ) {
		        alert( 'Web Uploader 不支持您的浏览器！请尝试升级 flash 播放器');
		        throw new Error( 'WebUploader does not support the browser you are using.' );
		        return false;
		   }
	}else{
		return false;
	}
	 return true;
}


function showError( code ) {
	//alert("+"+code);
    switch(code) {
        case 'exceed_size':
            text = '文件大小超出限制!';
            break;
       case 'F_EXCEED_SIZE':
            text = '文件大小超出限制!';
            break;
       case 'Q_TYPE_DENIED':
           text = '文件类型不正确!';
           break;
        case 'interrupt':
            text = '上传暂停';
            break;
        default:
            text = '上传失败,请检查文件大小及格式!';
            break;
    }
    return text;
};

function uploadMultiThumb(options){
	checkSupport();
	var jsonarray = new Array();
	var process = options.process || function(){};//进度
	var success = options.success || function(){};//成功
	var cancelsuccess = options.cancelsuccess || function(){};//成功
	var error = options.error || function(){};//失败
	var fileAdd = options.fileAdd || function(){};//进度
	var id = options.id;//DOMid
	var cancel = options.cancel;//取消
	var label = options.label||"从电脑上传";
	var auto = options.auto|| false;//自动上传
	var operateType = options.operateType||"sight";//类型
	var accept = options.accept|| null;
	var multiple = options.multiple|| false;//多选
	var fileNumLimit = options.fileNumLimit|| 5;//多选文件数
	var fileSizeLimit = options.fileSizeLimit|| 50 * 1024 * 1024;//总文件大小 
	var fileSingleSizeLimit = options.fileSingleSizeLimit|| 10 * 1024 * 1024;//单个文件大小 
	var	formData = {"operateType":operateType};
	 var $ = jQuery,    // just in case. Make sure it's not an other libaray.
     $wrap = $('#uploader'),
     // 图片容器
     $queue = $('<ul class="filelist"></ul>').appendTo( $wrap.find('.queueList') ),
     // 状态栏，包括进度和控制按钮
     $statusBar = $wrap.find('.statusBar'),
     // 文件总体选择信息。
     $info = $statusBar.find('.info'),
     // 上传按钮
     $upload = $wrap.find('.uploadBtn'),
     // 没选择文件之前的内容。
     $placeHolder = $wrap.find('.placeholder'),
     // 总体进度条
     $progress = $statusBar.find('.progress').hide(),
     // 添加的文件数量
     fileCount = 0,
     // 添加的文件总大小
     fileSize = 0,
     // 优化retina, 在retina下这个值是2
     ratio = window.devicePixelRatio || 1,
     // 缩略图大小
     thumbnailWidth = 110 * ratio,
     thumbnailHeight = 110 * ratio,
     // 可能有pedding, ready, uploading, confirm, done.
     state = 'pedding',
     // 所有文件的进度信息，key为file id
     percentages = {},

     supportTransition = (function(){
         var s = document.createElement('p').style,
             r = 'transition' in s ||
                   'WebkitTransition' in s ||
                   'MozTransition' in s ||
                   'msTransition' in s ||
                   'OTransition' in s;
         s = null;
         return r;
     })();


    uploaderMultiThump = WebUploader.create({
    	 	//swf文件路径
			pick: {
	            id: id,
	            multiple:true,
	            label: label
	        },
	        auto:false,
	        //runtimeOrder:"flash",
	        //dnd: '#uploader .queueList',
	        //paste: document.body,
	        accept:accept,
	        compress:false,
	        chunked:true,
	        formData:formData,
	        swf:'http://www.gmmtour.com/page/upload/webuploader-0.1.5/Uploader.swf',
	        // 文件接收服务端。
	        server: 'http://www.gmmtour.com/api/upload?format=json',
	        fileNumLimit: fileNumLimit,
	        fileSizeLimit: fileSizeLimit,    // 200 M
	        fileSingleSizeLimit: fileSingleSizeLimit    // 50 M
	    });


    // 当有文件添加进来时执行，负责view的创建
    function addFile( file ) {
        var $li = $( '<li id="' + file.id + '">' +
                '<p class="title">' + file.name + '</p>' +
                '<p class="imgWrap"></p>'+
                '<p class="progress"><span></span></p>' +
                '</li>' ),

            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>' +
                '<span class="rotateRight">向右旋转</span>' +
                '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find( 'p.imgWrap' ),
            $info = $('<p class="error"></p>');
            // 
        if ( file.getStatus() === 'invalid' ) {
        	$info.text(showError(file.statusText)).appendTo($li); ;
        } else {
            $wrap.text( '预览中' );
            uploaderMultiThump.makeThumb( file, function( error, src ) {
                if (error) {
                    $wrap.text( '不能预览' );
                    return;
                }
                var img = $('<img src="'+src+'">');
                $wrap.empty().append(img);
            }, thumbnailWidth, thumbnailHeight );

            percentages[ file.id ] = [ file.size, 0 ];
            file.rotation = 0;
        }

        file.on('statuschange', function( cur, prev ) {
            if ( prev === 'progress' ) {
                $prgress.hide().width(0);
            } else if ( prev === 'queued' ) {
                $li.off( 'mouseenter mouseleave' );
                $btns.remove();
            }
            // 成功
            if ( cur === 'error' || cur === 'invalid' ) {
                console.log( file.statusText );
                showError( file.statusText );
                percentages[ file.id ][ 1 ] = 1;
            } else if ( cur === 'interrupt' ) {
                showError( 'interrupt' );
            } else if ( cur === 'queued' ) {
                percentages[ file.id ][ 1 ] = 0;
            } else if ( cur === 'progress' ) {
                $info.remove();
                $prgress.css('display', 'block');
            } else if ( cur === 'complete' ) {
                $li.append( '<span class="success"></span>' );
            }

            $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
        });

        $li.on( 'mouseenter', function() {
            $btns.stop().animate({height: 30});
        });

        $li.on( 'mouseleave', function() {
            $btns.stop().animate({height: 0});
        });

        $btns.on( 'click', 'span', function() {
            var index = $(this).index(),
                deg;
            switch ( index ) {
                case 0:
                	uploaderMultiThump.removeFile( file );
                    return;
                case 1:
                    file.rotation += 90;
                    break;
                case 2:
                    file.rotation -= 90;
                    break;
            }

            if (supportTransition ) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
            }
        });

        $li.appendTo( $queue );
    }

    // 负责view的销毁
    function removeFile( file ) {
        var $li = $('#'+file.id);

        delete percentages[ file.id ];
        updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();
    }

    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each( percentages, function( k, v ) {
            total += v[ 0 ];
            loaded += v[ 0 ] * v[ 1 ];
        } );

        percent = total ? loaded / total : 0;
        spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
        spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
        updateStatus();
    }

    function updateStatus() {
        var text = '', stats;

        if ( state === 'ready' ) {
            text = '选中' + fileCount + '张图片，共' +
                    WebUploader.formatSize( fileSize ) + '。';
        } else if ( state === 'confirm' ) {
            stats = uploader.getStats();
            if ( stats.uploadFailNum ) {
                text = '已成功上传' + stats.successNum+ '张照片至XX相册，'+
                    stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
            }
        } else {
            stats = uploaderMultiThump.getStats();
            text = '共' + fileCount + '张（' +
                    WebUploader.formatSize( fileSize )  +
                    '），已上传' + stats.successNum + '张';
            if ( stats.uploadFailNum ) {
                text += '，失败' + stats.uploadFailNum + '张';
            }
        }
        $info.html( text );
    }

    function setState( val ) {
        var file, stats;
        if ( val === state ) {
            return;
        }
        $upload.removeClass( 'state-' + state );
        $upload.addClass( 'state-' + val );
        state = val;
        switch ( state ) {
            case 'pedding':
                $placeHolder.removeClass( 'element-invisible' );
                $queue.parent().removeClass('filled');
                $queue.hide();
                $statusBar.addClass( 'element-invisible' );
                uploaderMultiThump.refresh();
                break;

            case 'ready':
                $placeHolder.addClass( 'element-invisible' );
                $( '#filePicker2' ).removeClass( 'element-invisible');
                $queue.parent().addClass('filled');
                $queue.show();
                $statusBar.removeClass('element-invisible');
                uploaderMultiThump.refresh();
                break;

            case 'uploading':
                $( '#filePicker2' ).addClass( 'element-invisible' );
                $progress.show();
                $upload.text( '暂停上传' );
                break;

            case 'paused':
                $progress.show();
                $upload.text( '继续上传' );
                break;

            case 'confirm':
                $progress.hide();
                $upload.text( '开始上传' ).addClass( 'disabled' );

                stats = uploaderMultiThump.getStats();
                if ( stats.successNum && !stats.uploadFailNum ) {
                    setState( 'finish' );
                    return;
                }
                break;
            case 'finish':
                stats = uploaderMultiThump.getStats();
                if (stats.successNum ) {
                	success(jsonarray);
                	jsonarray = new Array();
                	$( '#filePicker2' ).removeClass('element-invisible');
                	state = 'pedding';
                	$upload.removeClass("disabled");
                } else {
                    // 没有成功的图片，重设
                    state = 'done';
                    location.reload();
                }
                break;
        }

        updateStatus();
    }

    uploaderMultiThump.onUploadProgress = function( file, percentage ) {
        var $li = $('#'+file.id),
            $percent = $li.find('.progress span');
        //alert(percentage);
        $percent.css( 'width', percentage * 100 + '%' );
        percentages[ file.id ][ 1 ] = percentage;
        updateTotalProgress();
    };

    uploaderMultiThump.onFileQueued = function( file ) {
        fileCount++;
        fileSize += file.size;
        if ( fileCount === 1 ) {
            $placeHolder.addClass( 'element-invisible' );
            $statusBar.show();
        }

        addFile( file );
        setState( 'ready' );
        updateTotalProgress();
    };

    uploaderMultiThump.onFileDequeued = function( file ) {
        fileCount--;
        fileSize -= file.size;

        if ( !fileCount ) {
            setState( 'pedding' );
        }
        removeFile( file );
        updateTotalProgress();

    };

    uploaderMultiThump.on( 'all', function( type ) {
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

    uploaderMultiThump.onError = function( code ) {
        error(showError(code));
    };

    uploaderMultiThump.on( 'uploadSuccess', function( file,response ) {
    	if(response.success){
    		jsonarray.push(response);
    	}else{
    		alert(response.message);
    	}
    });

    
    $upload.on('click', function() {
        if ( $(this).hasClass( 'disabled' ) ) {
            return false;
        }
        if ( state === 'ready' ) {
        	uploaderMultiThump.upload();
        } else if ( state === 'paused' ) {
        	uploaderMultiThump.upload();
        } else if ( state === 'uploading' ) {
        	uploaderMultiThump.stop(true);
        }
    });

    $info.on( 'click', '.retry', function() {
    	uploaderMultiThump.retry();
    } );

    $info.on( 'click', '.ignore', function() {
        alert( 'todo' );
    } );

    $upload.addClass( 'state-' + state );
    updateTotalProgress();
   

}

/**
 * 多文件上传
 * @param pick 控件容器
 * @param doing 进度元素
 * @param call 上传成功后回调
 */
function uploadmulti(options){
	checkSupport();
	var jsonarray = new Array();
	var process = options.process || function(){};//进度
	var success = options.success || function(){};//成功
	var cancelsuccess = options.cancelsuccess || function(){};//成功
	var error = options.error || function(){};//失败
	var fileAdd = options.fileAdd || function(){};//进度
	var id = options.id;//DOMid
	var cancel = options.cancel;//取消
	var label = options.label||"从电脑上传";
	var auto = options.auto|| false;//自动上传
	var operateType = options.operateType||"sight";//类型
	var accept = options.accept|| null;
	var multiple = options.multiple|| false;//多选
	var fileNumLimit = options.fileNumLimit|| 5;//多选文件数
	var fileSizeLimit = options.fileSizeLimit|| 50 * 1024 * 1024;//总文件大小 
	var fileSingleSizeLimit = options.fileSingleSizeLimit|| 10 * 1024 * 1024;//单个文件大小 
	var	formData = {"operateType":operateType};
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
	        swf:'http://www.gmmtour.com/page/upload/webuploader-0.1.5/Uploader.swf',
	        // 文件接收服务端。
	        server: 'http://www.gmmtour.com/api/upload?format=json',
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
                showError( 'interrupt' );
            } else if ( cur === 'queued' ) {
                percentages[ file.id ][ 1 ] = 0;
            } else if ( cur === 'progress' ) {
            } else if ( cur === 'complete' ) {
            }

        });
        
        uploadermulti.makeThumb(file, function(error,src ) {
            if (error) {
                src = '不能预览' ;
            }
            fileAdd(src);
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
        process(percent);
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
                    		success(jsonarray);
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
        updateTotalProgress();
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
    	var text = showError(code);
		error(text);
    };

    uploadermulti.on( 'uploadSuccess', function( file,response ) {
    	if(response.success){
    		jsonarray.push(response);
    	}
    });
    uploadermulti.on( 'uploadComplete', function( file ) {
    	typeof options.uploadComplete === 'function' && options.uploadComplete();
    });

    return uploadermulti;
}

function upload(options){
	checkSupport();
	var process = options.process || function(){};//进度
	var success = options.success || function(){};//成功
	var cancelsuccess = options.cancelsuccess || function(){};//成功
	var error = options.error || function(){};//失败
	var id = options.id;//DOMid
	var cancel = options.cancel;//取消
	var label = options.label||"从电脑上传";
	var auto = options.auto|| true;//自动上传
	var operateType = options.operateType||"sight";//类型
	var accept = options.accept||{};
	var multiple = options.multiple|| false;//多选
	var fileNumLimit = options.fileNumLimit|| 5;//多选文件数
	var fileSizeLimit = options.fileSizeLimit|| 50 * 1024 * 1024;//总文件大小 
	var fileSingleSizeLimit = options.fileSingleSizeLimit|| 10 * 1024 * 1024;//单个文件大小 
	var	formData = {"operateType":operateType};
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
			        /** 
			        accept: {
			            title: 'Images',
			            extensions: 'JPG,PNG',
			            mimeTypes: 'image/*'
			        },
			        **/
			        //accept:accept,
			        compress:false,
			        chunked:true,
			        formData:formData,
			        swf:'http://www.gmmtour.com/page/upload/webuploader-0.1.5/Uploader.swf',
			        // 文件接收服务端。
			        server: 'http://www.gmmtour.com/api/upload?format=json',
			        fileNumLimit: fileNumLimit,
			        fileSizeLimit: fileSizeLimit,    // 200 M
			        fileSingleSizeLimit: fileSingleSizeLimit    // 50 M
			    });
 	
			  // 当有文件添加进来的时候
			uploader.on('fileQueued', function( file ) {
			    	if ( file.getStatus() === 'invalid' ) {
			            showError( file.statusText );
			        }else{
			        }
			    });
			    
			uploader.on('uploadProgress', function( file, percentage ) {
				
					var percent = Math.round(percentage * 100) + '%' ;
					if(percent=="100%"){
						percent="99%";
					}
					process(percent);
			 });

			uploader.on('uploadSuccess', function(file,response) {
			    	// alert("上传成功"+response.url+"--"+response.message)
					uploader.reset();
					if (response.success) {
							 if(options.messagejson){
								 var jsonmessage = {};
								 jsonmessage.url=response.url;
								 jsonmessage.fileName=response.name;
								 jsonmessage.name=response.name;
								 jsonmessage.size=response.size;
								 jsonmessage.width=response.width;
								 jsonmessage.height=response.height;
								 response.message = JSON.stringify(jsonmessage);
							 }
							success(response);
					}else{
						error(response.message);
					}
			    });
			
			uploader.on('uploadError', function( file,reason ) {
				error(reason);
			 });
			
			uploader.on('error', function(code,reason ) {
				var text = showError(code);
				error(text);
			 });
			
			uploader.on( 'uploadComplete', function( file ) {
		    	
		    });
		    
		    if(cancel){
		    	cancel.on("click",function(){
		    		uploader.stop(true);
		    		uploader.reset();
		    		cancelsuccess();
		    	})
		    }
		    
		    //调整位置
		    if(options.positionable){
		    	 setTimeout(function() {
					 	$(id+".webuploader-container").css("position","relative");
						$(id+".webuploader-container").children().eq(1).css("top","0").css("left","0")
	    		 },1000);
		    }
}
