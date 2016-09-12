var isdebugging = false;//是否调试JS
var dataType = isdebugging?'text':'json';
function debugging(tobj,url,XMLHttpRequest,textStatus,errorThrown,jsfunc){
	var msg = '<table class="content_view"><tr><td width="110">Js Function:</td><td>function '+jsfunc+'(){}</td></tr>';
	msg += '<tr><td width="110">URL:</td><td>'+url+'</td></tr>';
	msg += '<tr><td>HTTP Status:</td><td>'+XMLHttpRequest.status+'</td></tr>';
	msg += '<tr><td>readyStatus:</td><td>'+XMLHttpRequest.readyState+'</td></tr>';
	msg += '<tr><td>textStatus:</td><td>'+textStatus+'</td></tr>';
	msg += '<tr><td>errorThrown:</td><td>'+errorThrown+'</td></tr>';
	tobj.title('error');
	tobj.content(msg);
}

function openDialog(url, options, flush, callback){
	var title = options.title;
	options.title = false;
	var throughBox = $.artDialog.through;
	var api, wrap, init = options.init, close = options.close, defaults = {
		isClickShade: false,
		init: function() {
			init && typeof init === 'function' && init();
		},
		close: function() {
			close && typeof close === 'function' && close();
		}
	}
	options.title = false;
	options.init = undefined;
	options.close = undefined;
	var myDialog = throughBox($.extend(defaults, options));
	$.ajax({type: "GET",url:url,dataType:'html',
		success: function (data, textStatus, jqXHR) {
			var win = $.artDialog.top;
			var loginStatus = jqXHR.getResponseHeader('sessionstatus');
			if (loginStatus === 'timeout'){
				myDialog.close();
				showmsg(win, eval("(" + data + ")"), flush ? flush : 'flush_now');
				return;
			}
			myDialog.content((title ? "<div style='border-bottom:4px solid #f2d7c2;margin: -23px -25px 0 -25px;background-color: #A5D2E1;height: 40px;line-height: 40px;padding-left: 20px;color: #fff;'><h2>"+title+"</h2></div><br/>" : '') +data);
			if (!options.isClearBtn) {
				setSubBtn(win, myDialog, flush ? flush : 'flush_now', callback);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'add');
		}
	});
	return myDialog;
}

function setSubBtn(win, tobj, flush, callback){
	tobj.button({
		name:"取消",
		callback:function(){
			$.confirm("您确认要离开此页面？","确认提示", function(){
				tobj.close();
			},function(){
			});
			return false;
		},
		cssClass: 'btn-cancel'
	},{
		name:"保存",
		callback:function(){
			if (typeof(window["setDataToArray"]) === "function") {
				setDataToArray();
			}
			if(window.Placeholders && !Placeholders.nativeSupport)
				Placeholders.disable(win.$("[id$=Form]")[0]);
			if (win.$("[id$=Form]").Validform === undefined){
				getScript("/common/plugins/validform/style.css", 'text');
				getScript("/common/plugins/validform/Validform_v5.3.2.js",'script');
			}
			var formObj = win.$("[id$=Form]").Validform({tiptype:4});
			//formObj.submitForm(false,'/');
			var url = win.$("[id$=Form]").find("#action").val();
			var subflag = formObj.getUtil().submitForm.call($(formObj.forms[0]),$(formObj.forms)[0].settings,false,url);
			subflag === undefined && (subflag=true);
			if(callback && typeof callback === 'function'){
				var callreturn = callback();
				if(!callreturn){
					return false;
				}
			}
			if(subflag===true){
				subOK(win, tobj, flush);
			}
			return false;
		},
		cssClass: 'btn-save',
		focus: true
	});
}

function getScript(url, type, callback){
	$.ajax({
		  url: url,
		  dataType: type,
		  async:false,
		  success: callback || $.noop,
		  error: function(){
			  alert(url + "未找到！")
		  }
	});
}

function subOK(win, tobj, extra){
	var formData = win.$("[id$=Form]").serialize();
	if(window.Placeholders && !Placeholders.nativeSupport)
		Placeholders.enable(win.$("[id$=Form]")[0]);
	var url = win.$("[id$=Form]").attr("action");
	var myDialog = win.$.artDialog.get('submitMsg');
	if (myDialog)
		myDialog.close();
	myDialog = win.$.artDialog({id: 'submitMsg',fixed:true,lock:true,drag:false});
	if(url){
		$.ajax({type: "POST",dataType:dataType,url: url,data: formData,
			success: function(data){
				myDialog.close();
				showmsg(tobj, data, extra);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				debugging(myDialog,url,XMLHttpRequest,textStatus,errorThrown,'subOK');
				tobj.close();
			}
		});
	}else{
		myDialog.close();
		tobj.close();
	}
}

/*
 */
function showmsg(tobj, data, extra){
	if(isdebugging){
		alert(data);return;
	}
	if (data.result.hasOwnProperty("fieldErrors")) {
		$.each(data.result.fieldErrors, function(k,v){
			$.dialog.gmMessage(v.defaultMessage, false);
		});
		return;
	}
	if (data.result.success) {
		tobj && tobj.close();
		if (extra === 'flush_now') {
			$.cookie('message', '"'+data.result.success + '_' + data.result.message + '"', {path:'/'});
			if(data.result.jumpUrl){
				window.location.href = data.result.jumpUrl;
			}else{
				reload(0);
			}
		} else {
			$.dialog.gmMessage(data.result.message, data.result.success);
		}
	} else {
		$.dialog.gmMessage(data.result.message, data.result.success);
	}
}



function reload(time) {
	setTimeout(function(){
		location.reload();
	}, time);
}