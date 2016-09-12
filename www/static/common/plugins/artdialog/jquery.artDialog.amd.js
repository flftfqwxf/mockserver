/*!
 * artDialog 4.1.7
 * Date: 2013-03-03 08:04
 * http://code.google.com/p/artdialog/
 * (c) 2009-2012 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */




//------------------------------------------------
// 对话框模块
//------------------------------------------------
define(["jquery"],function(){
	;(function ($, window, undefined) {

		$.noop = $.noop || function () {}; // jQuery 1.3.2
		var _box, _thisScript, _skin, _path,
			_count = 0,
			_$window = $(window),
			_$document = $(document),
			_$html = $('html'),
			_elem = document.documentElement,
			_isIE6 = window.VBArray && !window.XMLHttpRequest,
			_isMobile = 'createTouch' in document && !('onmousemove' in _elem)
				|| /(iPhone|iPad|iPod)/i.test(navigator.userAgent),
			_expando = 'artDialog' + + new Date;

		var artDialog = function (config, ok, cancel) {
			config = config || {};
			
			if (typeof config === 'string' || config.nodeType === 1) {
				config = {content: config, fixed: !_isMobile};
			};
			
			var api,
				defaults = artDialog.defaults,
				elem = config.follow = this.nodeType === 1 && this || config.follow;
			
			// 合并默认配置
			for (var i in defaults) {
				if (config[i] === undefined) config[i] = defaults[i];		
			};
			// 兼容v4.1.0之前的参数，未来版本将删除此
			$.each({ok:"yesFn",cancel:"noFn",close:"closeFn",init:"initFn",okVal:"yesText",cancelVal:"noText"},
			function(i,o){config[i]=config[i]!==undefined?config[i]:config[o]});
			
			// 返回跟随模式或重复定义的ID
			if (typeof elem === 'string') elem = $(elem)[0];
			config.id = elem && elem[_expando + 'follow'] || config.id || _expando + _count;
			api = artDialog.list[config.id];
			if (elem && api) return api.follow(elem).zIndex().focus();
			if (api) return api.zIndex().focus();
			
			// 目前主流移动设备对fixed支持不好
			if (_isMobile) config.fixed = false;
			
			// 按钮队列
			if (!$.isArray(config.button)) {
				config.button = config.button ? [config.button] : [];
			};
			if (ok !== undefined) config.ok = ok;
			if (cancel !== undefined) config.cancel = cancel;
			config.cancel && config.button.push({
				name: config.cancelVal,
				//add by wuxing at 2015-02-27
				cssClass: config.cancelCssClass,
				callback: config.cancel,
				focus: true
			});
			
			config.ok && config.button.push({
				name: config.okVal,
				//add by wuxing at 2015-02-27
				cssClass: config.okCssClass,
				callback: config.ok
			});
			
			// zIndex全局配置
			artDialog.defaults.zIndex = config.zIndex;
			
			_count ++;
			
			return artDialog.list[config.id] = _box ?
				_box._init(config) : new artDialog.fn._init(config);
		};

		artDialog.fn = artDialog.prototype = {

			version: '4.1.7',
			
			closed: true,
			
			_init: function (config) {
				var that = this, DOM,
					icon = config.icon,
					iconBg = icon && (_isIE6 ? {png: 'icons/' + icon + '.png'}
					: {backgroundImage: 'url(\'' + config.path + '/theme/icons/' + icon + '.png\')'});
				
		        that.closed = false;
				that.config = config;
				that.DOM = DOM = that.DOM || that._getDOM();
				
				DOM.wrap.addClass(config.skin);
				//add by at 2015-02-27 是否外边框游阴影
				if (!config.isOuterBoxShadow) {
					DOM.outer.css('box-shadow','none');
				}
				DOM.close[config.isClose === false ? 'hide' : 'show']();
				DOM.icon[0].style.display = icon ? '' : 'none';
				DOM.iconBg.css(iconBg || {background: 'none'});
				DOM.se.css('cursor', config.resize ? 'se-resize' : 'auto');
				DOM.title.css('cursor', config.drag ? 'move' : 'auto');
				DOM.content.css('padding', config.padding);
				
				that[config.show ? 'show' : 'hide'](true)
				that.button(config.button)
				.title(config.title)
				.content(config.content, true)
				.size(config.width, config.height)
				.time(config.time);
				
				config.follow
				? that.follow(config.follow)
				: that.position(config.left, config.top);
				
				that.zIndex().focus();
				config.lock && that.lock();
				
				that._addEvent();
				that._ie6PngFix();
				_box = null;
				
				config.init && config.init.call(that, window);
				if (!config.isNotScroll) {
					DOM.wrap.find(".aui_content").css({
						maxHeight: $(window).height() * 0.8,
					// 	 //  overflow: 'auto',
					// 	 // 'overflow-x': 'hidden'

					});
				}
				return that;
			},
			
			/**
			 * 设置内容
			 * @param	{String, HTMLElement}	内容 (可选)
			 * @return	{this, HTMLElement}		如果无参数则返回内容容器DOM对象
			 */
			content: function (msg) {
				var prev, next, parent, display,
					that = this,
					DOM = that.DOM,
					wrap = DOM.wrap[0],
					width = wrap.offsetWidth,
					height = wrap.offsetHeight,
					left = parseInt(wrap.style.left),
					top = parseInt(wrap.style.top),
					cssWidth = wrap.style.width,
					$content = DOM.content,
					content = $content[0];
				
				that._elemBack && that._elemBack();
				wrap.style.width = 'auto';
				
				if (msg === undefined) return content;
				if (typeof msg === 'string') {
					$content.html(msg);
				} else if (msg && msg.nodeType === 1) {
				
					// 让传入的元素在对话框关闭后可以返回到原来的地方
					display = msg.style.display;
					prev = msg.previousSibling;
					next = msg.nextSibling;
					parent = msg.parentNode;
					that._elemBack = function () {
						if (prev && prev.parentNode) {
							prev.parentNode.insertBefore(msg, prev.nextSibling);
						} else if (next && next.parentNode) {
							next.parentNode.insertBefore(msg, next);
						} else if (parent) {
							parent.appendChild(msg);
						};
						msg.style.display = display;
						that._elemBack = null;
					};
					
					$content.html('');
					content.appendChild(msg);
					msg.style.display = 'block';
					
				};
				
				// 新增内容后调整位置
				if (!arguments[1]) {
					if (that && that.config && that.config.follow) {
						that.follow(that.config.follow);
					} else {
						width = wrap.offsetWidth - width;
						height = wrap.offsetHeight - height;
						left = left - width / 2;
						top = top - height / 2;
						wrap.style.left = Math.max(left, 0) + 'px';
						wrap.style.top = Math.max(top, 0) + 'px';
					};
					if (cssWidth && cssWidth !== 'auto') {
						wrap.style.width = wrap.offsetWidth + 'px';
					};
					that._autoPositionType();
				};
				
				that._ie6SelectFix();
				that._runScript(content);
				
				return that;
			},
			
			/**
			 * 设置标题
			 * @param	{String, Boolean}	标题内容. 为false则隐藏标题栏
			 * @return	{this, HTMLElement}	如果无参数则返回内容器DOM对象
			 */
			title: function (text) {
				var DOM = this.DOM,
					wrap = DOM.wrap,
					title = DOM.title,
					className = 'aui_state_noTitle';
				if (text === undefined) return title[0];
				if (text === false) {
					title.hide().html('');
					wrap.addClass(className);
					DOM.buttons.css({'margin':0});
				} else {
					title.show().html(text || '');
					wrap.removeClass(className);
				};
				
				return this;
			},
			
			/**
			 * 位置(相对于可视区域)
			 * @param	{Number, String}
			 * @param	{Number, String}
			 */
			position: function (left, top) {
				var that = this,
					config = that.config,
					wrap = that.DOM.wrap[0],
					isFixed = _isIE6 ? false : config.fixed,
					ie6Fixed = _isIE6 && that.config.fixed,
					docLeft = _$document.scrollLeft(),
					docTop = _$document.scrollTop(),
					dl = isFixed ? 0 : docLeft,
					dt = isFixed ? 0 : docTop,
					ww = _$window.width(),
					wh = _$window.height(),
					ow = wrap.offsetWidth,
					oh = wrap.offsetHeight,
					style = wrap.style;
				
				if (left || left === 0) {
					that._left = left.toString().indexOf('%') !== -1 ? left : null;
					left = that._toNumber(left, ww - ow);
					
					if (typeof left === 'number') {
						left = ie6Fixed ? (left += docLeft) : left + dl;
						style.left = Math.max(left, dl) + 'px';
					} else if (typeof left === 'string') {
						style.left = left;
					};
				};
				
				if (top || top === 0) {
					that._top = top.toString().indexOf('%') !== -1 ? top : null;
					top = that._toNumber(top, wh - oh);
					
					if (typeof top === 'number') {
						top = ie6Fixed ? (top += docTop) : top + dt;
						style.top = Math.max(top, dt) + 'px';
					} else if (typeof top === 'string') {
						style.top = top;
					};
				};
				
				if (left !== undefined && top !== undefined) {
					that._follow = null;
					that._autoPositionType();
				};
				
				return that;
			},

			/**
			 *	尺寸
			 *	@param	{Number, String}	宽度
			 *	@param	{Number, String}	高度
			 */
			size: function (width, height) {
				var maxWidth, maxHeight, scaleWidth, scaleHeight,
					that = this,
					config = that.config,
					DOM = that.DOM,
					wrap = DOM.wrap,
					main = DOM.main,
					wrapStyle = wrap[0].style,
					style = main[0].style;
					
				if (width) {
					that._width = width.toString().indexOf('%') !== -1 ? width : null;
					maxWidth = _$window.width() - wrap[0].offsetWidth + main[0].offsetWidth;
					scaleWidth = that._toNumber(width, maxWidth);
					width = scaleWidth;
					main.css('min-width',that.config.minWidth);
					if (typeof width === 'number') {
						wrapStyle.width = 'auto';
						style.width = Math.max(that.config.minWidth, width) + 'px';
						wrapStyle.width = wrap[0].offsetWidth + 'px'; // 防止未定义宽度的表格遇到浏览器右边边界伸缩
					} else if (typeof width === 'string') {
						style.width = width;
						width === 'auto' && wrap.css('width', 'auto');
					};
				};
				
				if (height) {
					that._height = height.toString().indexOf('%') !== -1 ? height : null;
					maxHeight = _$window.height() - wrap[0].offsetHeight + main[0].offsetHeight;
					scaleHeight = that._toNumber(height, maxHeight);
					height = scaleHeight;
					main.css('min-height',that.config.minHeight);
					if (typeof height === 'number') {
						style.height = Math.max(that.config.minHeight, height) + 'px';
					} else if (typeof height === 'string') {
						style.height = height;
						height === 'auto' && wrap.css('height', 'auto');
					};
				};
				
				that._ie6SelectFix();
				
				return that;
			},
			
			/**
			 * 跟随元素
			 * @param	{HTMLElement, String}
			 */
			follow: function (elem) {
				var $elem, that = this, config = that.config;
				
				if (typeof elem === 'string' || elem && elem.nodeType === 1) {
					$elem = $(elem);
					elem = $elem[0];
				};
				
				// 隐藏元素不可用
				if (!elem || !elem.offsetWidth && !elem.offsetHeight) {
					return that.position(that._left, that._top);
				};
				
				var expando = _expando + 'follow',
					winWidth = _$window.width(),
					winHeight = _$window.height(),
					docLeft =  _$document.scrollLeft(),
					docTop = _$document.scrollTop(),
					offset = $elem.offset(),
					width = elem.offsetWidth,
					height = elem.offsetHeight,
					isFixed = _isIE6 ? false : config.fixed,
					left = isFixed ? offset.left - docLeft : offset.left,
					top = isFixed ? offset.top - docTop : offset.top,
					wrap = that.DOM.wrap[0],
					style = wrap.style,
					wrapWidth = wrap.offsetWidth,
					wrapHeight = wrap.offsetHeight,
					setLeft = left - (wrapWidth - width) / 2,
					setTop = top + height,
					dl = isFixed ? 0 : docLeft,
					dt = isFixed ? 0 : docTop;
				
				setLeft = setLeft < dl ? left :
				(setLeft + wrapWidth > winWidth) && (left - wrapWidth > dl)
				? left - wrapWidth + width
				: setLeft;

				setTop = (setTop + wrapHeight > winHeight + dt)
				&& (top - wrapHeight > dt)
				? top - wrapHeight
				: setTop;
				
				style.left = setLeft + 'px';
				style.top = setTop + 'px';
				
				that._follow && that._follow.removeAttribute(expando);
				that._follow = elem;
				elem[expando] = config.id;
				that._autoPositionType();
				return that;
			},
			
			/**
			 * 自定义按钮
			 * @example
				button({
					name: 'login',
					callback: function () {},
					disabled: false,
					cssClass: '',
					focus: true
				}, .., ..)
			 */
			button: function () {
				var that = this,
					ags = arguments,
					DOM = that.DOM,
					buttons = DOM.buttons,
					elem = buttons[0],
					strongButton = 'aui_state_highlight',
					listeners = that._listeners = that._listeners || {},
					list = $.isArray(ags[0]) ? ags[0] : [].slice.call(ags);
				
				if (ags[0] === undefined) return elem;
				$.each(list, function (i, val) {
					var name = val.name,
						isNewButton = !listeners[name],
						button = !isNewButton ?
							listeners[name].elem :
							document.createElement('button');
							
					if (!listeners[name]) listeners[name] = {};
					if (val.callback) listeners[name].callback = val.callback;
					if (val.className) button.className = val.className;
					//添加自定义css样式类 add by 伍兴 2015-02-27
		            if (val.cssClass) {
		                $(button).addClass(val.cssClass);
		            }
					if (val.focus) {
						that._focus && that._focus.removeClass(strongButton);
						that._focus = $(button).addClass(strongButton);
						that.focus();
					};
					
					// Internet Explorer 的默认类型是 "button"，
					// 而其他浏览器中（包括 W3C 规范）的默认值是 "submit"
					// @see http://www.w3school.com.cn/tags/att_button_type.asp
					button.setAttribute('type', 'button');
					
					button[_expando + 'callback'] = name;
					button.disabled = !!val.disabled;

					if (isNewButton) {
						button.innerHTML = name;
						listeners[name].elem = button;
						elem.appendChild(button);
					};
				});
				
				buttons[0].style.display = list.length ? '' : 'none';
				
				that._ie6SelectFix();
				return that;
			},
			
			/** 显示对话框 */
			show: function () {
				this.DOM.wrap.show();
				!arguments[0] && this._lockMaskWrap && this._lockMaskWrap.show();
				return this;
			},
			
			/** 隐藏对话框 */
			hide: function () {
				this.DOM.wrap.hide();
				!arguments[0] && this._lockMaskWrap && this._lockMaskWrap.hide();
				return this;
			},
			
			/** 关闭对话框 */
			close: function () {
				if (this.closed) return this;
				
				var that = this,
					DOM = that.DOM,
					wrap = DOM.wrap,
					list = artDialog.list,
					fn = that.config.close,
					follow = that.config.follow;
				that.time();
				//artDialog.defaults.zIndex --;
				if (typeof fn === 'function' && fn.call(that, window) === false) {
					return that;
				};
				
				that.unlock();
				
				// 置空内容
				that._elemBack && that._elemBack();
				wrap[0].className = wrap[0].style.cssText = '';
				DOM.title.html('');
				DOM.content.html('');
				DOM.buttons.html('');
				
				if (artDialog.focus === that) artDialog.focus = null;
				if (follow) follow.removeAttribute(_expando + 'follow');
				delete list[that.config.id];
				that._removeEvent();
				that.hide(true)._setAbsolute();
				// 清空除this.DOM之外临时对象，恢复到初始状态，以便使用单例模式
				for (var i in that) {
					if (that.hasOwnProperty(i) && i !== 'DOM') delete that[i];
				};
				
				// 移除HTMLElement或重用
				_box ? wrap.remove() : _box = that;
				return that;
			},
			
			/**
			 * 定时关闭
			 * @param	{Number}	单位为秒, 无参数则停止计时器
			 */
			time: function (second) {
				var that = this,
					cancel = that.config.cancelVal,
					timer = that._timer;
					
				timer && clearTimeout(timer);
				
				if (second) {
					that._timer = setTimeout(function(){
						that._click(cancel);
					}, 1000 * second);
				};
				
				return that;
			},
			
			/** 设置焦点 */
			focus: function () {
				try {
					if (this.config.focus) {
						var elem = this._focus && this._focus[0] || this.DOM.close[0];
						elem && elem.focus();
					}
				} catch (e) {}; // IE对不可见元素设置焦点会报错
				return this;
			},
			
			/** 置顶对话框 */
			zIndex: function () {
				var that = this,
					DOM = that.DOM,
					wrap = DOM.wrap,
					top = artDialog.focus,
					index = artDialog.defaults.zIndex ++;
				// 设置叠加高度
				wrap.css('zIndex', index);
				that._lockMask && that._lockMask.css('zIndex', index - 1);
				
				// 设置最高层的样式
				top && top.DOM.wrap.removeClass('aui_state_focus');
				artDialog.focus = that;
				wrap.addClass('aui_state_focus');
				
				return that;
			},
			
			/** 设置屏锁 */
			lock: function () {
				if (this._lock) return this;
				
				var that = this,
					index = artDialog.defaults.zIndex - 1,
					wrap = that.DOM.wrap,
					config = that.config,
					docWidth = _$document.width(),
					docHeight = _$document.height(),
					lockMaskWrap = that._lockMaskWrap || $(document.body.appendChild(document.createElement('div'))),
					lockMask = that._lockMask || $(lockMaskWrap[0].appendChild(document.createElement('div'))),
					domTxt = '(document).documentElement',
					sizeCss = _isMobile ? 'width:' + docWidth + 'px;height:' + docHeight
						+ 'px' : 'width:100%;height:100%',
					ie6Css = _isIE6 ?
						'position:absolute;left:expression(' + domTxt + '.scrollLeft);top:expression('
						+ domTxt + '.scrollTop);width:expression(' + domTxt
						+ '.clientWidth);height:expression(' + domTxt + '.clientHeight)'
					: '';
				
				that.zIndex();
				wrap.addClass('aui_state_lock');
				
				lockMaskWrap[0].style.cssText = sizeCss + ';position:fixed;z-index:'
					+ index + ';top:0;left:0;overflow:hidden;' + ie6Css;
				lockMask[0].style.cssText = 'height:100%;background:' + config.background
					+ ';filter:alpha(opacity=0);opacity:0';
				
				// 让IE6锁屏遮罩能够盖住下拉控件
				if (_isIE6) lockMask.html(
					'<iframe src="about:blank" style="width:100%;height:100%;position:absolute;' +
					'top:0;left:0;z-index:-1;filter:alpha(opacity=0)"></iframe>');
					
				lockMask.stop();
				lockMask.bind('click', function () {
					if(that.config.isClickShade){
						that._reset();
					}
				}).bind('dblclick', function () {
					if(that.config.isClickShade){
						that._click(that.config.cancelVal);
					}
				});
				
				if (config.duration === 0) {
					lockMask.css({opacity: config.opacity});
				} else {
					lockMask.animate({opacity: config.opacity}, config.duration);
				};
				
				that._lockMaskWrap = lockMaskWrap;
				that._lockMask = lockMask;
				
				that._lock = true;
				return that;
			},
			
			/** 解开屏锁 */
			unlock: function () {
				artDialog.defaults.zIndex --;
				var that = this,
					lockMaskWrap = that._lockMaskWrap,
					lockMask = that._lockMask;
				
				if (!that._lock) return that;
				var style = lockMaskWrap[0].style;
				var un = function () {
					if (_isIE6) {
						style.removeExpression('width');
						style.removeExpression('height');
						style.removeExpression('left');
						style.removeExpression('top');
					};
					style.cssText = 'display:none';
					
					_box && lockMaskWrap.remove();
				};
				
				lockMask.stop().unbind();
				that.DOM.wrap.removeClass('aui_state_lock');
				if (!that.config.duration) {// 取消动画，快速关闭
					un();
				} else {
					lockMask.animate({opacity: 0}, that.config.duration, un);
				};
				
				that._lock = false;
				return that;
			},
			
			// 获取元素
			_getDOM: function () {	
				var wrap = document.createElement('div'),
					body = document.body;
				wrap.style.cssText = 'position:absolute;left:0;top:0';
				wrap.innerHTML = artDialog._templates;
				body.insertBefore(wrap, body.firstChild);
				
				var name, i = 0,
					DOM = {wrap: $(wrap)},
					els = wrap.getElementsByTagName('*'),
					elsLen = els.length;
					
				for (; i < elsLen; i ++) {
					name = els[i].className.split('aui_')[1];
					if (name) DOM[name] = $(els[i]);
				};
				
				return DOM;
			},
			
			// px与%单位转换成数值 (百分比单位按照最大值换算)
			// 其他的单位返回原值
			_toNumber: function (thisValue, maxValue) {
				if (!thisValue && thisValue !== 0 || typeof thisValue === 'number') {
					return thisValue;
				};
				
				var last = thisValue.length - 1;
				if (thisValue.lastIndexOf('px') === last) {
					thisValue = parseInt(thisValue);
				} else if (thisValue.lastIndexOf('%') === last) {
					thisValue = parseInt(maxValue * thisValue.split('%')[0] / 100);
				};
				
				return thisValue;
			},
			
			// 让IE6 CSS支持PNG背景
			_ie6PngFix: _isIE6 ? function () {
				var i = 0, elem, png, pngPath, runtimeStyle,
					path = artDialog.defaults.path + '/theme/',
					list = this.DOM.wrap[0].getElementsByTagName('*');
				
				for (; i < list.length; i ++) {
					elem = list[i];
					png = elem.currentStyle['png'];
					if (png) {
						pngPath = path + png;
						runtimeStyle = elem.runtimeStyle;
						runtimeStyle.backgroundImage = 'none';
						runtimeStyle.filter = "progid:DXImageTransform.Microsoft." +
							"AlphaImageLoader(src='" + pngPath + "',sizingMethod='crop')";
					};
				};
			} : $.noop,
			
			// 强制覆盖IE6下拉控件
			_ie6SelectFix: _isIE6 ? function () {
				var $wrap = this.DOM.wrap,
					wrap = $wrap[0],
					expando = _expando + 'iframeMask',
					iframe = $wrap[expando],
					width = wrap.offsetWidth,
					height = wrap.offsetHeight;

				width = width + 'px';
				height = height + 'px';
				if (iframe) {
					iframe.style.width = width;
					iframe.style.height = height;
				} else {
					iframe = wrap.appendChild(document.createElement('iframe'));
					$wrap[expando] = iframe;
					iframe.src = 'about:blank';
					iframe.style.cssText = 'position:absolute;z-index:-1;left:0;top:0;'
					+ 'filter:alpha(opacity=0);width:' + width + ';height:' + height;
				};
			} : $.noop,
			
			// 解析HTML片段中自定义类型脚本，其this指向artDialog内部
			// <script type="text/dialog">/* [code] */</script>
			_runScript: function (elem) {
				var fun, i = 0, n = 0,
					tags = elem.getElementsByTagName('script'),
					length = tags.length,
					script = [];
					
				for (; i < length; i ++) {
					if (tags[i].type === 'text/dialog') {
						script[n] = tags[i].innerHTML;
						n ++;
					};
				};
				
				if (script.length) {
					script = script.join('');
					fun = new Function(script);
					fun.call(this);
				};
			},
			
			// 自动切换定位类型
			_autoPositionType: function () {
				this[this.config && this.config.fixed ? '_setFixed' : '_setAbsolute']();/////////////
			},
			
			
			// 设置静止定位
			// IE6 Fixed @see: http://www.planeart.cn/?p=877
			_setFixed: (function () {
				_isIE6 && $(function () {
					var bg = 'backgroundAttachment';
					if (_$html.css(bg) !== 'fixed' && $('body').css(bg) !== 'fixed') {
						_$html.css({
							zoom: 1,// 避免偶尔出现body背景图片异常的情况
							backgroundImage: 'url(about:blank)',
							backgroundAttachment: 'fixed'
						});
					};
				});
				
				return function () {
					var $elem = this.DOM.wrap,
						style = $elem[0].style;
					
					if (_isIE6) {
						var left = parseInt($elem.css('left')),
							top = parseInt($elem.css('top')),
							sLeft = _$document.scrollLeft(),
							sTop = _$document.scrollTop(),
							txt = '(document.documentElement)';
						
						this._setAbsolute();
						style.setExpression('left', 'eval(' + txt + '.scrollLeft + '
							+ (left - sLeft) + ') + "px"');
						style.setExpression('top', 'eval(' + txt + '.scrollTop + '
							+ (top - sTop) + ') + "px"');
					} else {
						style.position = 'fixed';
					};
				};
			}()),
			
			// 设置绝对定位
			_setAbsolute: function () {
				var style = this.DOM.wrap[0].style;
					
				if (_isIE6) {
					style.removeExpression('left');
					style.removeExpression('top');
				};

				style.position = 'absolute';
			},
			
			// 按钮回调函数触发
			_click: function (name) {
				var that = this,
					fn = that._listeners[name] && that._listeners[name].callback;
				return typeof fn !== 'function' || fn.call(that, window) !== false ?
					that.close() : that;
			},
			
			// 重置位置与尺寸
			_reset: function (test) {
				var newSize,
					that = this,
					oldSize = that._winSize || _$window.width() * _$window.height(),
					elem = that._follow,
					width = that._width,
					height = that._height,
					left = that._left,
					top = that._top;
				
				if (test) {
					// IE6~7 window.onresize bug
					newSize = that._winSize =  _$window.width() * _$window.height();
					if (oldSize === newSize) return;
				};
				
				if (width || height) that.size(width, height);
				
				if (elem) {
					that.follow(elem);
				} else if (left || top) {
					that.position(left, top);
				};
			},
			
			// 事件代理
			_addEvent: function () {
				var resizeTimer,
					that = this,
					config = that.config,
					isIE = 'CollectGarbage' in window,
					DOM = that.DOM;
				
				// 窗口调节事件
				that._winResize = function () {
					resizeTimer && clearTimeout(resizeTimer);
					resizeTimer = setTimeout(function () {
						that._reset(isIE);
					}, 40);
				};
				_$window.bind('resize', that._winResize);
				
				// 监听点击
				DOM.wrap
				.bind('click', function (event) {
					var target = event.target, callbackID;
					
					if (target.disabled) return false; // IE BUG
					
					if (target === DOM.close[0]) {
						that._click(config.cancelVal);
						return false;
					} else {
						callbackID = target[_expando + 'callback'];
						callbackID && that._click(callbackID);
					};
					
					that._ie6SelectFix();
				})
				.bind('mousedown', function () {
					//注释掉，避免z-index无限叠加
					//that.zIndex();
				});
			},
			
			// 卸载事件代理
			_removeEvent: function () {
				var that = this,
					DOM = that.DOM;
				
				DOM.wrap.unbind();
				_$window.unbind('resize', that._winResize);
			}
			
		};

		artDialog.fn._init.prototype = artDialog.fn;
		$.fn.artDialog = function () {//$.fn.dialog confict with jquery ui 
			var config = arguments;
			this[this.live ? 'live' : 'bind']('click', function () {
				artDialog.apply(this, config);
				return false;
			});
			return this;
		};



		/** 最顶层的对话框API */
		artDialog.focus = null;


		/** 获取某对话框API */
		artDialog.get = function (id) {
			return id === undefined
			? artDialog.list
			: artDialog.list[id];
		};

		artDialog.list = {};



		// 全局快捷键
		_$document.bind('keydown', function (event) {
			var target = event.target,
				nodeName = target.nodeName,
				rinput = /^INPUT|TEXTAREA$/,
				api = artDialog.focus,
				keyCode = event.keyCode;

			if (!api || !api.config.esc || rinput.test(nodeName)) return;
				
			keyCode === 27 && api._click(api.config.cancelVal);
		});



		// 获取artDialog路径
		_path = window['_artDialog_path'] || (function (script, i, me) {
			for (i in script) {
				// 如果通过第三方脚本加载器加载本文件，请保证文件名含有"artDialog"字符
				if (script[i].src && script[i].src.indexOf('artDialog') !== -1) me = script[i];
			};
			
			_thisScript = me || script[script.length - 1];
			me = _thisScript.src.replace(/\\/g, '/');
			return me.lastIndexOf('/') < 0 ? '.' : me.substring(0, me.lastIndexOf('/'));
		}(document.getElementsByTagName('script')));



		// 无阻塞载入CSS (如"artDialog.js?skin=aero")
		_skin = _thisScript.src.split('skin=')[1];
		if (_skin) {
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = _path + '/theme/' + _skin + '.css?' + artDialog.fn.version;
			_thisScript.parentNode.insertBefore(link, _thisScript);
		};
		var linkCommon = document.createElement('link');
		linkCommon.rel = 'stylesheet';
		linkCommon.href = _path + '/theme/common.css?' + artDialog.fn.version;
		_thisScript.parentNode.insertBefore(linkCommon, _thisScript);


		// 触发浏览器预先缓存背景图片
		_$window.bind('load', function () {
			setTimeout(function () {
				if (_count) return;
				//artDialog({left: '-9999em',time: 9,fixed: false,lock: false,focus: false});
			}, 150);
		});



		// 开启IE6 CSS背景图片缓存
		try {
			document.execCommand('BackgroundImageCache', false, true);
		} catch (e) {};




		// 使用uglifyjs压缩能够预先处理"+"号合并字符串
		// uglifyjs: http://marijnhaverbeke.nl/uglifyjs
		artDialog._templates =
		'<div class="aui_outer">'
		+	'<table class="aui_border">'
		+		'<tbody>'
		+			'<tr>'
		+				'<td class="aui_nw"></td>'
		+				'<td class="aui_n"></td>'
		+				'<td class="aui_ne"></td>'
		+			'</tr>'
		+			'<tr>'
		+				'<td class="aui_w"></td>'
		+				'<td class="aui_c">'
		+					'<div class="aui_inner">'
		+					'<table class="aui_dialog">'
		+						'<tbody>'
		+							'<tr>'
		+								'<td colspan="2" class="aui_header">'
		+									'<div class="aui_titleBar">'
		+										'<div class="aui_title"></div>'
		+										'<a class="aui_close" href="javascript:/*artDialog*/;">'
		+											'\xd7'
		+										'</a>'
		+									'</div>'
		+								'</td>'
		+							'</tr>'
		+							'<tr>'
		+								'<td class="aui_icon">'
		+									'<div class="aui_iconBg"></div>'
		+								'</td>'
		+								'<td class="aui_main">'
		+									'<div class="aui_content"></div>'
		+								'</td>'
		+							'</tr>'
		+							'<tr>'
		+								'<td colspan="2" class="aui_footer">'
		+									'<div class="aui_buttons"></div>'
		+								'</td>'
		+							'</tr>'
		+						'</tbody>'
		+					'</table>'
		+					'</div>'
		+				'</td>'
		+				'<td class="aui_e"></td>'
		+			'</tr>'
		+			'<tr>'
		+				'<td class="aui_sw"></td>'
		+				'<td class="aui_s"></td>'
		+				'<td class="aui_se"></td>'
		+			'</tr>'
		+		'</tbody>'
		+	'</table>'
		+'</div>';



		/**
		 * 默认配置
		 */
		artDialog.defaults = {
										// 消息内容
			content: '<div class="aui_loading"><span>loading..</span></div>',
			title: '\u6d88\u606f',		// 标题. 默认'消息'
			button: null,				// 自定义按钮
			ok: null,					// 确定按钮回调函数
			cancel: null,				// 取消按钮回调函数
			init: null,					// 对话框初始化后执行的函数
			close: null,				// 对话框关闭前执行的函数
			okVal: '\u786E\u5B9A',		// 确定按钮文本. 默认'确定'
			cancelVal: '\u53D6\u6D88',	// 取消按钮文本. 默认'取消'
			//add by wuxing at 2015-02-27
			okCssClass: '',				// 确认按钮class
			cancelCssClass: '',			// 取消按钮class
			isOuterBoxShadow: true,		// 是否外边框加阴影
			isClose: true,				// 是否显示右上角的关闭按钮
			isClickShade: false,			// 是否允许单/双击遮罩层退出
			//end add
			width: 'auto',				// 内容宽度
			height: 'auto',				// 内容高度
			minWidth: 96,				// 最小宽度限制
			minHeight: 32,				// 最小高度限制
			padding: '20px',		// 内容与边界填充距离
			skin: '',					// 皮肤名(预留接口,尚未实现)
			icon: null,					// 消息图标名称
			time: null,					// 自动关闭时间(单位秒)
			esc: true,					// 是否支持Esc键关闭
			focus: true,				// 是否支持对话框按钮自动聚焦
			show: true,					// 初始化后是否显示对话框
			follow: null,				// 跟随某元素(即让对话框在元素附近弹出)
			path: _path,				// artDialog路径
			lock: false,				// 是否锁屏
			background: '#000',			// 遮罩颜色
			opacity: .7,				// 遮罩透明度
			duration: 300,				// 遮罩透明度渐变动画速度
			fixed: false,				// 是否静止定位
			left: '50%',				// X轴坐标
			top: '38.2%',				// Y轴坐标
			zIndex: 101,				// 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
			resize: true,				// 是否允许用户调节尺寸
			drag: true					// 是否允许用户拖动位置
			
		};

		this.artDialog = window.artDialog = $.dialog = $.artDialog = artDialog;
		}(this.art || jQuery && (this.art = jQuery), this));






		//------------------------------------------------
		// 对话框模块-拖拽支持（可选外置模块）
		//------------------------------------------------
		;(function ($) {

		var _dragEvent, _use,
			_$window = $(window),
			_$document = $(document),
			_elem = document.documentElement,
			_isIE6 = !('minWidth' in _elem.style),
			_isLosecapture = 'onlosecapture' in _elem,
			_isSetCapture = 'setCapture' in _elem;

		// 拖拽事件
		artDialog.dragEvent = function () {
			var that = this,
				proxy = function (name) {
					var fn = that[name];
					that[name] = function () {
						return fn.apply(that, arguments);
					};
				};
				
			proxy('start');
			proxy('move');
			proxy('end');
		};

		artDialog.dragEvent.prototype = {

			// 开始拖拽
			onstart: $.noop,
			start: function (event) {
				_$document
				.bind('mousemove', this.move)
				.bind('mouseup', this.end);
					
				this._sClientX = event.clientX;
				this._sClientY = event.clientY;
				this.onstart(event.clientX, event.clientY);

				return false;
			},
			
			// 正在拖拽
			onmove: $.noop,
			move: function (event) {		
				this._mClientX = event.clientX;
				this._mClientY = event.clientY;
				this.onmove(
					event.clientX - this._sClientX,
					event.clientY - this._sClientY
				);
				
				return false;
			},
			
			// 结束拖拽
			onend: $.noop,
			end: function (event) {
				_$document
				.unbind('mousemove', this.move)
				.unbind('mouseup', this.end);
				
				this.onend(event.clientX, event.clientY);
				return false;
			}
			
		};

		_use = function (event) {
			var limit, startWidth, startHeight, startLeft, startTop, isResize,
				api = artDialog.focus,
				//config = api.config,
				DOM = api.DOM,
				wrap = DOM.wrap,
				title = DOM.title,
				main = DOM.main;

			// 清除文本选择
			var clsSelect = 'getSelection' in window ? function () {
				window.getSelection().removeAllRanges();
			} : function () {
				try {
					document.selection.empty();
				} catch (e) {};
			};
			
			// 对话框准备拖动
			_dragEvent.onstart = function (x, y) {
				if (isResize) {
					startWidth = main[0].offsetWidth;
					startHeight = main[0].offsetHeight;
				} else {
					startLeft = wrap[0].offsetLeft;
					startTop = wrap[0].offsetTop;
				};
				
				_$document.bind('dblclick', _dragEvent.end);
				!_isIE6 && _isLosecapture ?
					title.bind('losecapture', _dragEvent.end) :
					_$window.bind('blur', _dragEvent.end);
				_isSetCapture && title[0].setCapture();
				
				wrap.addClass('aui_state_drag');
				api.focus();
			};
			
			// 对话框拖动进行中
			_dragEvent.onmove = function (x, y) {
				if (isResize) {
					var wrapStyle = wrap[0].style,
						style = main[0].style,
						width = x + startWidth,
						height = y + startHeight;
					
					wrapStyle.width = 'auto';
					style.width = Math.max(0, width) + 'px';
					wrapStyle.width = wrap[0].offsetWidth + 'px';
					
					style.height = Math.max(0, height) + 'px';
					
				} else {
					var style = wrap[0].style,
						left = Math.max(limit.minX, Math.min(limit.maxX, x + startLeft)),
						top = Math.max(limit.minY, Math.min(limit.maxY, y + startTop));

					style.left = left  + 'px';
					style.top = top + 'px';
				};
					
				clsSelect();
				api._ie6SelectFix();
			};
			
			// 对话框拖动结束
			_dragEvent.onend = function (x, y) {
				_$document.unbind('dblclick', _dragEvent.end);
				!_isIE6 && _isLosecapture ?
					title.unbind('losecapture', _dragEvent.end) :
					_$window.unbind('blur', _dragEvent.end);
				_isSetCapture && title[0].releaseCapture();
				
				_isIE6 && !api.closed && api._autoPositionType();
				
				wrap.removeClass('aui_state_drag');
			};
			
			isResize = event.target === DOM.se[0] ? true : false;
			limit = (function () {
				var maxX, maxY,
					wrap = api.DOM.wrap[0],
					fixed = wrap.style.position === 'fixed',
					ow = wrap.offsetWidth,
					oh = wrap.offsetHeight,
					ww = _$window.width(),
					wh = _$window.height(),
					dl = fixed ? 0 : _$document.scrollLeft(),
					dt = fixed ? 0 : _$document.scrollTop(),
					
				// 坐标最大值限制
				maxX = ww - ow + dl;
				maxY = wh - oh + dt;
				
				return {
					minX: dl,
					minY: dt,
					maxX: maxX,
					maxY: maxY
				};
			})();
			
			_dragEvent.start(event);
		};

		// 代理 mousedown 事件触发对话框拖动
		_$document.bind('mousedown', function (event) {
			var api = artDialog.focus;
			if (!api) return;

			var target = event.target,
				config = api.config,
				DOM = api.DOM;
			
			if (config.drag !== false && target === DOM.title[0]
			|| config.resize !== false && target === DOM.se[0]) {
				_dragEvent = _dragEvent || new artDialog.dragEvent();
				_use(event);
				return false;// 防止firefox与chrome滚屏
			};
		});

		})(this.art || jQuery && (this.art = jQuery));

		/*!
		 * artDialog iframeTools
		 * Date: 2011-11-25 13:54
		 * http://code.google.com/p/artdialog/
		 * (c) 2009-2011 TangBin, http://www.planeArt.cn
		 *
		 * This is licensed under the GNU LGPL, version 2.1 or later.
		 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
		 */
		 
		;(function ($, window, artDialog, undefined) {

		var _topDialog, _proxyDialog, _zIndex,
			_data = '@ARTDIALOG.DATA',
			_open = '@ARTDIALOG.OPEN',
			_opener = '@ARTDIALOG.OPENER',
			_winName = window.name = window.name
			|| '@ARTDIALOG.WINNAME' + + new Date,
			_isIE6 = window.VBArray && !window.XMLHttpRequest;

		$(function () {
			!window.jQuery && document.compatMode === 'BackCompat'
			// 不支持怪异模式，请用主流的XHTML1.0或者HTML5的DOCTYPE申明
			&& alert('artDialog Error: document.compatMode === "BackCompat"');
		});
			
			
		/** 获取 artDialog 可跨级调用的最高层的 window 对象 */
		var _top = artDialog.top = function () {
			var top = window,
			test = function (name) {
				try {
					var doc = window[name].document;	// 跨域|无权限
					doc.getElementsByTagName; 			// chrome 本地安全限制
				} catch (e) {
					return false;
				};
				
				return window[name].artDialog
				// 框架集无法显示第三方元素
				&& doc.getElementsByTagName('frameset').length === 0;
			};
			
			if (test('top')) {
				top = window.top;
			} else if (test('parent')) {
				top = window.parent;
			};
			
			return top;
		}();
		artDialog.parent = _top; // 兼容v4.1之前版本，未来版本将删除此


		_topDialog = _top.artDialog;


		// 获取顶层页面对话框叠加值
		_zIndex = function () {
			return _topDialog.defaults.zIndex;
		};



		/**
		 * 跨框架数据共享接口
		 * @see		http://www.planeart.cn/?p=1554
		 * @param	{String}	存储的数据名
		 * @param	{Any}		将要存储的任意数据(无此项则返回被查询的数据)
		 */
		artDialog.data = function (name, value) {
			var top = artDialog.top,
				cache = top[_data] || {};
			top[_data] = cache;
			
			if (value !== undefined) {
				cache[name] = value;
			} else {
				return cache[name];
			};
			return cache;
		};


		/**
		 * 数据共享删除接口
		 * @param	{String}	删除的数据名
		 */
		artDialog.removeData = function (name) {
			var cache = artDialog.top[_data];
			if (cache && cache[name]) delete cache[name];
		};


		/** 跨框架普通对话框 */
		artDialog.through = _proxyDialog = function () {
			var api = _topDialog.apply(this, arguments);
				
			// 缓存从当前 window（可能为iframe）调出所有跨框架对话框，
			// 以便让当前 window 卸载前去关闭这些对话框。
			// 因为iframe注销后也会从内存中删除其创建的对象，这样可以防止回调函数报错
			if (_top !== window) artDialog.list[api.config.id] = api;
			return api;
		};

		// 框架页面卸载前关闭所有穿越的对话框
		_top !== window && $(window).bind('unload', function () {
			var list = artDialog.list, config;
			for (var i in list) {
				if (list[i]) {
					config = list[i].config;
					if (config) config.duration = 0; // 取消动画
					list[i].close();
					//delete list[i];
				};
			};
		});


		/**
		 * 弹窗 (iframe)
		 * @param	{String}	地址
		 * @param	{Object}	配置参数. 这里传入的回调函数接收的第1个参数为iframe内部window对象
		 * @param	{Boolean}	是否允许缓存. 默认true
		 */
		$.dialog.open = artDialog.open = function (url, options, cache) {
			options = options || {};
			
			var api, DOM,
				$content, $main, iframe, $iframe, $idoc, iwin, ibody,
				top = artDialog.top,
				initCss = 'position:absolute;left:-9999em;top:-9999em;border:none 0;background:transparent',
				loadCss = 'width:100%;height:100%;border:none 0';
				
			if (cache === false) {
				var ts = + new Date,
					ret = url.replace(/([?&])_=[^&]*/, "$1_=" + ts );
				url = ret + ((ret === url) ? (/\?/.test(url) ? "&" : "?") + "_=" + ts : "");
			};
				
			var load = function () {
				var iWidth, iHeight,
					loading = DOM.content.find('.aui_loading'),
					aConfig = api.config;
					
				$content.addClass('aui_state_full');
				
				loading && loading.hide();
				
				try {
					iwin = iframe.contentWindow;
					$idoc = $(iwin.document);
					ibody = iwin.document.body;
				} catch (e) {// 跨域
					iframe.style.cssText = loadCss;
					
					aConfig.follow
					? api.follow(aConfig.follow)
					: api.position(aConfig.left, aConfig.top);
					
					options.init && options.init.call(api, iwin, top);
					options.init = null;
					return;
				};
				
				// 获取iframe内部尺寸
				iWidth = aConfig.width === 'auto'
				? $idoc.width() + (_isIE6 ? 0 : parseInt($(ibody).css('marginLeft')))
				: aConfig.width;
				
				iHeight = aConfig.height === 'auto'
				? $idoc.height()
				: aConfig.height;
				
				// 适应iframe尺寸
				setTimeout(function () {
					iframe.style.cssText = loadCss;
				}, 0);// setTimeout: 防止IE6~7对话框样式渲染异常
				api.size(iWidth, iHeight);
				
				// 调整对话框位置
				aConfig.follow
				? api.follow(aConfig.follow)
				: api.position(aConfig.left, aConfig.top);
				
				options.init && options.init.call(api, iwin, top);
				options.init = null;
			};
				
			var config = {
				zIndex: _zIndex(),
				init: function () {
					api = this;
					DOM = api.DOM;
					$main = DOM.main;
					$content = DOM.content;
					
					iframe = api.iframe = top.document.createElement('iframe');
					iframe.src = url;
					iframe.name = 'Open' + api.config.id;
					iframe.style.cssText = initCss;
					iframe.setAttribute('frameborder', 0, 0);
					iframe.setAttribute('allowTransparency', true);
					
					$iframe = $(iframe);
					api.content().appendChild(iframe);
					iwin = iframe.contentWindow;
					
					try {
						iwin.name = iframe.name;
						artDialog.data(iframe.name + _open, api);
						artDialog.data(iframe.name + _opener, window);
					} catch (e) {};
					
					$iframe.bind('load', load);
				},
				close: function () {
					$iframe.css('display', 'none').unbind('load', load);
					
					if (options.close && options.close.call(this, iframe.contentWindow, top) === false) {
						return false;
					};
					$content.removeClass('aui_state_full');
					
					// 重要！需要重置iframe地址，否则下次出现的对话框在IE6、7无法聚焦input
					// IE删除iframe后，iframe仍然会留在内存中出现上述问题，置换src是最容易解决的方法
					$iframe[0].src = 'about:blank';
					$iframe.remove();
					
					try {
						artDialog.removeData(iframe.name + _open);
						artDialog.removeData(iframe.name + _opener);
					} catch (e) {};
				}
			};
			
			// 回调函数第一个参数指向iframe内部window对象
			if (typeof options.ok === 'function') config.ok = function () {
				return options.ok.call(api, iframe.contentWindow, top);
			};
			if (typeof options.cancel === 'function') config.cancel = function () {
				return options.cancel.call(api, iframe.contentWindow, top);
			};
			
			delete options.content;

			for (var i in options) {
				if (config[i] === undefined) config[i] = options[i];
			};
			
			return _proxyDialog(config);
		};


		/** 引用open方法扩展方法(在open打开的iframe内部私有方法) */
		artDialog.open.api = artDialog.data(_winName + _open);


		/** 引用open方法触发来源页面window(在open打开的iframe内部私有方法) */
		artDialog.opener = artDialog.data(_winName + _opener) || window;
		artDialog.open.origin = artDialog.opener; // 兼容v4.1之前版本，未来版本将删除此

		/** artDialog.open 打开的iframe页面里关闭对话框快捷方法 */
		artDialog.close = function () {
			var api = artDialog.data(_winName + _open);
			api && api.close();
			return false;
		};

		// 点击iframe内容切换叠加高度
		_top != window && $(document).bind('mousedown', function () {
			var api = artDialog.open.api;
			api && api.zIndex();
		});


		/**
		 * Ajax填充内容
		 * @param	{String}			地址
		 * @param	{Object}			配置参数
		 * @param	{Boolean}			是否允许缓存. 默认true
		 */
		artDialog.load = function(url, options, cache){
			cache = cache || false;
			var opt = options || {};
				
			var config = {
				zIndex: _zIndex(),
				init: function(here){
					var api = this,
						aConfig = api.config;
					
					$.ajax({
						url: url,
						success: function (content) {
							api.content(content);
							opt.init && opt.init.call(api, here);		
						},
						cache: cache
					});
					
				}
			};
			
			delete options.content;
			
			for (var i in opt) {
				if (config[i] === undefined) config[i] = opt[i];
			};
			
			return _proxyDialog(config);
		};



		/**
		 * 警告
		 * @param   {String, HTMLElement}   消息内容
		 * @param   {String}                标题
		 * @param   {Function}              (可选) 回调函数
		 */
		$.alert = $.dialog.alert = artDialog.alert = function (content, title, icon, callback, zIndex) {
			var alert = artDialog.get('Alert');
			//var api,wrap;
			if (alert)
				alert.close();
			alert = $.dialog({
		        id: 'Alert',
		        title:title,
		        padding:'20px',
		        //icon: icon ? icon : 'succeed',
		        title: title,
		        fixed: true,
		        lock: true,
		        minWidth: 200,
		        content: '<div class="configWrap">'+content+'</div>',
		        ok: callback ? callback : true,
				init: function(here){
		            //api = this;
		            //wrap = api.DOM.wrap;
		            //wrap.find('.aui_icon .aui_iconBg').css({
		            //        'margin':'30px 0 5px 10px',
		            //        'height': '40px'
		            //});
		            //wrap.find('.aui_content').css({
		            //    'margin':'0 25px',
		            //    'padding':'0px 25px'
		            //});
		        },
		        button:[
		            {
		                name: '确定',
		                className: 'btn-process',
		                callback: function () {
		                },
		                focus: true
		            }
		        ],
		        close: function(){
		        	//wrap.find('.aui_icon .aui_iconBg').removeAttr("style");
		        	//wrap.find('.aui_content').removeAttr("style");
		        },
		        //isClose: false,
		        zIndex: zIndex?zIndex:1020
		    });
			return alert;
		};


		$.bindbeforeout = $.dialog.bindbeforeout = artDialog.bindbeforeout = function() {
			$(window).bind('beforeunload', function(){
				return "您未保存的内容将会丢失！";
			});
		};

		$.unbindbeforeout = $.dialog.unbindbeforeout = artDialog.unbindbeforeout = function() {
			$(window).unbind('beforeunload');
		};

		/**
		 * 确认选择
		 * @param   {String, HTMLElement}   消息内容
		 * @param   {String}                标题
		 * @param   {Function}              确定按钮回调函数
		 * @param   {Function}              取消按钮回调函数
		 */
		$.confirm = $.dialog.confirm = artDialog.confirm = function (content, title, ok, cancel, zIndex) {
			var confirm = artDialog.get('Confirm'),api,wrap,defaultIndex = artDialog.defaults.zIndex;
			if (confirm)
				confirm.close();
			confirm = $.dialog({
		        id: 'Confirm',
		        padding: '20px',
		        title: title || false,
		        fixed: true,
		        lock: true,
		        //minWidth: 120,
		        minWidth: 400,
						height: 120,
		        content: content,
		        ok: ok,
		        top: '230px',
		        cancel: cancel,
		        cancelCssClass: '',
		        okCssClass: 'btn-process',
		        init: function(here){
		            api = this;
		            wrap = api.DOM.wrap;
		            wrap.find('.aui_content').css({
		                    'min-width':'120px',
		                    'text-align': 'center'
		            });
		        },
		        // button: [
		        //     {
		        //         name: '取消',
		        //         className: '',
		        //         callback: function () {
		        //             wrap.find('.aui_content').removeAttr("style");
		        //             artDialog.defaults.zIndex--;
		        //         },
		        //         focus: false
		        //     },
		        //     {
		        //         name: '确定',
		        //         className: 'btn-process',
		        //         focus: false,
		        //         callback: function () {
		        //         }
		        //     }
		        // ],
		        close: function(){
		        },
		        isClose: false,
		        zIndex: zIndex||defaultIndex
		    });
			return confirm;
		};


		/**
		 * 输入框
		 * @param   {String, HTMLElement}   消息内容
		 * @param   {String}                标题
		 * @param   {Function}              确定按钮回调函数。函数第一个参数接收用户录入的数据
		 * @param   {String}                输入框默认文本
		 */
		$.prompt = $.dialog.prompt = artDialog.prompt = function (content, title, ok, defaultValue) {
		    defaultValue = defaultValue || '';
		    var input;
		    var prompt = artDialog.get('Prompt');
		    if (prompt)
		    	prompt.close();
		    prompt = $.dialog({
		        id: 'Prompt',
		        title: title,
		        fixed: true,
		        lock: true,
		        content: [
		            '<div style="margin-bottom:5px;font-size:12px">',
		                content,
		            '</div>',
		            '<div>',
		                '<input type="text" class="d-input-text" value="',
		                    defaultValue,
		                '" style="width:18em;padding:6px 4px" />',
		            '</div>'
		            ].join(''),
		        init: function () {
		            input = this.DOM.content.find('.d-input-text')[0];
		            input.select();
		            input.focus();
		        },
		        ok: function () {
		            return ok && ok.call(this, input.value);
		        },
		        cancel: function () {}
		    });
		    return prompt;
		};


		/**
		 * 短暂提示
		 * @param	{String}	提示内容
		 * @param	{Number}	显示时间 (默认1.5秒)
		 */
		$.tips = $.dialog.tips = artDialog.tips = function(content, time) {
			var tips = artDialog.get('Tips');
			if (tips)
				tips.close();
			tips = $.dialog({
				id: 'Tips',
				title: false,
				cancel: false,
				isClose: false,
				fixed: true,
				lock: true,
				isClickShade: false
			})
			.content('<div style="padding: 0 1em;">' + content + '</div>')
			.time(time || 1.5);
			return tips;
		};

		$.gmMessage = $.dialog.gmMessage = artDialog.gmMessage = function(content, success, time) {
			var gmMsg = artDialog.get('gmMsg'), api, wrap;
			if (gmMsg)
				gmMsg.close();
			gmMsg = $.dialog({
				id: 'gmMsg',
				title: false,
				cancel: false,
				fixed: true,
				//lock: !success,
				isClickShade: false,
				top: '0%',
				left: '50%',
		        padding: 0,
		        drag: false,
		        resize: false,
		        zIndex: _zIndex(),
		        init: function(here){
		            api = this;
		            wrap = api.DOM.wrap;
		            // wrap.find('.aui_inner').css({
		            //         'background':success ? '#ffcc66' : 'red',
		            //         'border':'1px solid #fff',
		            //         'min-height':'40px',
		            //         'min-width':'150px',
		            //         '-moz-border-radius':'5px',
		            //         '-webkit-border-radius':'5px',
		            //         'border-radius':'5px'
		            // });

					if($('#sidebar').length){
						wrap.css('margin-left', $('#sidebar').width() / 2);
					}

					wrap.find('.aui_outer').css('background', 'none');
		            wrap.find('.aui_main').css({
		            	'padding-top': 5,
		                'min-height':'40px',
		                'font-size':'14px',
		                'min-width':'150px'
		            });
		            wrap.find('.aui_footer, .aui_close').hide();
		        },
		        close: function(){
		        	$.cookie('message', null, {path:'/'});
		        	wrap.find('.aui_inner, .aui_outer, .aui_main, .aui_close, .aui_footer').removeAttr("style");
		        }
			})
			.content('<span class="common-tips btn btn-'+ (success ? 'success' : 'danger') +'"><i class="gm-icon gm-'+(success ? 'success' : 'close')+'"></i> '+ content +'</span>')
			.position('50%', '0%')
			.zIndex($.artDialog.defaults.zIndex++)
			.time(time || 3);
			return gmMsg;
		};

		/** 抖动效果 */
		$.dialog.prototype.shake = (function () {

		    var fx = function (ontween, onend, duration) {
		        var startTime = + new Date;
		        var timer = setInterval(function () {
		            var runTime = + new Date - startTime;
		            var pre = runTime / duration;
		                
		            if (pre >= 1) {
		                clearInterval(timer);
		                onend(pre);
		            } else {
		                ontween(pre);
		            };
		        }, 13);
		    };
		    
		    var animate = function (elem, distance, duration) {
		        var quantity = arguments[3];

		        if (quantity === undefined) {
		            quantity = 6;
		            duration = duration / quantity;
		        };
		        
		        var style = elem.style;
		        var from = parseInt(style.marginLeft) || 0;
		        
		        fx(function (pre) {
		            elem.style.marginLeft = from + (distance - from) * pre + 'px';
		        }, function () {
		            if (quantity !== 0) {
		                animate(
		                    elem,
		                    quantity === 1 ? 0 : (distance / quantity - distance) * 1.3,
		                    duration,
		                    -- quantity
		                );
		            };
		        }, duration);
		    };
		    
		    return function () {
		        animate(this.DOM.wrap[0], 40, 600);
		        return this;
		    };
		})();





		// 增强artDialog拖拽体验
		// - 防止鼠标落入iframe导致不流畅
		// - 对超大对话框拖动优化
		$(function () {
			var event = artDialog.dragEvent;
			if (!event) return;

			var $window = $(window),
				$document = $(document),
				positionType = _isIE6 ? 'absolute' : 'fixed',
				dragEvent = event.prototype,
				mask = document.createElement('div'),
				style = mask.style;
				
			style.cssText = 'display:none;position:' + positionType + ';left:0;top:0;width:100%;height:100%;'
			+ 'cursor:move;filter:alpha(opacity=0);opacity:0;background:#FFF';
				
			document.body.appendChild(mask);
			dragEvent._start = dragEvent.start;
			dragEvent._end = dragEvent.end;
			
			dragEvent.start = function () {
				var DOM = artDialog.focus.DOM,
					main = DOM.main[0],
					iframe = DOM.content[0].getElementsByTagName('iframe')[0];
				
				dragEvent._start.apply(this, arguments);
				style.display = 'block';
				style.zIndex = artDialog.defaults.zIndex + 3;
				
				if (positionType === 'absolute') {
					style.width = $window.width() + 'px';
					style.height = $window.height() + 'px';
					style.left = $document.scrollLeft() + 'px';
					style.top = $document.scrollTop() + 'px';
				};
				
				if (iframe && main.offsetWidth * main.offsetHeight > 307200) {
					main.style.visibility = 'hidden';
				};
			};
			
			dragEvent.end = function () {
				var dialog = artDialog.focus;
				dragEvent._end.apply(this, arguments);
				style.display = 'none';
				if (dialog) dialog.DOM.main[0].style.visibility = 'visible';
			};
		});

		})(this.art || jQuery, this, this.artDialog);
});

