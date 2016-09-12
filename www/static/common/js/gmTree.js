;( function( $, window, undefined ) {
	'use strict';
	
	// global
	var $window = $( window ),
		Modernizr = window.Modernizr;

	$.DiyTree = function( options ) {
		this._init( options );
	};
	
	$.DiyTree.defaults = {
		url : '/area/tree.json?parentId=',  // 请求URL
		resListName: 'list',
		objId : 'areaTree',  // 树显示对象ID
		showTitle : 'cnName',  // 显示对象的字段名
		showKey : 'id',  // 交互使用的关键字段
		allSelect : false, // 是否有全选
		allSelectTitle : '全选',
		allSelectKey : 'all',
		diyInput : 'areaTree_set', // 自定义影藏字段存放值
		diyInputType : 'String', // 自定义影藏字段值类型; String,Array
		selectMode : 3,  // 树的显示类型
		checkbox : false,  // 是否有多选框
		pid : '', // 树根节点编号
		defValues : '', // 默认值
		defLeaf : new Array(), // 所有选中的叶子节点
		defPath : new Array(), // 所有选中的叶子节点的父级,无重复
		activateFuc : function(){},  // 单击元素回调事件
		showCount : false,  // 是否显示元素对应统计数，跟与名称之后
		showCountField: 'count', // 联系showCount属性，显示统计的字段名
		lazy : true, // 是否延迟加载
		allData : false,  // 是否一次加载所有数据
		selectedAllType : true, // 是否设置或获取所有被选中的节点，false:如果父节点被选中，则值返回父节点Key
		openSelected : false
	};
	$.DiyTree.prototype = {
		_init : function( options ) {
			this.options = $.extend( true, {}, $.DiyTree.defaults, options );
			this._validate();
			this.initTree();
		},
		_validate : function( options ) {
			if('' == this.options.url || null == this.options.url){
				this.options.url = '/area/tree.json?parentId=';
			}
			if('' == this.options.objId || null == this.options.objId){
				this.options.objId = 'areaTree';
			}
			if('' == this.options.checkbox || null == this.options.checkbox){
				this.options.checkbox = false;
			}
			if('' == this.options.showCount || null == this.options.showCount){
				this.options.showCount = false;
			}
			if('' == this.options.showTitle || null == this.options.showTitle){
				this.options.showTitle = 'cnName';
			}
			if('' == this.options.showKey || null == this.options.showKey){
				this.options.showKey = 'id';
			}
			if('' == this.options.diyInput || null == this.options.diyInput){
				this.options.diyInput = this.options.objId+'_set';
			}
		},
		initTree : function(){
			var self = this;
			if(null != self.options.pid && "" != self.options.pid){
				self.options.url = self.options.url+pid;
			}
			self._setDeaultValues();
			var lazyArea = function(event, data){
				var cpid = data.node.key;
				var lazyUrl = self.options.url;
				if(null != cpid && "" != cpid){
					lazyUrl = self.options.url+cpid;
				}
				if(cpid && cpid > 0){
					var chDefIds = new Array();
					$.ajax({
						url: lazyUrl,
						type:"GET",
						async:false,
						dataType: "json",
						success:function(objData){
							var lazyData = objData[self.options.resListName];
							lazyData = self._setShowTitle(lazyData, data.node.isSelected());
							data.result = lazyData;
						}
					});
				}
			};
			var selectedCallback = function(data){
				self._pushInputValue(data.node);
			};
			$.ajax({
				url:self.options.url,
				type: "GET",
				async:false,
				dataType: "json",
				success:function(resint){
					var jsonList = resint[self.options.resListName];
					jsonList = self._setShowTitle(jsonList, false);
					if(self.options.allSelect){
						var allObj = new Array();
						allObj.title = self.options.allSelectTitle;
						allObj.key = self.options.allSelectKey;
						allObj[self.options.showTitle] = allObj.title;
						allObj[self.options.showKey] = allObj.key;
						jsonList.splice(0, 0, allObj);
					}
					$("#"+self.options.objId).fancytree({ selectMode:self.options.selectMode, checkbox: self.options.checkbox,source: jsonList,
						icons:false,lazyLoad:lazyArea,activate: self.options.activateFuc,selectedCallback:selectedCallback });
					var hiddenInput = "<input type='hidden' id='"+self.options.objId+"_def' value='"+self.options.defValues+"' />";
					if(null != self.options.diyInput && "" != self.options.diyInput){
						hiddenInput += "<input type='hidden' id='"+self.options.diyInput+"' name='"+self.options.diyInput+"' value='"+self.options.defLeaf.join(",")+"' />";
					}
					$("#"+self.options.objId).append(hiddenInput);
					var allNode, allSelected = true;
					$("#"+self.options.objId).fancytree("getRootNode").visit(function(node){
						if (node.key == self.options.allSelectKey) {
							allNode = node;
						}
						if (!node.isSelected() && self.options.allSelect && node.key != self.options.allSelectKey) {
							allSelected = false;
						}
						if(!self.options.allData && lazyArea){
							if(self.options.defPath.in_array(node.key) > -1){
								self._setTreeChild(node);
							}
						}
					});
					allNode.setSelected(allSelected);
				}
			});
		},
		_setTreeChild : function(node){
			var self = this;
			if(node && node.key > 0 && node.key != self.options.allSelectKey){
				$.ajax({
					url:self.options.url+node.key,
					type: "GET",
					async:false,
					dataType: "json",
					success:function(resch){
						var chList = resch[self.options.resListName];
						chList = self._setShowTitle(chList, node.isSelected());
						node.addChildren(chList);
						node.visit(function(nodeli){
							if(self.options.defPath.in_array(nodeli.key) > -1){
								self._setTreeChild(nodeli);
							}
						});
					}
				});
			}
		},
		_setShowTitle : function(list, selected){
			var self = this;
			for(var i = 0; i < list.length; i++){
				list[i].selected = false;
				if(self.options.lazy && !list[i].leaf){
					list[i].lazy = true;
				}
				// 等于默认选中的节点
				if(self.options.defLeaf && self.options.defLeaf.length > 0 && self.options.defLeaf.in_array(list[i][self.options.showKey]) > -1){
					list[i].selected = true;
				}
				if(selected && self.options.selectMode != 1){
					list[i].selected = true;
				}
				if(self.options.defPath.in_array(list[i][self.options.showKey]) > -1 && self.options.openSelected){
					list[i].expanded = true;
				}
				list[i].title = list[i][self.options.showTitle] +
				((self.options.showCount && '' !== list[i][self.options.showCountField] && undefined !== list[i][self.options.showCountField])
						? "("+list[i][self.options.showCountField]+")" : '' );
				
				list[i].key = list[i][self.options.showKey];
				if(list[i].children && 'undefined' != list[i].children && list[i].children.length > 0){
					list[i].children = self._setShowTitle(list[i].children, list[i].selected);
				}
			}
			return list;
		},
		_setDeaultValues : function(){
			var self = this;
			var def = self.options.defValues.split(",");
			for(var i = 0; i < def.length; i++){
				var def_str = def[i];
				if("." == def[i].substr(def[i].length-1,1)){
					def_str = def[i].substring(0, (def[i].length-1));
				}
				var def_array = def_str.split(".");
				self.options.defLeaf.push(def_array[def_array.length-1]);
				for(var j =0; j < (def_array.length-1); j++){
					if(self.options.defPath.in_array(def_array[j]) == -1){
						self.options.defPath.push(def_array[j]);
					}
				}
			}
		},
		_pushInputValue : function(dataNode){
			var self = this;
			var inputId = (null != self.options.diyInput && "" != self.options.diyInput) ? self.options.diyInput : self.options.objId+"_set";
			var setV_a = new Array(),keyPath,start;
			if(dataNode.key == self.options.allSelectKey){
				if(dataNode.isSelected()){
					$("#"+self.options.objId).fancytree("getRootNode").visit(function(node){
						node.setSelected(true);
					});
				}else{
					$("#"+self.options.objId).fancytree("getRootNode").visit(function(node){
						node.setSelected(false);
					});
				}
			}else{
				$("#"+self.options.objId).fancytree("getRootNode").visit(function(node){
					if( node.isSelected() && node.key != self.options.allSelectKey) {
						var nodeSel = null;
						if(!self.options.selectedAllType){
							nodeSel = self._getSelectedParent(node);
						}
						if(null == nodeSel || !nodeSel){
							nodeSel = node;
						}
						
						start = setV_a.in_array(nodeSel.key);
						if(start == -1){
							setV_a.push(nodeSel.key);
						}
					}
				});
				if("String" == self.options.diyInputType){
					$("#"+inputId).val(setV_a.join(","));
				}else{
					$("#"+inputId).val(setV_a);
				}
			}
		},
		_getSelectedParent : function(node){
			var self = this;
			var parents = node.getParentList();
			var nodeSel = null;
			for(var i = 0; i < parents.length; i++){
				if(parents[i].isSelected()){
					nodeSel = parents[i];
					break;
				}
			}
			if(!nodeSel || null == nodeSel){
				nodeSel = node;
			}
			return nodeSel;
		},
		getTreeSelected : function(){
			var self = this;
			var ids = new Array();
			var tree = $("#"+self.options.objId).fancytree("getTree"),
			selNodes = tree.getSelectedNodes();
			selNodes.forEach(function(node) {
				ids.push(node.key);
			});
			if(null != self.options.diyInput && "" != self.options.diyInput){
				if("String" == self.options.diyInputType){
					$("#"+self.options.diyInput).val(ids.join(","));
				}else{
					$("#"+self.options.diyInput).val(ids);
				}
			}
			return ids.join(",");
		}
	};
})( jQuery, window );