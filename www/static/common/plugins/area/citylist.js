				var labelFromcity = new Array();
				labelFromcity ['热门'] = new Array();
				labelFromcity ['ABCD'] =  new Array();
				labelFromcity ['EFGH'] =  new Array();
				labelFromcity ['IJKL'] =  new Array();
				labelFromcity ['MNOP'] =  new Array();
				labelFromcity ['QRST'] =  new Array();
				labelFromcity ['UVWX'] =  new Array();
				labelFromcity ['YZ'] = new Array();
				var hotList=new Array(0,1,2,3,4,5,6,7,8,9,101,111,120);
				citysFlight=citysFlight.sort(function(a,b){
					return a.prefix.charCodeAt(0) > b.prefix.charCodeAt(0) ? 1 : -1;
				});
				
				for(var i=0;i<citysFlight.length;i++){	
				    if(citysFlight[i] != undefined){
				    	if(citysFlight[i].cn_name=="成都"){
				    		labelFromcity ['热门'].unshift(i);
				    	}
				    	if(	citysFlight[i].cn_name=="天津"||citysFlight[i].cn_name=="北京"||
					    	citysFlight[i].cn_name=="上海"||citysFlight[i].cn_name=="杭州"||
					    	citysFlight[i].cn_name=="广州"||citysFlight[i].cn_name=="青岛"||
				    		citysFlight[i].cn_name=="南京"||citysFlight[i].cn_name=="武汉"||
				    		citysFlight[i].cn_name=="郑州"||citysFlight[i].cn_name=="长沙"||
				    		citysFlight[i].cn_name=="深圳"||citysFlight[i].cn_name=="西安"||
				    		citysFlight[i].cn_name=="合肥"||citysFlight[i].cn_name=="重庆"||
				    		citysFlight[i].cn_name=="汉口"||citysFlight[i].cn_name=="济南"||
				    		citysFlight[i].cn_name=="苏州"||citysFlight[i].cn_name=="沈阳"||
				    		citysFlight[i].cn_name=="济南"||citysFlight[i].cn_name=="香港"||
				    		citysFlight[i].cn_name=="大连"||citysFlight[i].cn_name=="三亚"||
				    		citysFlight[i].cn_name=="宁波"||citysFlight[i].cn_name=="厦门")
				    	{
				    		labelFromcity ['热门'].push(i);
				    	}
				         firstLetter = citysFlight[i].pinyin.substr(0, 1);
				         if ("ABCD".indexOf(firstLetter) != -1) {
				        	 labelFromcity ['ABCD'].push(i);
				         }
				         if ("EFGH".indexOf(firstLetter) != -1) {
				        	 labelFromcity ['EFGH'].push(i);
				         }
				         if ("IJKL".indexOf(firstLetter) != -1) {
				        	 labelFromcity ['IJKL'].push(i);
				         }
				         if ("MNOP".indexOf(firstLetter) != -1) {
				        	 labelFromcity ['MNOP'].push(i);
				         }
				         if ("QRST".indexOf(firstLetter) != -1) {
				        	 labelFromcity ['QRST'].push(i);
				         }
				         if ("UVWX".indexOf(firstLetter) != -1) {
				        	 labelFromcity ['UVWX'].push(i);
				         }
				         if ("YZ".indexOf(firstLetter) != -1) {
				        	 labelFromcity ['YZ'].push(i);
				         }
				    }
				 }