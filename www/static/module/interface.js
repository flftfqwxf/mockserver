/**
 * Created by leixianhua on 2017/7/17.
 */
window.interface && alert('该对象已存在，请检查是否有同名的对象！');
window.interface = {
    init(opts) {
        this.opts = $.extend({}, this.defaultOpts, opts || {});
        //初始化所有的事件
        this._handleEvent();
    },
    /**
     * 事件管理，将所有的事件绑定都放在此处
     * @private
     */
    _handleEvent() {
        this.deleteBind()
        this.clearSearchKeyBind()
        this.proxyBind()
    },
    /**
     * 默认参数，将所有默认参数都放在此处
     */
    defaultOpts: {
        //arguments
        //.....
    },
    /**
     * 绑定删除
     */
    deleteBind() {
        $('.deleteLnk').click(() => {
            if (confirm(this.opts.LN.interface.index.deleteTips)) {
                return true;
            } else {
                return false;
            }
        })
    },
    /**
     * 绑定清除搜索关键词
     */
    clearSearchKeyBind() {
        $('.fa-times-circle').click(function() {
            $(this).prev('.form-control').val('')
        })
    },
    /**
     * 打开关闭二次代理绑定
     */
    proxyBind: function() {
        var _this = this
        $('.oper_proxy').click(function() {
            var $this = $(this), is_proxy = $(this).attr('data-is-proxy'),
                mockid = $(this).attr('mockid'), txt = is_proxy === "0" ? _this.opts.LN.interface.index.closeProxy : _this.opts.LN.interface.index.openProxy,
                oper_proxy = is_proxy === "0" ? 1 : 0,
                state = is_proxy === "0" ? _this.opts.LN.interface.index.opened : _this.opts.LN.interface.index.closed;
            $.getJSON('/interface/setproxy', {mockid: mockid, is_proxy: oper_proxy}).done(function(data) {
                if (data && data.errno === 0) {
                    $this.html(txt).attr('data-is-proxy', oper_proxy);
                    $this.parent().siblings('.proxy_state').html(state);
                    is_proxy === "0" ? $('.J_proxy_tips_' + mockid).show() : $('.J_proxy_tips_' + mockid).hide()
                } else {
                    $.commonTips(data.errmsg, 'danger', 1500);
                }
            }).fail(function(err) {
                alert(err.message)
            });
        })
        $('#oer_all_proxy').click(function() {
            var $this = $(this), is_proxy = $(this).attr('data-is-proxy'),
                txt = is_proxy === "0" ? _this.opts.LN.interface.index.closeAllProxies : _this.opts.LN.interface.index.openAllProxies,
                txtitem = is_proxy === "0" ? _this.opts.LN.interface.index.closeProxy : _this.opts.LN.interface.index.openProxy,
                oper_proxy = is_proxy === "0" ? 1 : 0,
                state = is_proxy === "0" ? _this.opts.LN.interface.index.opened : _this.opts.LN.interface.index.closed;
            var mockids = $('.oper_proxy').map(function() {
                return $(this).attr('mockid');
            }).get().join(",");
            $.getJSON('/interface/setproxies', {is_proxy: oper_proxy, mockids: mockids}).done(function(data) {
                if (data && data.errno === 0) {
                    $('.oper_proxy').html(txtitem);
                    $this.html(txt).attr('data-is-proxy', oper_proxy);
                    is_proxy === "0" ? $('.J_proxy_all_tips').show() : $('.J_proxy_all_tips').hide()
                    $('.proxy_state').html(state)
                } else {
                    $.commonTips(data.errmsg, 'danger', 1500);
                }
            }).fail(function(err) {
                alert(err.message)
            });
        })
    }
};