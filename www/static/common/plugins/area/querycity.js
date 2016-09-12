(function($){
    $.querycity = function(input,options){
        var input = $(input);
        input.attr('autocomplete','off');
        if($.trim(input.val())=='' || $.trim(input.val())==options.defaultText){ 
            input.val(options.defaultText).css('color','#757575');
        }
        var t_pop_focus = false;
        var t_suggest_focus = false;
        var t_suggest_page_click = false;
        options.selector.append("<div id='pop_city_"+input.attr('id')+"' class='pop_city' style='display:none'><p class='pop_head'></p><ul class='list_label'></ul><div class='pop_city_container'></div></div>");
        options.selector.append("<div id='suggest_city_"+input.attr('id')+"' class='list_city' style='display:none'><div class='list_city_head'></div><div class='list_city_container'></div><div class='page_break'></div></div>");
        var popMain = $("#pop_city_"+input.attr('id'))
        var popContainer = popMain.find('.pop_city_container');
        var labelMain = popMain.find('.list_label');
        var suggestMain = $("#suggest_city_"+input.attr('id'));
        popMain.bgIframe();
        suggestMain.bgIframe();
        popInit();
        
        input.focus(function(){
            if(t_suggest_page_click){
                t_suggest_page_click = false;
                return true;
            }
            suggestMain.hide();
		    if($.trim($(this).val()) != "" && ($.trim($(this).val())==options.defaultText || $.trim($(this).val()) == $(this).attr('placeholder'))){
		    	$(this).val('').css('color','#757575');
	    	} else {
	    		$(this).css('color','#000');
	    	}
		    popMain.show();
        }).click(function(){		
            if(t_suggest_page_click){
                t_suggest_page_click = false;
                return;
            }
            suggestMain.hide();
		    popMain.show();		
	    }).blur(function(){				
		    if(t_pop_focus == false){
			    popMain.hide();				
			    if($.trim(input.val())=='' || $.trim(input.val())==options.defaultText){
			    	input.css('color','#757575');
			    	options.defaultText && input.val(options.defaultText);
			    }
		    }
	    });
        labelMain.find('a').on('click',function(event){	
		    input.focus();//使焦点在输入框，避免blur事件无法触发
		    t_pop_focus = true;
		    var labelId = $(this).attr('id');
		    labelMain.find('li a').removeClass('current');
		    $(this).addClass('current');
		    popContainer.find('ul').hide();
		    $("#"+labelId+'_container').show();
		    event.preventDefault();
	    });
	    popContainer.find('a').on('click',function(event){
	    	event.preventDefault();
		    options.callback && typeof options.callback === 'function' && options.callback({
		    	"inputText": $(this).html(),
		    	"inputId": $(this).attr("cityId")
		    });
		    popMain.hide();
	    });
	    popMain.mouseover(function(){	
		    t_pop_focus = true;
	    }).mouseout(function(){	
		    t_pop_focus = false;
	    });

        input.blur(function(){
		    if( t_suggest_focus == false ){
		    	options.callback && typeof options.callback === 'function' && options.callback({
			    	"inputText": suggestMain.find('.list_city_container a.selected').children('b').text(),
			    	"inputId": suggestMain.find('.list_city_container a.selected').children('b').attr("cityId")
			    });
			    if($(this).val()==''){
			    	$(this).css('color','#757575');
			    }    
			    suggestMain.hide().find('.selected').removeClass('selected');
		    }
        }).keydown(function(event){
            popMain.hide();
    		event = window.event || event;
	    	var keyCode = event.keyCode || event.which || event.charCode;		
		    if (keyCode == 37) {//左
                prevPage();    
            } else if (keyCode == 39) {//右
                nextPage();
            }else if(keyCode == 38){//上
                prevResult();
            }else if(keyCode == 40){//下
                 nextResult();
            }
    	}).keypress(function(event){
            event = window.event || event;
            var keyCode = event.keyCode || event.which || event.charCode;
            if(13 == keyCode){
                if(suggestMain.find('.list_city_container a.selected').length > 0){
				    options.callback && typeof options.callback === 'function' && options.callback({
				    	"inputText": suggestMain.find('.list_city_container a.selected').children('b').text(),
				    	"inputId": suggestMain.find('.list_city_container a.selected').children('b').attr("cityId")
				    });
				    suggestMain.hide();
                }
            }
        }).keyup(function(event){
            event = window.event || event;
            var keyCode = event.keyCode || event.which || event.charCode;        
            if(keyCode != 13 && keyCode != 37 && keyCode != 39 && keyCode !=9 && keyCode !=38 && keyCode !=40 ){
			    //keyCode == 9是tab切换键
                queryCity(); 
            }
        });
      
        suggestMain.find('.list_city_container').on('click','a',function(event){
            event.preventDefault();
		    options.callback && typeof options.callback === 'function' && options.callback({
		    	"inputText": $(this).children('b').text(),
		    	"inputId": $(this).children('b').attr("cityId")
		    });
            suggestMain.hide();
        }).on('mouseover','a',function(){
            t_suggest_focus = true;
        }).on('mouseout','a',function(){
            t_suggest_focus = false;
        });
        suggestMain.find('.page_break').on('mouseover','a',function(){
            t_suggest_focus = true;    
        }).on('mouseout',function(){
            t_suggest_focus = false;   
        });
	    suggestMain.find('.page_break').on('click','a',function(event){
            event.preventDefault();
            t_suggest_page_click = true;
            input.click();   
		    if($(this).attr('inum') != null){
			    setAddPage($(this).attr('inum'));
    		}
	    });

        function nextPage(){
              var add_cur= suggestMain.find(".page_break a.current").next();
                if (add_cur != null) {                
                    if ($(add_cur).attr("inum") != null) {
                        setAddPage($(add_cur).attr("inum"));
                    }
                }
        }
        function prevPage(){
                var add_cur = suggestMain.find(".page_break a.current").prev();
                if (add_cur != null) {
                    if ($(add_cur).attr("inum") != null) {
                        setAddPage($(add_cur).attr("inum"));
                    }
                }
        }
        function nextResult(){
                  var t_index = suggestMain.find('.list_city_container a').index(suggestMain.find('.list_city_container a.selected')[0]);
                    suggestMain.find('.list_city_container').children().removeClass('selected');          
                    t_index += 1;
                    var t_end =  suggestMain.find('.list_city_container a').index( suggestMain.find('.list_city_container a:visible').filter(':last')[0]);
                    if(t_index > t_end ){
                        t_index = suggestMain.find('.list_city_container a').index(suggestMain.find('.list_city_container a:visible').eq(0));
                    } 
                    suggestMain.find('.list_city_container a').eq(t_index).addClass('selected'); 
        }
        function prevResult(){
                 var t_index = suggestMain.find('.list_city_container a').index(suggestMain.find('.list_city_container a.selected')[0]);
                suggestMain.find('.list_city_container').children().removeClass('selected');
                t_index -= 1;
                var t_start = suggestMain.find('.list_city_container a').index(suggestMain.find('.list_city_container a:visible').filter(':first')[0]);
                if( t_index < t_start){
                    t_index = suggestMain.find('.list_city_container a').index(suggestMain.find('.list_city_container a:visible').filter(':last')[0]);
                }
                suggestMain.find('.list_city_container a').eq(t_index).addClass('selected');      
        }
       
    	function loadCity(){		
	    	var cityList = suggestMain.find('.list_city_container');		
		    cityList.empty();
            if(options.hotList){
                var hotList = options.hotList;
            }else{
                var hotList = [0,1,2,3,4,5,6,7,8,9];
            }
	    	for(var item in hotList){
			    if(item>options.suggestLength){
				    return;
			    }
			    var _data = options.data[hotList[item]];
			    if(typeof (_data.pinyin) != "undefined"){
			    	cityList.append("<a href='javascript:void(0)' ><span>"+_data.pinyin+"</span><b cityId='"+_data.id+"'>"+_data.cn_name+"</b></a>");
			    }
		    }		
    		suggestMain.find('.list_city_head').html(options.suggestTitleText);
            setAddPage(1);
	    	suggestMain.show();
		    setTopSelect();
	    }
    	
    	/*查询城市*/
    	function queryCity(){
            popMain.hide();
            var value = input.val();
            if( value.length == 0){
                loadCity();
                return; 
            }
            var city_container = suggestMain.find('.list_city_container');        
		    var isHave = false;
            var _tmp = new Array();
            var _tmp2 = new Array();
            for(var item in options.data){			
                var _data = options.data[item];		
                if(typeof (_data.pinyin) != "undefined"){
                	if(_data.pinyin.toLowerCase().indexOf(value) == 0 || _data.prefix.toLowerCase().indexOf(value) == 0 || _data.cn_name.indexOf(value) ==0 || _data.en_name.toLowerCase().indexOf(value) ==0 ){
                		isHave = true;
                		 _tmp.push(_data);
                	}
                	if(_data.pinyin.toLowerCase().indexOf(value) > 0 || _data.prefix.toLowerCase().indexOf(value) > 0 || _data.cn_name.indexOf(value) > 0 || _data.en_name.toLowerCase().indexOf(value) > 0 ){
                		isHave = true;
                		_tmp2.push(_data);
                	}
                }
             } 
            _tmp=_tmp.concat(_tmp2);
		    if(isHave){
                city_container.empty();
                for(var item in _tmp){
	                var _data= _tmp[item];
	                if(typeof (_data.pinyin) != "undefined"){
	                	city_container.append("<a href='javascript:void(0)' style='display:none'><span>"+_data.pinyin+"</span><b cityId='"+_data.id+"'>"+   _data.cn_name+"</b></a>");
	                }
                }
			    suggestMain.find('.list_city_head').html(value+",按拼音排序");
                setAddPage(1);
                setTopSelect()
    		}else{
	    		suggestMain.find('.list_city_head').html("<span class='msg'>对不起,找不到"+value+"</span>");
		    }
            suggestMain.show();
	    }
        function setAddPage(pageIndex){
            suggestMain.find('.list_city_container a').removeClass('selected');
            suggestMain.find('.list_city_container').children().each(function(i){			
                var k = i+1;
                if(k> options.suggestLength*(pageIndex-1) && k <= options.suggestLength*pageIndex){
                    $(this).css('display','block');
                }else{
                    $(this).hide();    
                }
             });
            setTopSelect();
            setAddPageHtml(pageIndex);
        }
        function setAddPageHtml(pageIndex){
            var cityPageBreak = suggestMain.find('.page_break');
            var pageIndex = parseInt(pageIndex);
            cityPageBreak.empty();
            if(suggestMain.find('.list_city_container').children().length > options.suggestLength){
                var pageBreakSize = Math.ceil(suggestMain.find('.list_city_container').children().length/options.suggestLength);	
    			if(pageBreakSize <= 1){
	    			return;
		    	}			
                var start = end = pageIndex;
                for(var index = 1,num = 1 ; index < options.pageLength && num < options.pageLength; index++){
                    if(start > 1){
                        start--;
                        num++;
                    }
                    if(end<pageBreakSize){
                        end ++;
                        num++;
                    }
                }
                if(pageIndex > 1){
                    cityPageBreak.append("<a href='javascript:void(0)' inum='"+(pageIndex-1)+"'>&lt;-</a>");
                }	
                
                for(var i=start;i<=end;i++){
                    if(i == pageIndex){
                        cityPageBreak.append("<a href='javascript:void(0)' class='current' inum='"+(i)+"'>"+(i)+"</a");
                    }else{
                        cityPageBreak.append("<a href='javascript:void(0)' inum='"+(i)+"'>"+(i)+"</a");
                    }        
                }         
			    if (pageIndex<pageBreakSize) {
                    cityPageBreak.append("<a href='javascript:void(0);' inum='"+ (pageIndex+1) +"'>-&gt;</a>");
                }
                cityPageBreak.show();           
            }else{
                cityPageBreak.hide();    
            }
	    	return;
        }
	    function setTopSelect(){		
		    if(suggestMain.find('.list_city_container').children().length > 0 ){
			    suggestMain.find('.list_city_container').children(':visible').eq(0).addClass('selected');
		    }
	    }
        function onSelect(){
            if( typeof options.onSelect == 'function'){
                alert(1);
            }
        }
        function popInit(){
            var index = 0;
            popMain.find('.pop_head').html(options.popTitleText+"<span class='close'>x</span>");
    		for(var itemLabel in options.tabs){		
			    index++;			
			    if(index == 1){
				    popContainer.append("<ul id='label_"+input.attr('id')+index+"_container' class='current' data-type='"+itemLabel+"'></ul>");
				    labelMain.append("<li><a id='label_"+input.attr('id')+index+"' class='current' href='javascript:void(0)'>"+itemLabel+"</a></li>");
			    }else if(itemLabel != "in_array"){
				    popContainer.append("<ul style='display:none' id='label_"+input.attr('id')+index+"_container' data-type='"+itemLabel+"'></ul>");
				    labelMain.append("<li><a id='label_"+input.attr('id')+index+"' href='javascript:void(0)'>"+itemLabel+"</a></li>");		
			    }
			    for(var item in options.tabs[itemLabel]){
				    var cityCode = options.tabs[itemLabel][item];
					 if(!options.data[cityCode]){
						   break;
	    			  }				
					 $("#label_"+input.attr('id')+index+"_container").append("<li><a href='javascript:void(0)' cityId="+options.data[cityCode]["id"]+">"+options.data[cityCode]["cn_name"]+"</a></li>");
			    }
		    }			
        }
        function resetPosition(){
          /*  popMain.css({'top':input.position().top+input.outerHeight(),'left':input.position().left});
            suggestMain.css({'top':input.position().top+input.outerHeight(),'left':input.position().left});*/
        }
    }
    $.fn.querycity = function(options){
        var defaults = {
            'data'          : {},
            'tabs'          : '',
            'hotList'       : '',            
            'defaultText'   : '中文/拼音',
            'popTitleText'  : '请选择城市或输入城市名称的拼音或英文',
            'suggestTitleText' : '输入中文/拼音或↑↓选择',
            'suggestLength' : 10,
            'pageLength'    : 5, 
            'onSelect'      : '' 
        };
        var options = $.extend(defaults,options);
        this.each(function(){
            new $.querycity(this,options);            
        });
        return this;
    };
})(jQuery);


(function($){
$.fn.bgIframe = $.fn.bgiframe = function(s) {
	if ( $.browser.msie && /6.0/.test(navigator.userAgent) ) {
		s = $.extend({
			top     : 'auto', // auto == .currentStyle.borderTopWidth
			left    : 'auto', // auto == .currentStyle.borderLeftWidth
			width   : 'auto', // auto == offsetWidth
			height  : 'auto', // auto == offsetHeight
			opacity : true,
			src     : 'javascript:void(0);'
		}, s || {});
		var prop = function(n){return n&&n.constructor==Number?n+'px':n;},
		    html = '<iframe class="bgiframe" frameborder="0" tabindex="-1" src="'+s.src+'"'+
		               ' style="display:block;position:absolute;z-index:-1;"/>';
		return this.each(function() {
			if ( $('> iframe.bgiframe', this).length == 0 ){
				$(document).append(html);
			}
		});
	}
	return this;
};
})(jQuery);
