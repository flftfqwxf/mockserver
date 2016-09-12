/**
 * jsondom 1.0
 * author: heyadong
 * date: 2015-07-29
 * update : 2015-07-29
 * email: 28528313@qq.com
 * 
 * 	JSON 与 DOM 结构绑定
 *  
 * 	功能: 当DOM任意层级添加/删除一个数据元素. 调用jsondom.refresh() 后：JSON会响应DOM结构变化..新增数据或删除数据..包含数组中元素的删除移动 
 * 		  如果你的数据是通过JSON渲染的可以很容易的实现 “草稿”的功能
 *  使用要求：
 *  	1.DOM 提交渲染的数据 必须经过 JS JSON渲染.
 *  	2.渲染的时候.需要为数组类型的数据添加  data-index属性.. 假设100条记录.由于考虑到前端性能.DOM只加载了3条数据.其余数据懒加载. jsondom需要知道对应下标,否则无法维护对应数据关系
 *  	
 *   
 *  例子
 *  var tour = {
 *  	trips : [
 *  			{
 *  			brief : "第一天行程内容",
 *  			traffics : [{
 *  				type : "飞机",
 *  				shift : "XDF-5545"
 *  			}],
 *  			schedules : [
 *  				{
 *  					time : "07:21",
 *  					description : "上飞机"
 *  						
 *  				},
 *  				{
 *  					time : "21:21",
 *  					description : "吃饭"
 *  						
 *  				}
 *  			]
 *  		},
 *  	]
 *  }
 *  
 *  DOM 结构
 *  <div>
 *  	<div data-name="trips" data-type="array" data-index=0 data-del-target>
 *  		<input name=brief value="第一天行程内容" />
 *  
 *  		<div data-name="traffics" data-type="array" data-index=0 data-del-target >
 *  				<input name="type" value="飞机" />
 *  				<input name="shift" value="XDF-5545" />
 *  				<span data-del-action> 删除</span>
 *  		</div>
 *  
 *    		<div data-name="schedules" data-type="array" data-index=0 data-del-target >
 *  				<input name="time" value="07:21" />
 *  				<input name="description" value="上飞机" />
 *  				<span data-del-action> 删除</span>
 *  		</div>
 *  		<div data-name="schedules" data-type="array" data-index=1 data-del-target >
 *  				<input name="time" value="21:21" />
 *  				<input name="description" value="吃饭" />
 *  				<span data-del-action> 删除</span>
 *  		</div>
 *  	</div>
 *  </div>
 *  
 *  FAQ:
 *  	1.数组类型为什么 每个数组元素的DOM指定数组名和类型   <div data-name="schedules" data-name="type">
 *  	 而不是父层元素指定名称 <div data-name="schedules" data-name="type"><div 数组元素 /></div>
 *  	答 : 避免破坏DOM结构. 影响CSS, JS根据parent相对定位 层级关系指定
 *  	
 */
(function($, w){
	//属性集
	var attr_dataname = "data-name";
	var attr_dataname_pattern = "[data-name]";
	var attr_index = "data-index";
	var attr_type = "data-type";
	var attr_disable = "data-disable";
	//插入. value数组下标- 保留占不支持
	var attr_insert = "data-insert";
	
	var array_utils =  {
		remove : function(arr, idx){
			if (arr.length <= idx || idx < 0) {
				console.error("index less the array length", "array:",arr, "index:",idx);
			} else {
				for (var i = idx; i < arr.length -1; i++) {
					arr[i] = arr[i+1];
				}
				arr.length = arr.length-1;
			}
		},
		insert : function(arr, v, idx){
			idx = idx===undefined || idx > arr.length ? arr.length : idx;
			for (var i = arr.length; i > idx; i--) {
				arr[i] = arr[i-1];
			}
			arr[idx] = v;
		}
	}
	
	var utils = {
		 isArray : function(dom){
			return dom.attr(attr_type) == "array";
		},
		isBoolean : function(dom) {
			return dom.attr(attr_type) == "Boolean" || dom.attr(attr_type) == "boolean";
		}
	
	}
	
	
	var jsonToInput = function(json,p){
		var data = [];
		$.each(json,function(k,v){
			if(v == null)
				return;
			var o = {},n = (p?(p+"."):"")+k.replace("_",".");
			if($.isArray(v)){
				$.each(v,function(i){
					data = data.concat(jsonToInput(this,n+"["+i+"]"))
				})
			}else if($.isPlainObject(v)){
				data = data.concat(jsonToInput(this,n))
			}else{
				o.name = n;
				o.value = v;
				data.push(o);
			}
		});
		return data;
	}
	
	
	var service = function($json, $dom){
		
		
		var op = {
				destory : function(){
					$($dom).off("click", "[data-del-action]");
				},
				data : function(){
					return $json;
				},
				event : {	
					beforeRemove : [function(action, target){return true}],
					afterRemove : [function(action, target){}]
					
				},
				remove : function(element){
					var pnode = $json;
					var parents = element.parents(attr_dataname_pattern);
					for (var i = parents.length - 1; i >= 0; i--) {
						var pdom = $(parents[i]);
						var pname = pdom.attr(attr_dataname);
						if (utils.isArray(pdom)) {
							//有下标.则出初化过了.
							if (pdom.attr(attr_index)) {
								pnode = pnode[pname][pdom.attr(attr_index)];
							} else {
								element.remove();
								return;
							}
						} else {
							if (pnode[pname]) {
								pnode = pnode[pname];
							} else {
								element.remove();
								return;
							}
							
						}
						
						
					}
					
					if (utils.isArray(element)) {
						if (element.attr(attr_index)) {
							var idx = parseInt(element.attr(attr_index));
							var dataname = element.attr(attr_dataname);
							array_utils.remove(pnode[dataname], idx);
							//同级元素为已经设置index向前移位.新元素不需要位移
							element.parent().find(">["+attr_dataname+"='"+dataname+"']["+attr_index+"]["+attr_type+"=array]").each(function(){
								var currIdx = parseInt($(this).attr(attr_index));
								if (currIdx > idx) {
									$(this).attr(attr_index, parseInt(currIdx - 1));
								}
							});
						}
						element.remove();	
					} else {
						delete pnode[element.attr("name")];
						element.remove();
					}
				},
				refresh : function(dom){
					//局部DOM刷新或全局DOM刷新
					dom = dom || $dom;
					var pnode = $json;
					$(":input[name]", dom).each(function(){
						var input = $(this);
						if (input.attr("data-disable")) {
							return;
						}
						var parents = input.parents(attr_dataname_pattern);
						for (var i = parents.length - 1; i >= 0; i--) {
							
							var pdom = $(parents[i]);
							var pname = pdom.attr(attr_dataname);

							if (!pnode[pname]) {
								pnode[pname] = utils.isArray(pdom) ? [] : {};
							}
							
							if (utils.isArray(pdom)) {
								if (pdom.attr(attr_index)) {
									var idx = pdom.attr(attr_index)
									pnode = pnode[pname][idx];
								} else {
									var nextIdx = pnode[pname].length;
									pdom.attr(attr_index, nextIdx);
									var d = {};
									pnode[pname].push(d);
									pnode = d;
								}
								
							} else {
								pnode = pnode[pname];
							}
						}
						
						
						var key = input.attr("name");
						var v = input.val();

						//boolean类型区分是否填写.即 null/true/false
						if (utils.isBoolean(input)) {
							if (v !== "") {
								pnode[key] = (v === "1" || v === "true" || v === 1);
							} else {
								pnode[key] = null;
							}
						} else {
							
							pnode[key] = v;
						}
						
						//重置
						pnode = $json;
						
					});

					return $json;
				},
				formData: function(data){
					return jsonToInput(data || $json);
				}
			}
		
		
		//删除事件绑定
		$($dom).on("click", "[data-del-action]", function(){
			var action = $(this);
			var target = action.closest("[data-del-target]");
			//删除类型 target.attr("del_target");
			var ok = true;
			
			for (var i = 0; i < op.event.beforeRemove.length && ok; i++) {
				ok = op.event.beforeRemove[i](action, target);
			}
			if (ok) {
                //在删除前需要先彻底销毁编辑器，否则会有编辑器的残留节点
                var editorObj=target.find("textarea[tag=edit][isinit=1]"),editorItem;
                if (editorObj.length) {
                    editorItem=UE.getEditor(editorObj.attr('editorId'))
                    editorItem.addListener('destroy', function (editor) {
                        ////删除百度编辑器销毁时的残留
                        //$('.edui-'+editorItem.key).remove();
                        //删除TEXTAREA及父元素
                        op.remove(target);

                    });
                    UE.getEditor(editorObj.attr('editorId')).completeDestroy();
                }else{
                    op.remove(target);
                }

				for (var i = 0; i < op.event.afterRemove.length; i++) {
					op.event.afterRemove[i](action, target);
				}
			}
		});
		
		return op;
	}
	
	var jsondom = {
			bind : function(json, dom){
				return service(json, dom);
			}
	}
	$.jsondom = jsondom;
})(jQuery, window);


