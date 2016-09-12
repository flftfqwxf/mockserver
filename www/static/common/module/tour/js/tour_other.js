var constractdata;
((function($, w){
	getContract();
	function addTips(data){
		var ids = [],type = this;
		$.each(data||[],function(){
			ids.push(this.id);
		});
		if(null != Tour.current.lineId && Tour.current.lineId > 0){
			$.getJSON("/"+type+"/list.json?line="+Tour.current.lineId,function(d){
				var h = "";
				$.each(d[(type=="visa"?"visaArea":type)+"s"]||[],function(){
					if($.inArray(this.id,ids)>-1){
						this.selected = true;
					}
					h += template("tmp_"+type+"s",this);
				})
				h && $("#custom-tips-list").append($(h)).show().next(".notation-tips").show();
				d.visaAreas && !d.visaAreas.length && $(".daily_other_item_m").hide(); // 签证问题
			});
		}
	}
	
	$body = $(".input_body #other");
	var submitFormStatus = true;
	var inited = false;
	var module = {
			hide : function(){
				$("#nextBtn").show();
				$("#btnSave").hide();
				$body.hide();
			},
			show : function(){
				$("#nextBtn").hide();
				$("#btnSave").show();
				$body.show();
			},
			clear : function(){
				inited = false;
				$body.html("");
			},
			isInit : function(){
				return inited;
			},
			init : function(){
				inited = true;
				// 设置页面模板内容
				var data = $.extend({}, Tour.current.data, {"random" : Math.random()});
				data.product.contract = constractdata;
				data.product.refundRule = data.product.refundRule || 1
				var $content = $(template("tmp_step_other", data));
				$body.html($content);
				$("#nextBtn").hide();
				$("#btnSave, #btnSave1").click(function(){
					Tour.current.module.submitForm.call(this);
				}).css({"display":"inline-block"});
				// 初始化编辑器
				$content.find("textarea[tag=edit]").each(function(){
					var editor = initUEditor({textareaObj: $(this), touristLineId:Tour.current.lineId, textlength:$(this).attr("maxlength")? $(this).attr("maxlength"):20000, galleryImageTypeObj: $("#editorGalleryImageType")});
				});
				//补充条款 编辑器特殊处理
				$content.find("textarea[tag=editOther]").each(function(){
					supplementaryTermEditor =initUEditor({
						 textareaObj: $(this), 
						 touristLineId:Tour.current.lineId,
						 textlength:$(this).attr("maxlength")? $(this).attr("maxlength"):20000,
						 galleryImageTypeObj: $("#editorGalleryImageType"),
						 pasteplain:false,
						 autoTransWordToList:false,
						 retainOnlyLabelPasted:false,
						 removeStyle:false
					 });
				});
				$.each(["tip","visa"],function(i){
					$("#custom-tips-list").html("");
					addTips.call(this,data[this+(i==1?"Area":"")+"s"]);
				});
				
				//退款项初始化
				$("#refundRules .info_set>.set-status").each(function(){
					refund($(this));
				});

				$("#refundRules .info_set>.set-status").each(function(){
					$(this).click(function(){
						$(this).removeClass("eat_active").addClass("eat_active");
						refund($(this));//退款处理
					});
				});
				
				// 初始化事件
				$this_content = $(".step_other");
				
				$this_content.on("click",".info_set>.set-status",function(){
					setTableOrTaxtarea($(this));
					
				})
				.on("click", ".J_addBtn", addTr)
				.on("click", ".set-notation", function(){
					var checkbox = $(this).find("i");
					var field = $(this).attr("set-data-name");
					var name = checkbox.attr("attr_name");
					var value = checkbox.attr("value");
					var isCheck = $(this).attr("attr_check").Trim();
					var index = -1;
					$.each(Tour.current.data[field]||[],function(i){
						if(this.id == value*1){ index = i; }
					});
					if("checked" == isCheck){
						$(this).attr("attr_check", "");
						$(this).removeClass("eat_active");
						checkbox.removeClass("active");
						// 改变数据
						Tour.current.data[field].splice(index, 1);
					}else{
						$(this).attr("attr_check", "checked");
						$(this).addClass("eat_active");
						checkbox.addClass("active");
						// 改变数据
						if(index == -1){
							Tour.current.data[field] = Tour.current.data[field] ? Tour.current.data[field] : [];
							Tour.current.data[field].push({id : value*1});
						}
					}
				});


				$(".example_demo").hover(function(){
					$(".example_demo_box").show();
				},function(){
					$(".example_demo_box").hide();
				})

				// 初始化自费项目、购物点;默认一行
				$.each("customSelfPaid,customShop".split(","),function(){
					if(data && data[this]){
						$($("#"+this+"Input").find(".info_set").find(".J_radio[value=1]").parent()).click();
						var nameStr = this + 'Description';
                           var curEditor= UE.getEditor($("#"+this+"Input").find(".consInfoDesc").find("textarea").attr('editorId'));
                           curEditor.ready(function () {
                               curEditor.setContent(data[nameStr]);
                           });
					}else{
						var nameStr = this == 'customSelfPaid'? 'selfPaids': 'shops';
						if(data[nameStr]){
							for(var i = 0; i < data[nameStr].length; i++){
								var this_data = data[nameStr][i];
								this_data.initIndex = i;
								addTr.call($("#"+this+"Input").find(".J_addBtn"), this_data);
							}
						}
						$($("#"+this+"Input").find(".info_set").find(".J_radio[value=0]").parent()).click();
					}
				});

			},
			// 修改data里面的数据
			modifyPricesDate: function(ts) {
				
				var subDATA = ts.product.items;
	
				for (var i=0;i<subDATA.length;i++){
							for (var j = 0; j < subDATA[i].prices.length; j++) {
								if(subDATA[i].prices[0].bed === "false"){
								if (subDATA[i].prices[j].type === "儿童占床" || subDATA[i].prices[j].type === "儿童不占床" || !subDATA[i].prices[j].price) {
									subDATA[i].prices.splice(j, 1);
										this.modifyPricesDate(ts);
								}
							}

								if(subDATA[i].prices[0].bed === 'true'){
								if (subDATA[i].prices[j].type === "儿童价" || !subDATA[i].prices[j].price) {
									subDATA[i].prices.splice(j, 1);
										this.modifyPricesDate(ts);
								}
							}
						}
								}
			},
			submitForm : function(){
				if(submitFormStatus) {
					submitFormStatus = false;
					// 删除空白的自费项目和购物点
					var vaildSt = Tour.utils.vaildDatas();
					var $this = $(this);

				if (0 == $("input[name=customSelfPaid]").val()) {
					$("tr[data-name='selfPaids']").each(function() {
						var name = $(this).find("input[name='name']").val();
						var stayTime = $(this).find("input[name='stayTime']").val();
						var price = $(this).find("input[name='price']").val();
						var description = $(this).find("input[name='description']").val();

					});
				}
				if (0 == $("input[name=customShop]").val()) {
					$("tr[data-name='shops']").each(function() {
						var time = $(this).find("input[name='time']").val();
						var name = $(this).find("input[name='name']").val();
						var stayTime = $(this).find("input[name='stayTime']").val();
						var description = $(this).find("input[name='description']").val();

					});
				}
				if (!vaildSt) {
					submitFormStatus = true;
					return false;
				}

				if (window.Placeholders && !window.Placeholders.nativeSupport)
					window.Placeholders.disable(Tour.current.docForm);
				$("textarea[tag=edit]").each(function() {
					UE.getEditor($(this).attr('editorId')).execCommand('removePlaceHolder');
					//KindEditor.removePlaceholder($(this));
				});

				Tour.current.jsondom.refresh();
				var dataItems = $.extend(true,{}, Tour.current.jsondom.data());
				module.modifyPricesDate(dataItems);
				var jsonData = {};
				jsonData.tour = dataItems;
				jsonData.product = dataItems.product;
				
				addRefundData(jsonData.product);
				
				jsonData.product.productDestinations=jsonData.product.productDestinations||[];
				
				var productDestinations=[];
				$(".select2-selection--multiple .select2-selection__choice").each(function(i,v){
				    var areaId=$(this).attr("id"),
				    	has=false;
				    for(var i=0;i<jsonData.product.productDestinations.length;i++){
					if(jsonData.product.productDestinations[i].area.id==areaId){
					    has=true;
					    productDestinations.push(jsonData.product.productDestinations[i]);
					    break;
					}
				    }
				    if(!has){
					productDestinations.push({area:{id:areaId}});
				    }
				});
				
				jsonData.product.productDestinations=productDestinations;
				
				var submitData = Tour.current.jsondom.formData(jsonData);
			
				// formData 后删除不需要的数据 如：飞机名称
				for (var i = submitData.length - 1; i >= 0; i--) {
					var nameString = submitData[i].name;
					var nameArray = nameString.split(".flight.");
					if (nameArray.length > 1) {
						if (nameArray[1] != 'id' || "" == submitData[i].value || null == submitData[i].value) {
							submitData[i] = null;
							submitData.splice(i, 1);
						}
					}
					var nameHotelArray = nameString.split(".hotel.");
					if (nameHotelArray.length > 1) {
						if (nameHotelArray[1] == 'id' && ("" == submitData[i].value || null == submitData[i].value)) {
							submitData[i] = null;
							submitData.splice(i, 1);
						}
					}
				}

					$this.text('保存中').addClass('btn-primary common-loading').removeClass('btn-info');

					$.post('/product.json',submitData,function(d){
						if(typeof d == "string")
							d = eval('(' + d + ")");
						if(d.result && d.result.success == false){
						        submitFormStatus = true;
							$.gmMessage(d.result.message,true);
							return;
						}
						$.unbindbeforeout();
						$.gmMessage("操作成功",true);
						setTimeout(function(){
							submitFormStatus = true;
                            location.href = "/product?line="+(Tour.current.lineId || (Tour.current.data.product.touristLine && Tour.current.data.product.touristLine.id));
						},1000);
						// 老版本关闭当前窗口，回调修改前打开页面的状态
						//opener && opener.location.reload();
					}).fail(function(){
						setTimeout(function(){
							submitFormStatus = true;
						},1000);
						$.gmMessage("保存失败，请稍后重试");
					}).always(function(){
						Placeholders.enable(Tour.current.docForm);
						$this.text('确认保存').removeClass('btn-primary common-loading').addClass('btn-info');
					});
				}
			},
			submit : function(){
				var vaildSt = Tour.utils.vaildDatas();
				if(!vaildSt) return false;
				// 记录数据
				Tour.current.jsondom.refresh($body);
				
				// 清除
				return true;
			}
	}
	
	w.Tour = w.Tour || {};
	w.Tour.module = w.Tour.module || {};
	w.Tour.module.other = w.Tour.module.other || {};
	$.extend(w.Tour.module.other, module);
}))(jQuery, window);

//表格添加栏目
function addTr(data){
	var $tar = $(this).prev("table").find("tbody");
	if($tar.find("tr").length>49){
		$.alert("最多添加50条");
		return false;
	}
	var tr = $(template($(this).attr("rel"),data || {}));
	$tar.append(tr);
	//if($tar.find("tr").length == 1){
	//	$(tr).find(".selfTr").remove();
	//}
}

//填写表格 or 输入一段话
function setTableOrTaxtarea(obj){
	obj.parent().find(".set-status").each(function(){
		$(this).removeClass("eat_active").find(".J_radio").removeClass("active");
	});
	var setStatus = obj.find(".J_radio").attr("value");
	obj.parent().find(".checkbox-value").val(setStatus);
	obj.addClass("eat_active").find(".J_radio").addClass("active");
	if(setStatus == 1){
		obj.parent().parent().find(".consInfoDesc").show();
		obj.parent().parent().find(".consInfo").hide();
	}else{
		obj.parent().parent().find(".consInfo").show();
		var defLi = obj.parent().parent().find(".consInfo").find("table").find("tbody");
		//if(defLi.find("tr").length < 1){
		//	obj.parent().parent().find(".consInfo").find(".J_addBtn").click();
		//}
		obj.parent().parent().find(".consInfoDesc").hide();
	}
}

/*自费项目 最近使用*/
function getSelfpaidTyping(){
	var dialog_Selfpaid = $.artDialog({
		title: '最近使用 <div><input type="text" name="keyword"  class="alert_input"  id="typing_keyword" ><button id="typing_query" class="theme_but_h30 theme_but_h30_m">查询</button></div>',
        width: 680,height: 400,padding: "0px",zIndex: '1002',
        isOuterBoxShadow: false, isClose: true, lock: true, fixed: true,
        content: '正在加载，请稍候。。。',
        ok: function () {
        	var data = getTypingData();
        	if((null != data.text && "" != data.text) || data.list.length > 0){
	        	if(data.custom){
	        		$($("#customSelfPaidInput").find(".info_set").find(".J_radio[value=1]").parent()).click();
                    var curEditor= UE.getEditor($("#customSelfPaidInput").find(".consInfoDesc").find("textarea").attr('editorId'));
                    curEditor.ready(function () {
                        curEditor.setContent(data.text);
                    });
	        	}else{
	        		$($("#customSelfPaidInput").find(".info_set").find(".J_radio[value=0]").parent()).click();
	        		var dataList = data.list;
	        		
	        		$(".consInfo table tbody tr", $("#customSelfPaidInput")).each(function(){
	        			Tour.current.jsondom.remove($(this));
	        		});
	        		for(var i = 0; i < dataList.length; i++){
	        			addTr.call($("#customSelfPaidInput").find(".J_addBtn"), dataList[i]);
	        		}
	        	}
        	}
        },
        okVal: '确认',
        okCssClass: 'btn-process',
        cancel: function () {},
        cancelVal: '取消',
        cancelCssClass: 'aui_state_highlight'
	});


	setDialogSearch("/typing/selfpaid", dialog_Selfpaid);
	$(".aui_close").css("display","none");
}

/*购物点 最近使用*/
function getShopsTyping(){
	var dialog_Shops = $.artDialog({
		title: '最近使用 <div><input type="text" name="keyword"  class="alert_input"  id="typing_keyword" ><button id="typing_query" class="theme_but_h30 theme_but_h30_m">查询</button></div>',
        width: 680,height: 400,padding: "0px",zIndex: '1002',
        isOuterBoxShadow: false, isClose: true, lock: true, fixed: true,
        content: '正在加载，请稍候。。。',
        ok: function () {
        	var data = getTypingData();
        	if((null != data.text && "" != data.text) || data.list.length > 0){
	        	if(data.custom){
	        		$($("#customShopInput").find(".info_set").find(".J_radio[value=1]").parent()).click();
                    var curEditor= UE.getEditor($("#customShopInput").find(".consInfoDesc").find("textarea").attr('editorId'));
                    curEditor.ready(function () {
                        curEditor.setContent(data.text);
                    })
	        	}else{
	        		$($("#customShopInput").find(".info_set").find(".J_radio[value=0]").parent()).click();
	        		var dataList = data.list;
	        		$(".consInfo table tbody tr",$("#customShopInput")).each(function(){
	        			Tour.current.jsondom.remove($(this));
	        		});
	        		for(var i = 0; i < dataList.length; i++){
	        			addTr.call($("#customShopInput").find(".J_addBtn"), dataList[i]);
	        		}
	        	}
        	}
        },
        okVal: '确认',
        okCssClass: 'btn-process',
        cancel: function () {},
        cancelVal: '取消',
        cancelCssClass: 'aui_state_highlight'
	});
	setDialogSearch("/typing/shop", dialog_Shops);
	$(".aui_close").css("display","none");
}


function setDialogSearch(uri, dialog){
	var thisUri = uri;
	$.ajax({
		url: thisUri,
		type:"GET",
		dataType: "html",
		success:function(objData){
			try {
				var json = eval("(" + objData + ")");
				dialog.close();
				$.gmMessage("请重新登录", false);
				return false;
			} catch(e) {
			}
			dialog.content(objData);
			$("#typing_query").on("click", function(){
				query_click();
			});
		},
		error: function(){
			dialog.close();
			$.alert("加载最近使用失败！请刷新重试", "提示", "warning", function(){ });
		}
	});
	function query_click(){
		if(uri.indexOf("?") >0){
			thisUri = uri + "&keyword=" + escape($("#typing_keyword").val());
		}else{
			thisUri = uri+"?keyword=" + escape($("#typing_keyword").val());
		}
		$.ajax({
			url: thisUri+"&_="+Date.parse(new Date()),
			type:"GET",
			dataType: "html",
			success:function(objData){
				try {
					var json = eval("(" + objData + ")");
					dialog.close();
					$.gmMessage("请重新登录", false);
					return false;
				} catch(e) {
				}
				dialog.content(objData);
				$("#typing_query").on("click", query_click);
			}
		});
	}
}
function getTypingData(){
	var data = {};
	data.custom = true;
	data.text = "";
	data.list = [];
	$("input[name='typing_set']:checked").each(function(){
		if($(this).val() == true || $(this).val() == "true"){
			data.custom = true;
			data.text = ($(this).parents(".typing_li").find(".typing_info_body").html()).LTrim().RTrim();
		}else{
			data.custom = false;
			$(this).parents(".typing_li").find(".data_li").each(function(){
				var shopLi = {};
				$(this).find("td").each(function(){
					shopLi[$(this).attr("title_name")] = $(this).text();
				});
				data.list.push(shopLi);
			});
		}
	});
	return data;
}

/*退款*/
function refund($obj){
	var indexVal=$obj.find("i").attr("data-value");
	var active=$obj.hasClass("eat_active");
	if(active){
		$(".rulesInfo>div").remove();
		
		if(indexVal == 2){

			var data = Tour.current.data;
			var refundItem = data.product.refundItem;

			if(refundItem){
				refundItem = JSON.parse(data.product.refundItem);

				var first = refundItem[0];
				var last = refundItem[refundItem.length - 1];

				// 删除首位数组
				refundItem.shift()
				refundItem.pop()

				refundItem = {
					list:refundItem,
					first:first,
					last:last,
				}
			}else{

				refundItem = {
					first:{},
					list:[{}],
					last:{}
				}
			}

			$(".rulesInfo").append(template("rules_2", refundItem));


			/*自定义退款规则*/
			//初始化“删除”按钮
			$(".rules_base .J_delRules").click(function(){
					$(this).parent().remove();
					var len= $(".J_delRules").length;
					if(len ==0 ){
						$(".J_first_add").removeClass("hidden");
					}else{
						$(".J_first_add").addClass("hidden");
					}
			});
			
			//初始“添加规则”化按钮
			$(".rules_base .J_addRules").click(function(){
				var len= $(".J_delRules").length;
				if(len < 6){
					console.log("init_"+len);
					$(".rules_base").append($("#tmp_rules").html());
					controllRules();
				}else{
					return;
				}
			});
			
			//第一个“添加规则” 按钮
			$(".rules_base .J_first_add").click(function(){
				$(".rules_base").append($("#tmp_rules").html());
				$(".J_first_add").addClass("hidden");
				controllRules();
			});
			
		}else{
			$(".rulesInfo").append($("#rules_"+indexVal).html());
		}
	}
}

/*自定义退款规则*/
function controllRules(){
	//只允许添加8条
	var len=$(".J_addRules").length-1;
		$(".J_addRules:eq("+len+")").click(function(){
			if(!$(".J_first_add").hasClass("hidden")){
				$(".J_first_add").addClass("hidden");
			}
			if($(".J_addRules").length < 6){
				console.log("last_"+$(".J_addRules").length);
				$(".rules_base").append($("#tmp_rules").html());
				controllRules();
			}else{
				return;
			}
			
		});
	$(".J_delRules:eq("+len+")").click(function(){
		$(this).parent().remove();
		len= $(".J_delRules").length;
		console.log(len);
		if(len ==0 ){
			$(".J_first_add").removeClass("hidden");
		}else{
			$(".J_first_add").addClass("hidden");
		}
	});
}

function addRefundData(product) {
	product.contract = null;
	product.refundRule=$("#refund_rule_id").find(".active").attr("data-value");
	var abroadValue = $("#abroad").val();
	if (abroadValue=="true") {
		product.abroad=1;
	}else {
		product.abroad=0;
	}
	product.supplementaryTerm = $('[editorid="provision"]').val();
	if (product.refundRule==2) {
		var itemjson = [];
		$(".refundItem").each(function(i) {
			var begin = $(this).find("input:first").val();
			var percent = $(this).find("input:last").val();
			 if (i==0) {
				 itemjson.push({beign:begin,end:0,percent:percent,index:i});  
			 } else if(i==$(".refundItem").length-1) {
				 itemjson.push({beign:begin,end:0,percent:percent,index:i});  
			 } else {
				 var end =  $(this).find("input:eq(1)").val();;
				 itemjson.push({beign:begin,end:end,percent:percent,index:i});  
			 }
		});
		product.refundItem = JSON.stringify(itemjson);
	} else {
		product.refundItem = "";
	}
}

function getContract() {
	var contract = $("#contract").val();
	var abroad = $("#abroad").val();
	var contracturl = $("#contracturl").val();
	if(contract && contract =="true") {
		 $.ajax({
			 url : contracturl,
	         type: 'GET',
	         async: true,
	         dataType: 'html',
	         data:{abroad:abroad,m:Math.random()}
	     })
	     .done(function(result,response) {
	         constractdata = unescape(result);
	     })
	     .fail(function() {
	         console.log("contract error");
	     });
	} 
}