//heyadong
$(function () {
    var $lineId = Tour.current.lineId;
    var $left = $(".left-list");
    var $copyTour = null;
    var $pagesize = 6;
    var $defaultParams = {
        line: $lineId,
        size: $pagesize
    };
    var $url = null;
    var $currentParams = $.extend({}, $defaultParams);
    var $msg = {
        change_tour: "现在切换将清空已有内容，是否确定?"
    }
    
    
    
    
    template.helper('subdate', function (date) {
        if (!date || date.length < 10) {
            return "";
        } else {
            return date.substring(0, 10);
        }
    });
    template.helper('maxstring', function (str, max, suffix) {
        max = max || 10;
        suffix = suffix || "...";
        if (str && str.length > max) {
            return str.substring(0, max) + suffix;
        } else if (!str) {
            return "";
        } else {
            return str;
        }
    });
    var searchTargetProduct = function (targetPanel, url) {
        var input = targetPanel.find("input.form-control");
        var kw = input.val();
        var listPager = targetPanel.find(".list-pagination");
        listPager.hide();
        targetPanel.find(".pagination").remove();
        listPager.find("> .pull-right").append('<div class="pagination"></div>');
        if (!Placeholders.nativeSupport && kw == input.data('placeholder-value')) {
            kw = '';
        }
        targetPanel.find(".pagination").pagination({
            dataSource: url + "?_=" + Math.random() + "&line=" + $lineId + "&name=" + escape(kw),
            locator: "tours",
            triggerPagingOnInit: true,
            hideWhenLessThanOnePage: true,
            getTotalPageByResponse: function (d) {
                this.rawData = d;
                return d.pagination.pageCount
            },
            alias: {
                pageNumber: 'page',
                pageSize: 'size'
            },
            totalNumber: 50,
            pageSize: 5,
            callback: function (data, pagination) {

                targetPanel.find(".loadding-anim").hide();
                var listGroup = targetPanel.find(".list-group");
                var templateId = url.indexOf("system") > -1 ? "tmp_left_tour_system" : "tmp_left_tour_mine";
                var shtml = "";
                $.each(data, function (i, e) {
                    shtml += template(templateId, e);
                });
                listGroup.html(shtml);
                var spage = template("tmp_left_pagination", pagination);
                listPager.find("> .pull-left").html(spage);
                targetPanel.find(".result-count").html(this.rawData.pagination.count);
                // addTourItem.call(listGroup, {
                // 	tours: data,
                // 	pagination: pagination
                // });
                if (!data.length) {
                    targetPanel.find(".list-pagination").hide();
                    if (kw) {
                        targetPanel.find(".search-empty").show();
                    } else {
                        $("#mineProductPanel :input").attr('disabled', true);
                        targetPanel.find(".tour-empty").show();
                    }
                } else {
                    targetPanel.find(".list-pagination").show();
                    targetPanel.find(".search-empty").hide();
                    targetPanel.find(".tour-empty").hide();
                }
            }
        });
    };
    var topSearchArea = $("#product-accordion");
    var mineProductPanel = $("#mineProductPanel");
    var systemProductPanel = $("#systemProductPanel");
    var mineLastKeyword = "";
    var systemLastKeyword = "";
    mineProductPanel.find("form").on("submit", function (e) {
        e.preventDefault();
        var kw = $.trim(mineProductPanel.find("input.form-control").val());
        if (kw != mineLastKeyword) {
            searchTargetProduct(mineProductPanel, "/tour/list/supplier.json");
            mineLastKeyword = kw;
        }
    });
    systemProductPanel.find("form").on("submit", function (e) {

        e.preventDefault();
        var kw = $.trim(systemProductPanel.find("input.form-control").val());
        if (kw != systemLastKeyword) {

            searchTargetProduct(systemProductPanel, "/tour/list/system.json");
            systemLastKeyword = kw;
        }
    });
    topSearchArea.on("click", ".list-group-item", function () {
        var product = $(this);
        var isSelected = product.hasClass("selected");
        if (isSelected) {
            return;
        }
        $copyTour = product.attr("tour");
        $.confirm($msg.change_tour, false,
            function () {
                destoryUEditor();
                if ($copyTour) {
                    Tour.load($copyTour, true);
                    $copyTour = null;
                } else {
                    Tour.load();
                }
                topSearchArea.find(".list-group-item").removeClass("selected");
                product.addClass("selected");
                product.parents('[role="tabpanel"]').collapse("hide");
            },
            $.noop
        );
    });
    topSearchArea.find(".collapse").on("shown.bs.collapse", function (e) {
        var elem = $(e.target);
        if (!elem.attr("data-inited")) {
            var type = elem.attr("data-list-type");
            var panel = type == "mine" ? mineProductPanel : systemProductPanel;
            var url = type == "mine" ? "/tour/list/supplier.json" : "/tour/list/system.json";
            searchTargetProduct(panel, url);
            elem.attr("data-inited", true);
        }
    });
    topSearchArea.on("click", ".list-group-item:not(.selected) .gm-delete", function (e) {
        var elem = $(this).parents(".list-group-item");
        var id = elem.attr("tour");
        e.stopPropagation();
        $.confirm("是否确认删除该行程", false, function () {
            $.ajax({
                url: "/tour/" + id + ".json",
                type: "delete",
                dataType: "json",
                success: function (data) {
                    if (data.result.success) {
                        var countNode = elem.parents(".panel-body").find(".result-count");
                        var count = Number(countNode.text() || 0) - 1;
                        elem.remove();
                        countNode.text(count < 0 ? 0 : count);
                        $.gmMessage(data.result.message, true);
                    } else {
                        $.gmMessage(data.result.message);
                    }
                }
            });
        }, function () {
        });
    });
    var type = Tour.utils.getUrlParam("type");
    Tour.load();
    // if (type == "mine") {
    // 	Tour.load();
    // 	$(".minetour", $left).click();
    // } else if (type == "sys") {
    // 	Tour.load();
    // 	$(".systour", $left).click();
    // } else {
    // 	$(".newtour", $left).click();
    // }
});