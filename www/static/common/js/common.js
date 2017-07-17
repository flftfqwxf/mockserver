window.common && alert('该对象已存在，请检查是否有同名的对象！');
window.common = {
    init: function(opts) {
        this.opts = $.extend({}, this.defaultOpts, opts || {});
        //初始化所有的事件
        this._handleEvent();
    },
    /**
     * 事件管理，将所有的事件绑定都放在此处
     * @private
     */
    _handleEvent: function() {
        this.showAPIBind()
    },
    /**
     * 默认参数，将所有默认参数都放在此处
     */
    defaultOpts: {
        //arguments
        //.....
    },
    /**
     * 绑定查看接口,通过JS模拟表单提交，来显示不同请求类型的接口，
     * 如果是GET请求，则直接打开链接，
     * 如，POST,PUT等请求类型，则通过表单提交来获取对应数据
     *
     */
    //todo: 打开的新窗口，如果在地址栏中，使用回车刷新页面，则会发送到GET请求，不会发送表单，此问题除修改交互外，无法解决
    showAPIBind: function() {
        $('.J_lnk').click(function() {
            var method = $(this).attr('method')
            if (method !== 'get') {
                $('#locationForm')
                    .attr('action', $(this).attr('href'))
                    .attr('method', $(this).attr('method') === 'get' ? 'get' : 'post')
                    .find('input').val($(this).attr('method'))
                    .end()
                    .submit()
                return false
            }
        })
    },
};