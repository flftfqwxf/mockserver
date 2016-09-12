/*
 * 产品浏览量统计
*/
function showConutInfo(id, pageviewCount, imageCount, linkCount, fileDownloadCount){
    // product/{id}/statistics
    var convertNum = function(num){
        return +num ? num : '<span class="show_count_none">--</span>';
    }
    var pageviewCount = convertNum(pageviewCount);
    var imageCount = convertNum(imageCount);
    var linkCount = convertNum(linkCount);
    var fileDownloadCount = convertNum(fileDownloadCount);

    var content = '<div class="product_count_show">'+
            '<div class="pt_count_show_title">'+
                '<span class="btn"><span id="showAllDate" class="ct_show_title_li on">全部</span><span id="showSetDate" class="ct_show_title_li">指定时间段</span></span>'+
                '<span id="showSetDateInput" class="form-inline showSetDateInput"><input type="text" class="form-control show_date_set" name="" id="showStartDate" value="" readonly="" placeholder="开始日期"/><span class="gap">-</span>'+
                    '<input type="text" class="form-control show_date_set solidBorder-borderColor" name="" id="showEndDate" value="" readonly="" placeholder="结束日期"/>'+
            '</div>'+
            '<div class="show_count_contnet">'+
                '<div class="show_count_ct_li"><span id="pageviewCount">'+pageviewCount+'</span>次<br>产品浏览量</div>'+
                '<div class="show_count_ct_li"><span id="imageCount">'+imageCount+'</span>次<br>图片广告浏览量</div>'+
                '<div class="show_count_ct_li"><span id="linkCount">'+linkCount+'</span>次<br>链接广告浏览量</div>'+
                '<div class="show_count_ct_li"><span id="fileDownloadCount">'+fileDownloadCount+'</span>次<br>行程附件下载量</div>'+
            '</div>'+
        '</div>';
    var countInfo = $.dialog({
        title: '详情统计',
        //title: false,
        //width: 520,
        //height: 220,
        padding : '0 20px 20px',
        isOuterBoxShadow: false,
        //isClose: false,
        content: content,
        lock: true,
        fixed: true,
        ok: false,
        //cancelCssClass: 'btn-process',
        cancel: function () {},
        cancelVal: '关闭'
    });
    $("#showAllDate").click(function(){
        $(this).addClass("on");
        $("#showSetDate").removeClass("on");
        $("#showSetDateInput").hide();
        
        $("#pageviewCount").html(pageviewCount);
        $("#imageCount").html(imageCount);
        $("#linkCount").html(linkCount);
        $("#fileDownloadCount").html(fileDownloadCount);
    });
    $("#showSetDate").click(function(){
        $(this).addClass("on");
        $("#showAllDate").removeClass("on");
        $("#showSetDateInput").show();
        $("#showStartDate").val(''); 
        $("#showEndDate").val(''); 
    });
    var dateSearchDeferred = null;
    var dateRangeSearch = function(selectedDate) {
        var data = {start: (new Date($("#showStartDate").val())).Format("yyyy-MM-dd"),end: (new Date($("#showEndDate").val())).Format("yyyy-MM-dd")};

        // 设置最大最小时间
        if(this.id == 'showStartDate'){
            $("#showEndDate").datepicker('option', 'minDate', selectedDate);
        }else{
            $("#showStartDate").datepicker('option', 'maxDate', selectedDate);
        }

        if (/[^0-9-]/.test(data.start) || /[^0-9-]/.test(data.end)) {
            return;
        }
        if (dateSearchDeferred) {
            dateSearchDeferred.abort();
            dateSearchDeferred = null;
        }

        dateSearchDeferred = $.ajax({
        url : '/product/'+id+'/statistics.json?_='+Date.parse(new Date()),
            type: "GET",
            data: data,
            dataType: "json"
        });
        dateSearchDeferred
        .always(function() {
            dateSearchDeferred = null;
        })
        .then(function(data) {
            $("#pageviewCount").html(convertNum(data.statistics.pageview));
            $("#imageCount").html(convertNum(data.statistics.image));
            $("#linkCount").html(convertNum(data.statistics.link));
            $("#fileDownloadCount").html(convertNum(data.statistics.fileDownload));
        });
    };
    $("#showStartDate").datepicker({onSelect: dateRangeSearch});
    $("#showEndDate").datepicker({onSelect: dateRangeSearch});
}
