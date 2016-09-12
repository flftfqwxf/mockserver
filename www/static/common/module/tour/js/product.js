function useTemp(id){
	$.ajax({
		url : '/product/pcpage/' + id +"?_=" + Date.parse(new Date()),
		type: "GET",
		async:false,
		dataType: "html",
		success:function(datahtml){
			var tmpllist = $.dialog({
				title:false,
				width: 680,
		        height: 600,
		        padding : '5px 20px',
		        isOuterBoxShadow: false,
		        isClose: false,
		        content: datahtml,
		        lock: true,
		        fixed: true,
		        ok: function () {
		            var setTemplateIds = $("#setTemplateIds").val();
		            $.ajax({
		            	url : '/product/pcpage/' + id + "?_=" + Date.parse(new Date()),
		        		type: "POST",
		        		data:{templateIds:setTemplateIds},
		        		async:false,
		        		dataType: "json",
		        		success:function(data){
		        			if (typeof data === "string") {
		        				data = JSON.parse(data);
		        			}
		        			$.gmMessage(data.message);
		        		},error:function(){
		        			$.gmMessage("保存失败,请刷新重试");
		        		}
		            });
		        },
		        okVal: '保存',
		        okCssClass: 'btn-save',
		        cancel: function () {},
		        cancelVal: '取消',
		        cancelCssClass: 'btn-cancel'
			});
		}
	});
}
function setProductSaleStatus(obj, id){
	var st = $(obj).attr("attr_st");
	var text = $(obj).text();
	var url = '/product/'+id+'/onshelves.json?_='+Date.parse(new Date());
	if('ON' == st){
		url = '/product/'+id+'/offshelves.json?_='+Date.parse(new Date());
		st = 'OFF';
		text = '上架';
	}else{
		st = 'ON';
		text = '下架';
	}

	var updateStatus = function() {
		$.ajax({
			url : url,
			type: "GET",
			dataType: "json",
			success:function(data){
				$.gmMessage(data.result.message, true);
				if(data.result.success){
					$(obj).attr("attr_st", st);
					$(obj).text(text);
					$($(obj).parent().parent().find("td").get(1)).html("已"+(('ON' == st)?"上架":"下架"));
				}
			}
		});
	}

	if (st === "OFF") {
		$.dialog({
			title: false,
			width: 400,
			height: 120,
			padding : '0 20px',
			isOuterBoxShadow: false,
			content: '<p>产品下架后不能被分销商搜索到，且会自动从所有分销商的网站中自动下架，是否确认?</p>',
			lock: true,
			fixed: true,
			ok: false,
			//cancelCssClass: 'btn-process',
			cancel: function () {},
			cancelVal: '取消',
			button: [
				{
					name: '下架',
					className: 'btn-important',
					callback: function () {
						updateStatus();
					}
				}
			]
		});
	} else {
		updateStatus();
	}
}
function copyLink(id){
	$.ajax({
		url : '/product/sharelist/' + id + "?_=" + Date.parse(new Date()),
		type: "GET",
		dataType: "html",
		success:function(data){
			var showShareInfo = $.dialog({
		        title: '查看模板详情',
		        width: 680,
		        height: 300,
		        padding : '5px 20px',
		        isOuterBoxShadow: false,
		        isClose: false,
		        content: data,
		        lock: true,
		        fixed: true,
		        ok: false,
		        cancel: function () {},
		        cancelVal: '关闭',
		        cancelCssClass: 'btn-cancel'
		    });
		}
	});
}

// 删除产品
function deleteProduct(productId) {
	var deleteFun = function() {
		$.ajax({
			url : "/product/" + productId + ".json?_method=DELETE&_=" + Date.parse(new Date()),
			type: "DELETE",
			dataType: "json",
			success:function(data){
				$.gmMessage(data.result.message, true);
				window.location.href = window.location.href;
			}
		});
	}
	$.dialog({
		title: false,
		width: 400,
		height: 120,
		padding : '0 20px',
		isOuterBoxShadow: false,
		content: '<p>产品删除后不可恢复，是否确认?</p>',
		lock: true,
		fixed: true,
		ok: false,
		cancel: function () {},
		cancelVal: '取消',
		button: [
			{
				name: '删除',
				className: 'btn-important',
				callback: function () {
					deleteFun();
				}
			}
		]
	});
}
function sortLine(data) {
	$.post("/product/line-sort.json?_=" + Math.random(), data, function(d) {
		if (d && d.result && d.result.success) {
			loadData();
		}
	},'json');
}

function loadData() {
	var $searchName = $("#prodcutForm").find("input[name='name']");
	if ($searchName.val() == $searchName.attr("placeholder")) {
		$searchName.val("");
	}
	$("#prodcutForm").submit();
}
$(function(){
	$("#dropdown-statefields").on("click", "label", function() {
		var st = $(this).find("[attr_st]").attr("attr_st");
		$("#saleStatus").val(st);
		$("#prodcutForm").submit();
	});
	$("#dropdown-timingfields").on("click", "label", function(){
		$("#orderParam").val($(this).find("[attr_st]").attr("attr_st"));
		$("#prodcutForm").submit();
	});
	$(".list_search_but").click(function(){
		$("input[name='line']").val("");
		$("#prodcutForm").submit();
	});
	$(".list_search_but_cloes").click(function(){
		$("#likeName").val("");
		$("#prodcutForm").submit();
	});
	$(".tips_cloass").click(function(){
		$(this).parent().remove();
	});
	if($.cookie("productShowNumber") > 5){
		$("#product_title_tips").remove();
	}else{
		$.cookie("productShowNumber", $.cookie("productShowNumber")*1 + 1);
	}
	$(document).on("click", ".search-btn", function() {
		loadData();
	}).on("click", "#menu-line li:not('.dropdown')", function() {
		var line = $(this).find("a").attr("data-line-id");
		if (line) {
			$(":input[name='line']").val(line);
			$("input[name='lineSelect']").val(line);
			$(".J_add").attr("data-line-id", line);
			$("#curentLineName").text($(this).find("a").attr("data-title"));
		} else {
			$(":input[name='line']").val("");
			$("input[name='lineSelect']").val("");
		}
		var parent = $(this).parent();
		if(parent.hasClass("dropdown-menu") && 1 == parent.attr("data-order")) {
			var datas = {
				'line': $(":input[name='line']").val()
			};
			sortLine(datas);
		} else {
			loadData();
		}
        return false;
	}).on("click", ".input-group .J_clearSearch", function(){
		$("#likeName").val("");
		$("#prodcutForm").submit();
	}).on("click", "#btn-new-product,.add-product", function(){
		var line = $("input[name='line']").val();
		location.href = "/product/category";
	})
	// .on("mouseover", "[show-title]", function(d){
	// 	var _title = $(this).attr('show-title');
	//     $("body").append('<div id="tooltip"><pre style="white-space: pre-wrap!important;break-word:break-all;word-wrap:break-word;border:none;background:#000;color:#fff;">' + _title + "</pre></div>"); //创建提示框,添加到页面中
	//     var left = (d.pageX + 30) + "px", top=d.pageY + "px";
	//     if ($(this).hasClass('advert')) {
	//         left=(d.pageX -230) + "px";
	//         top=(d.pageY -130) + "px";
	//     }
	//     $("#tooltip").css({
	//         'z-index':3,
	//     		position: "absolute",
	//     		//maxWidth: "400px",
	//         //maxHeight: "400px",
	//         left: left,
	//         top: top,
	//         padding: '10px',
	//         //opacity: "0.8",
	//         background: "#000",
	//         breakWord: "break-all",
	//         wordWrap: "break-word",
	//         'white-space': "pre-wrap!important",
	//         'border-radius': '5px',
	//         'border': '1px solid #ccc'
	//     }).show(); //设置提示框的坐标，并显示
	// })
	.on("mouseout", "div[show-title],a[show-title],i[show-title]", function(d){
		//this.title = _title; //重新设置title
        $("#tooltip").remove() //移除弹出框
	});

	// $('.J_tooltip').each(function(){
	// 	$.ui.tooltip({
	// 		position: { my: "left top",at: "right+5 top-5"},
	// 		content: this.title
	// 	}, this);
	// });

	$('.J_tooltip').jTooltip({
		position: { my: "left bottom",at: "right+5 bottom-5"},
		content: function(){
			return this.title
		}
	});


	//3.6
    $(".m-btn-w").on("click",function(){//批量选择
		var t = $(".m-btn-w").eq(0).hasClass('active'),
		isFirst = $(this).hasClass('first-temp');
		if(!t && isFirst){
			$(".m-btn-w").not($(".m-btn-w").eq(0)).addClass('active');
			$(".modify_site").removeAttr("disabled");
			$(".currentProduct").find('em').text($(".m-btn-w.active").length);
		}else{
			if(!isFirst){
				$(".m-btn-w").eq(0).removeClass('active');
				$(".modify_site").removeAttr("disabled");
			}else{
				$(".m-btn-w").not($(".m-btn-w").eq(0)).removeClass('active');
				 $(".modify_site").attr("disabled","disabled");								
			}			
		}
	});
	$(".modify_site").on("click",function(){//批量删除
            var num=$(".m-btn-w.active").not($(".m-btn-w").eq(0)).length;
            var arr=[];
            $(".m-btn-w.active").not($(".m-btn-w").eq(0)).each(function(){//id
               arr.push($(this).text().trim())
            });
            var moredata=arr.join(",");
		    var deleteMore = function(){//ajax
				$.ajax({
					url : "/product/delete.json",
					type: "POST",
					dataType: "json",
                    data:products=moredata,
					success:function(data){
						$.gmMessage(data.result.message, true);
						window.location.reload();
					},
					error:function(){
						$.gmMessage(data.result.message, false);
					}
				});
			};

			$.dialog({//弹窗
				title: false,
				width: 400,
				height: 120,
				padding : '0 20px',
				isOuterBoxShadow: false,
				content: '<p>产品删除后不可恢复，确认删除'+num+'个产品?</p>',
				lock: true,
				fixed: true,
				ok: false,
				cancel: function () {},
				cancelVal: '取消',
				button: [
					{
						name: '删除',
						className: 'btn-important',
						callback: function () {
							deleteMore();
						}
					}
				]
		    });
	})

});

//库存设置
function reserve(productId,productName){
	console.log(productName)
    $.dialog({//弹窗
		title: "库存设置",
		width: 400,
		height: 120,
		padding : '0 20px',
		isOuterBoxShadow: false,
		content: '',
		lock: true,
		fixed: true,
		ok: false,
		cancel: false,
		button: [
			{
				name: '保存',
				className: 'btn-process aui_state_highlight',
				callback: function () {
					$.ajax({
						url : "/product/" + productId + "/seat.json",
						type: "POST",
						async:false,
						data:$("#reserveForm").serialize(),
						dataType: "json",
						success:function(data){					
		                    $.gmMessage("设置成功", true);                 
						}
					});
				}
			}
		],
		init:function(){
			$.ajax({
				url : "/product/" + productId + "/seat.json",
				type: "GET",
				async:false,
				dataType: "json",
				success:function(data){					
                    $(".aui_content").html(template("reserve_tem",data)); 
                    $(".reserve_title span").eq(1).html(productName);                  
				}
			});						
		}
	});
}




