((function ($, w) {
    var toCNNumber = function (n) {
        return 0 < n && n <= 10 ? ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"][n - 1] : n;
    }
    template.helper('toCNNumber', toCNNumber);
    template.helper('formatFlightTime', function (n) {
        if (!n) {
            return "";
        } else {
            return n.length >= 5 ? n.substring(0, 5) : n;
        }
    });
    var isNew = Tour.utils.getUrlParam("id") == null;
    var $msg = {
        change_tour: "现在切换将清空已有内容，是否确定?"
    };
    $("#newBtn").on("click", function () {
        location.href = '/product/category';
        /*$.confirm($msg.change_tour, 0,
            function () {
                // if (!isNew) {
                    location.href = "/product/input?lineId=" + (Tour.current.lineId || Tour.current.data.product.id);
                // } else {
                //     destoryUEditor();
                //     var topSearchArea = $("#product-accordion");
                //     if (topSearchArea) {
                //         topSearchArea.find(".list-group-item").removeClass("selected");
                //         topSearchArea.find('[role="tabpanel"]').collapse("hide");
                //     }
                //     Tour.load();
                // }
            },
            $.noop
        );*/
    });
    //init  step
    $(".step").on("click", function () {
        
        var ref = $(this).attr("ref");
        var $this = $(this);

        //行建行程时。需要进入下一步需要校验
        if (Tour.current.module) {
            var $current = $(".step[ref=" + Tour.current.ref + "]");
            if (isNew) {
                var $prev = $this.prev(".step");
                if ($prev.length == 1 && ($this.index() - $current.index() != 1)) {
                    if (!$prev.hasClass("validate")) {
                        return;
                    }
                }
            }

            if(!Tour.current.module.submit()){
                return;
            }

            if (isNew && $this.index() <= $current.index()) {
                // 注释掉后面看是否有新的bug导致
                // if ($this.index()==2 && Tour.utils.vaildDatas()) {
                //     valid = Tour.utils.vaildDatas();
                // }
                Tour.current.module.hide();
                Tour.module[ref].show();
                $this.nextAll(".step").removeClass("validate");
                setChooseSetep($this, ref);
            }
            else {
                // var ok = Tour.current.module.submit();
                // if (!ok) {
                //     return;
                // }
                // else {

                    var hasEmpty = false;
                    //TODO: 此功能暂时去掉
                    //var hasEmpty =  checkEmptyItem(Tour.current.ref);
                    //当存在有空的选项没填写时，弹层提示
                    if (hasEmpty) {
                        var str = '分销商';
                        if (PROJECT_NAME === 'distributor') {
                            str = '客人';
                        }
                        $.dialog({
                            title: false,
                            //title: false,
                            width: 500,
                            height: 120,
                            padding: '0 20px',
                            isOuterBoxShadow: false,
                            //isClose: false,
                            content: '您尚未填写完整产品信息，将大大降低产品被' + str + '<br>看到的几率，<span style="color: #587ed1;">建议补全未填写信息</span>',
                            lock: true,
                            fixed: true,
                            ok: false,
                            //cancelCssClass: 'btn-process',
                            //cancel: function () {
                            //},
                            //cancelVal: '继续',
                            button: [
                                {
                                    name: '去完善',
                                    className: 'btn-process',
                                    callback: function () {
                                        this.close();
                                        return false;
                                    },
                                    focus: true
                                },
                                {
                                    name: '继续',
                                    className: 'btn-info',
                                    callback: function () {
                                        $(".step[ref=" + Tour.current.ref + "]").addClass("validate");
                                        Tour.current.module.hide();
                                        setChooseSetep($this, ref);
                                        this.close();
                                        return false;
                                    },
                                    focus: true
                                }
                            ]
                        });
                    } else {
                      
                        $(".step[ref=" + Tour.current.ref + "]").addClass("validate");
                        Tour.current.module.hide();
                        setChooseSetep($this, ref);
                    }
                // }
            }
        } else {
            setChooseSetep($this, ref);
        }
    });
    /**
     * 通过选择器【.J_checkEmpty】,验证是否有未填写的内容
     * @returns {boolean} 有为空时，返回TRUE，否则返回FALSE
     */
    function checkEmptyItem(step) {
        var isEmpty = false;
        $('#' + step + ' .J_checkEmpty').each(function () {
            var $this = $(this), nodeName = $this.prop('nodeName');
            if (nodeName === 'IMG' && !$this.prop('src')) {
                isEmpty = true;
                return false;
            } else if ((nodeName === 'INPUT' || nodeName === 'TEXTAREA') && !$.trim($this.prop('value'))) {
                isEmpty = true;
                return false;
            }
        });
        //验证第二步
        if (step === 'trip') {
            alert(10);
            $('.daily_trip').each(function () {
                //判断餐食
                if ($('[name="breakfast"]').val() === '0' && $('[name="lunch"]').val() === '0' && $('[name="dinner"]').val() === '0') {
                    isEmpty = true;
                }
                //判断酒店
                if ($('[name="custom"]').val() === '') {
                    isEmpty = true;
                }
                //判断交通
                if ($.trim($('.J_traffics').html())) {
                }
                //$('[name="breakfast"],[name="lunch"],[name="dinner"]').each(function () {
                //    if($(this).val()==="1"){
                //        eatEmpty=false;
                //        return false;
                //    }
                //});
            });
        }
        if (step === 'other') {
            //验证自费项目
            if ($('input[name="customSelfPaid"]').val() === '0') {
                $('#customSelfPaidList input').each(function () {
                    if ($.trim($(this).val()) == '') {
                        isEmpty = true;
                        return false;
                    }
                });
            } else if ($.trim($('#customSelfPaidDescription').val()) === '') {
                isEmpty = true;
                return false;
            }
            //验证购物点
            if ($('input[name="customShop"]').val() === '0') {
                $('#customShopList input').each(function () {
                    if ($.trim($(this).val()) == '') {
                        isEmpty = true;
                        return false;
                    }
                });
            } else if ($.trim($('#customShopDescription').val()) === '') {
                isEmpty = true;
                return false;
            }
            //验证注意事项
            var customTips = false;
            $('#custom-tips-list .J_checkbox').each(function () {
                if ($(this).hasClass('active')) {
                    customTips = true;
                    return false;
                }
            });
            if (!customTips) {
                isEmpty = true;
            }
            if ($.trim($('#customTip').val()) === '') {
                isEmpty = true;
            }
            //验证其他备注
            if ($.trim($('#remark').val()) === '') {
                isEmpty = true;
            }
        }
        return isEmpty;
    }

    function setChooseSetep($this, ref) {
        // 页面回到顶部
        $('#page-content-viewport').scrollTop(0);
        $(".step").removeClass("active");
        $this.addClass("active");
        //$(window).scrollTop(0);
        setNav();
        w.Tour.current.ref = ref;
        w.Tour.current.module = w.Tour.module[ref];
        if (!w.Tour.current.module.isInit()) {
            w.Tour.current.module.init();
        }
        w.Tour.current.module.show();
    }

    w.init_step_top = function () {
        // $(window).scroll(function () {
        //     setNav();
        // });
    }
    //顶部浮动
    //init_step_top();
    function setNav() {
        // var bar = $(".nav-step").height();
        // var h = bar + 200;
        // var fixedObj = $(".nav-step").parent();
        // var scrollTop = $(window).scrollTop();
        // if (scrollTop > h) {
        //     fixedObj.css({left: fixedObj.parent().offset().left, width: fixedObj.parent().width()}).addClass("top_step");
        // } else if (scrollTop <= h) {
        //     fixedObj.css({left: 0}).removeClass("top_step");
        // }
    }
    
    var $form = $("#form").validationEngine({
        scroll: true, //是否滚动
        scrollOffset: 180, //滚动偏移量
        isOverflown: true, // 设置是否有滚动的容器
        overflownDIV: '#page-content-viewport', // 滚动容器选择器
        validateNonVisibleFields: false,
        autoHidePrompt: true,
        autoHideDelay: 5000,
        focusFirstField: true,
        validationEventTrigger : "",
        showOneMessage : false,
        maxErrorsPerField : 1,
        onValidationComplete:function(dom,result){
              if($("#base").is(":visible")){
               if($(".select2-selection--multiple .select2-selection__choice").size()==0){
           	     $(".select2-selection--multiple, .select2-selection--multiple input").addClass("error");  
           	     return false;
                   }
           	else{
           	     $(".select2-selection--multiple, .select2-selection--multiple input").removeClass("error");
           	     return true;
           	}
              }
            return result;
        }
    });
    var docForm = document.getElementById("form");
    //行程服务.已经参数配置等信息
    var tourService = {
        //加载行程
        //tour: 行程ID, 当ID为NULL时.为新建
        //copy: true:为根据行程ID的属性拷贝.  false:为修改行程.默认为true
        load: function (tourId, copy) {
            if (tourId) {
                $(".step").addClass("validate");
            } else {
                $(".step").removeClass("validate");
            }
            Tour.module.other.clear();
            Tour.module.trip.clear();
            Tour.module.base.clear();
            Tour.current.copy = copy;
            Tour.current.ref = null;
            Tour.current.module = null;
            Tour.current.data = null;
            Tour.current.jsondom && Tour.current.jsondom.destory();
            if (tourId != null) {
                $(".mask").show();
                $(".loading-wrap").show();
                var urlprefix = copy ? "/tour/" : "/product/";
                //load
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: urlprefix + "{id}.json?{random}".template({"id": tourId, "random": new Date().getTime()}),
                    success: function (json) {
                        $(".mask").hide();
                        $(".loading-wrap").hide();
                        json.tour = json.tour || {};
                        json.product = json.product || {};
                        Tour.current.data = json.tour;
                        Tour.current.data.product = json.product;
                        Tour.current.lineId = Tour.current.lineId || (json.product.touristLine && json.product.touristLine.id);
                        $("#urlTourLineId").attr("value",Tour.current.lineId);
                        
                        var selected={};
                        $(json.product.productDestinations).each(function(i,v){
                            selected[v.area.id]=v.area.id;
                	});
                        $.getJSON("/cityAreas.json?line="+$("#urlTourLineId").val(),function(serverData){
                	    var options="";
                	    $(serverData.areas).each(function(i,v){
                		options+="<option value=\""+v.id+"\" "+((selected[v.id])?"selected":"")+">"+v.name+"</option>";
                	    });
                	    $("#J-destination").html(options);
                	    $('#J-destination').select2({
        			  placeholder:"请选择目的地"
        		    });
                	    
                	    /*var selected="";
                	    
                	    $(".select2-selection__rendered .select2-search").before(selected);*/
                	});
                        
                        
			
                        if (copy) {
                            $.each("name coverImage priceIncluded priceExcluded brightSpot".split(" "), function (index, val) {
                                json.product[val] = json.tour[val];
                            });
                            //COPY 行程删除行程ID.
                            delete json.product.id;
                            delete Tour.current.data.id;
                            json.tour.touristLine.id = Tour.current.lineId;

                        } else {
                            Tour.current.lineId = json.product.touristLine.id;
                        }
                        Tour.current.jsondom = $.jsondom.bind(Tour.current.data, $form);
                        $(".step[ref=base]").click();
                        //Tour.module.base.init();
                    },
                    error: function () {
                        $(".mask").hide();
                        $(".loading-wrap").hide();
                    }
                });
            } else {
                Tour.current.data = {
                    dailyTrips: [{}, {}, {}],
                    product: {}
                };
                Tour.current.jsondom = $.jsondom.bind(Tour.current.data, $form);
                $(".step[ref=base]").click();
                //Tour.module.base.init();
                //alert("新建");
                
                $.getJSON("/cityAreas.json?line="+$("#urlTourLineId").val(),function(serverData){
        	    var options="";
        	    $(serverData.areas).each(function(i,v){
        		options+="<option value=\""+v.id+"\">"+v.name+"</option>";
        	    });
        	    $("#J-destination").html(options);
        	    $('#J-destination').select2({
			  placeholder:"请选择目的地"
		    });
        	});
            }
            $(".step").removeClass("active");
            $(".step[ref=base]").addClass("active");
            //页面隐藏的专线元素赋值
            $("#touristLineId").val(Tour.current.lineId);
        },
        nextStep: function () {
            var next = $(".step[ref=" + Tour.current.ref + "]").next(".step");
            if (next.length == 1) {
                next.click();
            } else {
                alert("提交数据");
            }
        },
        //模版
        template: null,
        current: {
            lineId: $("#urlTourLineId").val(),
            tourtype: (function(){
                var type = Tour.utils.getUrlParam('tourtype');

                return type == 'free' ? 'freewalker' : type;
            })(),
            //引用模块
            ref: null,
            //模块
            module: null,
            //是否为copy
            copy: false,
            //当前行程数据
            data: null,
            //当前表单
            form: $form,
            docForm: docForm,
            jsondom: null
        }
    };
    w.Tour = w.Tour || {};
    $.extend(w.Tour, tourService);
    $("#nextBtn").on("click", Tour.nextStep);
    $.bindbeforeout();
}))(jQuery, window);
$(function () {
    var id = Tour.utils.getUrlParam("id");
    if (id) {
        $(".copytip").hide();
        Tour.load(id);
    }
});