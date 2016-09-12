(function($, w) {


	String.prototype.template = function(json) {
		var s = this;
		for (var v in json) {
			s = s.replace(/{(\w+)}/g, function(w) {
				var s = w.substring(1, w.length - 1);
				return json[s] || ""
			});
		}
		return s;  
	}
 

	var HTML_DECODE = {
		"&lt;": "<",
		"&gt;": ">",
		"&amp;": "&",
		"&nbsp;": " ",
		"&quot;": "\"",
		"&copy;": "©"
	};
	var utils = {
		tmpl: function(tpl, data) {
			$.each(data, function(k, v) {
				tpl = tpl.replace(/{{(\w+)}}/g, function(w) {
					var s = w.substring(1, w.length - 1);
					return data[s] || ""
				})
			})
			return tpl;
		},
		importModule: function(js) {
			$.ajax({
				url: "/theme/blue/js/" + js + ".js",
				dataType: "script",
				async: false,
				success: $.noop,
				error: function(d) {
					$.gmMessage(js + "未找到！", false);
				}
			});
		},
		getUrlParam: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
		},
		decodeHtml: function(s) {
			return (typeof s != "string") ? s :
				s.replace(/&\w+;|&#(\d+);/g,
					function($0, $1) {
						var c = HTML_DECODE[$0];
						if (c === undefined) {
							if (!isNaN($1)) {
								c = String.fromCharCode(($1 == 160) ? 32 : $1);
							} else {
								c = $0;
							}
						}
						return c;
					});
		},
		getValue: function(jsonObj, key) {
			try {
				return jsonObj[key];
			} catch (e) {}
		},
		showError: function($tar, msg, pos) {
			var viewport = $('#page-content-viewport');

			// 当所有绑定在form上的验证通过时再滚动
			if (!$('.error').length) {
				// 容器内滚动时，实际相对容器的偏移量等于offset().top +　容器的滚动条的便宜　　180：顶部fix的高度 +　微调
				viewport.animate({
					scrollTop: $tar.offset().top + viewport.scrollTop() - 180
				}, function() {
					$tar.validationEngine('showPrompt', msg, 'error', pos, true);
				});
			} else {
				$tar.validationEngine('showPrompt', msg, 'error', pos, true);
			}
		},
		vaildDatas: function(obj) {
			if (window.Placeholders && !window.Placeholders.nativeSupport)
				window.Placeholders.disable(Tour.current.docForm);

			var valid = Tour.current.form.validationEngine('validate');
			if (!valid) {
				window.Placeholders.enable(Tour.current.docForm);
				return false;
			}
			valid = checkUEditor(obj);
			Placeholders.enable(Tour.current.docForm);
			return valid;
		},
		//			setIndex : function(){
		//				var pname,idx;
		//				this.each(function(){
		//					idx = 0;
		//					$("[pname]",this).each(function(i){
		//						var n = $(this).attr("pname");
		//						if(n != pname){
		//							idx = 0;
		//						}
		//						pname = n;
		//						$(this).attr("index",++idx);
		//					})
		//				})
		//			},
		getFormJson: function($form) {
			//				if(!utils.vaildDatas()) return false;

			//				$("textarea",this).each(function(){
			//					if($(this).is(":hidden")){
			//						var max = $(this).attr("maxlength") || 2000;
			//						var $tar = $(this).prev("div.edui-default");
			//						if($tar.is(":visible")){
			//							var editor = UE.getEditor($tar.attr("id"));
			//							if(editor.getContentLength(true)>max){
			//								utils.showError($tar,"* 最多 "+max+" 个字符");
			//								valid = false;
			//								return false;
			//							}
			//						}
			//					}else if($(this).attr("maxlength")){
			//						if($(this).val().length>$(this).attr("maxlength")){
			//							utils.showError($(this),"* 最多 "+max+" 个字符");
			//							valid = false;
			//							return false;
			//						}
			//					}
			//				})
			//				if(!valid)
			//					return false;

			var tag_name = "data-name";
			var tag_name_pattern = "[data-name]";
			var tag_index = "data-index";
			var tag_type = "data-type";
			var tag_disable = "data-disable";
			var data = {};
			var node = data;
			$(":input[name]").each(function() {
				var input = $(this);
				//					if (input.attr(tag_disable)) {
				//						return;
				//					}
				var parents = input.parents(tag_name_pattern);
				for (var i = parents.length - 1; i >= 0; i--) {

					var pdom = $(parents[i]);
					var pname = pdom.attr(tag_name);
					if (pdom.attr(tag_disable)) {
						delete node[pname];
						return;
					}
					if (!node[pname]) {
						node[pname] = pdom.attr(tag_type) == "array" ? [] : {};
					}

					if (pdom.attr(tag_type) == "array") {
						if (pdom.attr(tag_index)) {
							node = node[pname][pdom.attr(tag_index)];
						} else {
							var nextIdx = node[pname].length;
							pdom.attr(tag_index, nextIdx);
							var d = {};
							node[pname].push(d);
							node = d;
						}

					} else {
						node = node[pname];
					}
				}


				var key = input.attr("name");
				if (input.attr(tag_disable)) {
					delete node[pname];
				} else {
					var v = input.val();
					//jquery val 获取为字符串.当value == "0" 时候.转化成0
					node[key] = v == "0" ? 0 : v;
				}
				//重置
				node = data;

			});
			$("[data-type][data-index]").removeAttr(tag_index);

			if (window.Placeholders && !Placeholders.nativeSupport)
				Placeholders.enable(Tour.current.docForm);
			return data;
		},
		//			getFormData: function($form){
		//				var valid = $form.validationEngine('validate');
		//				$("textarea",this).each(function(){
		//					if($(this).is(":hidden")){
		//						var max = $(this).attr("maxlength") || 2000;
		//						var $tar = $(this).prev("div.edui-default");
		//						if($tar.is(":visible")){
		//							var editor = UE.getEditor($tar.attr("id"));
		//							if(editor.getContentLength(true)>max){
		//								utils.showError($tar,"* 最多 "+max+" 个字符");
		//								valid = false;
		//								return false;
		//							}
		//						}
		//					}else if($(this).attr("maxlength")){
		//						if($(this).val().length>$(this).attr("maxlength")){
		//							utils.showError($(this),"* 最多 "+max+" 个字符");
		//							valid = false;
		//							return false;
		//						}
		//					}
		//				})
		//				if(!valid)
		//					return false;
		//
		//				if(window.Placeholders && !Placeholders.nativeSupport)
		//					Placeholders.disable($form);
		//				var data = [], add = !utils.getUrlParam("id");
		//				$(this).find(":input[name]").each(function(){
		//					var $t = $(this);
		//					if($t.is(":hidden")){
		//						if($t.is(":radio,:checkbox,select,:text"))
		//							return;
		//						if($t.is("textarea")){
		//							var $tar = $(this).prev("div.edui-default");
		//							if(!$tar.is(":visible")){
		//								return;
		//							}
		//						}
		//					}
		//					if($t.is(":radio,:checkbox") && !this.checked)
		//						return;
		//					var $p = $t.parents("[pname]");
		//					var n = $t.attr("name");
		//					if(n.indexOf("-")>0){
		//						n = n.replace(/-(\d){13}/,"");
		//					}
		//					$p.each(function(){
		//						n = $(this).attr("pname")+"["+($(this).attr("index")-1)+"]."+n;
		//					})
		//					if(Product.sys && add && n == "id")
		//						return;
		//					data.push({name:n,value:this.value});
		//				})
		//				if(window.Placeholders && !Placeholders.nativeSupport)
		//					Placeholders.enable($form[0]);
		//				return data;
		//			},
		initAutocomplete: function(input, option, callback, resultcallback,focCallback,blurCallback) {

			if (typeof input === "string")
				input = $(input);
			input.autocomplete("/" + input.attr("ac_url") + ".json?_=" + Math.random(), $.extend({
				minChars: 0,
				clickFire: true,
				requestParamName: option.param || "keyword",
				showOthers: false,
				pagination: true,
				hotType: null,
				focCallback: focCallback,
				blurCallback: blurCallback,
				width: (input.width() > 0) ? input.width() : "100%",
				extraParams: {
					lineId: option.lineId || "",
					size: 100,
					count: 100
				},
				parse: function(data) {
	
					if (resultcallback && typeof resultcallback === "function") {
						resultcallback.call(input, data);
					}
					var parsed = [];
					var rows = $.isArray(data) ? data : data.list;
					if (rows && rows.length) {
						for (var i = 0; i < rows.length; i++) {
							var row = rows[i];
							parsed.push({
								data: row,
								value: row.name,
								result: row.name
							});
						}
					}
					return parsed;
				},
				formatItem: function(row, i, max) {
					if (!row.name)
						return "";
					return row.name;
				}
			}, option)).result(callback || $.noop);
		},
		//航班的东西
		searchFlight: function(flightNumber, success) {

			$.ajax({
				type: "GET",
				url: "/flight.json",
				data: {
					code: flightNumber
				},
				dataType: "json",
				success: success
			});



		},
		jsonToInput: function(json, p) {
			var data = [];
			$.each(json, function(k, v) {
				if (v == null)
					return;
				var o = {}, n = (p ? (p + ".") : "") + k.replace("_", ".");
				if ($.isArray(v)) {
					$.each(v, function(i) {
						data = data.concat(jsonToInput(this, n + "[" + i + "]"))
					})
				} else if ($.isPlainObject(v)) {
					data = data.concat(jsonToInput(this, n))
				} else {
					o.name = n;
					o.value = v;
					data.push(o);
				}
			});
			return data;
		}
	}

	w.Tour = w.Tour || {};
	w.Tour.utils = w.Tour.utils || {};
	$.extend(w.Tour.utils, utils);
})(jQuery, window)