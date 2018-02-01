window.interface && alert('该对象已存在，请检查是否有同名的对象！');
window.interface = {
	this: window.interface,
	init: function(opts) {
		this.opts = $.extend({}, this.defaultOpts, opts || {});
		this._loading();
		// this._tabChange();
		this._jsonLoad();
		this._validate();
		this._proxyTipsBind();
		this._testBind();
	},
	/**
	 * 事件管理，将所有的事件绑定都放在此处
	 * @private
	 */
	_handleEvent: function() {
	},
	/**
	 * 默认参数，将所有默认参数都放在此处
	 */
	defaultOpts: {
		//arguments
		//.....
	},
	// _tabChange: function() {
	//     // $('#interfaceTabs a').click(function(e) {
	//     //     e.preventDefault()
	//     //     if ($('#interfaceForm').validationEngine('validate')) {
	//     //         $(this).tab('show')
	//     //     }
	//     // })
	// },
	_jsonLoad: function() {
		$('.jsoneditor').load(function() {
			var toObj = $(this).attr('data-obj')
			$(this)[0].contentWindow.setJson(jsonEditorData[toObj]);
		})
	},
	/**
	 * 内部使用的函数
	 * @private
	 */
	_loading: function() {
		$.LoadingOverlay("show");
		$(window).load(function() {
			$.LoadingOverlay("hide");
		});
	},
	_validate: function() {
		var interfaceForm = $('#interfaceForm'),
			_this = this,
			focusTimeout = null, firstErrorFiled;
		interfaceForm.validationEngine({
			validateNonVisibleFields: true, onFieldFailure: function(filed) {
				console.log(filed);
				if (!firstErrorFiled) {
					firstErrorFiled = filed;
					setTimeout(function() {
						if (firstErrorFiled) {
							var index = _this._getGroup('#' + firstErrorFiled.attr('id'));
							if (index !== undefined) {
								$('#interfaceTabs >li >a').eq(index).click();
								firstErrorFiled.focus();
							} else {
								$.commonTips('id索引不存在，请检查代码', 'danger', 3)
							}
							firstErrorFiled = null;
						}
					}, 300);
				}
			}
		});
		interfaceForm.submit(function() {
			var result = true;
			$('.jsoneditor').each(function() {
				var toObj = $(this).attr('data-obj')
				var json = $(this)[0].contentWindow.getJson();
				if (json) {
					$('#' + toObj).val(json);
				} else {
					var index = _this._getGroup('#' + toObj);
					if (index !== undefined) {
						$('#interfaceTabs >li >a').eq(index).click();
						$('#' + toObj).focus();
					} else {
						$.commonTips('id索引不存在，请检查代码', 'danger', 3)
					}
					result = false;
				}
			})
//            interfaceForm.bind('jqv.form.result', function(event, errorFound){
//
//                console.log(event);
//                console.log(errorFound)
//            });
			if (!$('#interfaceForm').validationEngine('validate')) {
				return false;
			}
			return result
		})
	},
	proxyOpenTips: function() {
		var _this = this;
		setTimeout(function() {
			var isOpen = $('.J_open_proxy input:checked').val();
			if (isOpen === '1') {
				var proxy_url = $('.proxy_prefix').val() || $('.projectProxy').val() || $('.globalProxy').val();
				var api_url = $('.api_url').val();
				$('.proxy_tips').show().html(_this.opts.LN.interface.add.proxy.openProxyTipsPrefix + '[ <span style="color: red;"> ' + proxy_url + api_url + '</span>  ]' + _this.opts.LN.interface.add.proxy.openProxyTipsPostfix);
			} else {
				$('.proxy_tips').show().html(_this.opts.LN.interface.add.proxy.closeProxyTips)
			}
		}, 20)
	},
	_proxyTipsBind: function() {
		var _this = this;
		$('.J_open_proxy label').click(function() {
			_this.proxyOpenTips()
		})
		$('.proxy_prefix,.api_url').on('change input blur', function() {
			_this.proxyOpenTips();
		})
	},
	_testBind: function() {
		$('#send_test').click(function() {
			return false;
		});
	},
	_getGroup: function(element) {
		var tabs = $('.tab-pane'), result;
		tabs.each(function() {
			if ($(this).find(element).length > 0) {
				result = tabs.index(this);
				return true;
			}
		})
		return result;
	},
	/**
	 * 相应的业务函数
	 *
	 */
	PublickFunc: function() {
	}
};