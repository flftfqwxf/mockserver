var category = {
    init: function(){
        var self = this;

        this.types = ['category', 'tourtype', 'line']; // 每一级对应的id
        this.keys = {start: '0'};
        this.els = {
            subBtn: $('#addProduct'),
            txt: $('#selectTxt')
        };

        $.each(this.types, function(i, n){
            self.els[n] = $('#' + n);
            self.keys[n] = '';
        });

        this.getResource(function(res){
            self.resource = res;
            self._creat('category', self.keys.start);
            self.bindEvts();
        });
    },
    // 获取数据 
    getResource: function(callback){
        $.getJSON('/touristline.json?_=' + Math.random(), function(res){
            var result = {
                "0": {
                    "0": "国内游",
                    "1": "出境游",
                    "2": "邮轮/游船"/*,
                    "3": "飞机/火车票",
                    "4": "景点门票",
                    "5": "通讯",
                    "6": "租车",
                    "7": "交通",
                    "8": "签证",
                    "9": "酒店",
                    "10": "保险"*/
                },
                "0,0": {
                    "group": "国内跟团游",
                    "free": "国内自由行",
                    "local": "当地参团"
                },
                "0,0,group": {},
                "0,0,free": {},
                "0,0,local": {},
                "0,1": {
                    "group": "出境跟团游",
                    "free": "出境自由行",
                    "local": "当地参团"
                },
                "0,1,group": {},
                "0,1,free": {},
                "0,1,local": {},
                "0,2": {
                    "ship-0": "国际邮轮",
                    "ship-1": "国内邮轮"
                },
                "0,2,ship-0": {},
                "0,2,ship-1": {}
                /*"0,3": {
                    "ticket-0": "飞机票",
                    "ticket-1": "火车票"
                },
                "0,3,ticket-0": {},
                "0,3,ticket-1": {},
                "0,4": {
                    "ticket-0": "境外门票",
                    "ticket-1": "国内门票"
                },
                "0,4,ticket-0": {},
                "0,4,ticket-1": {},
                "0,5": {
                    "contact-0": "境外WiFi",
                    "contact-1": "境外电话卡",
                    "contact-2": "国内WiFi"
                },
                "0,5,contact-0": {},
                "0,5,contact-1": {},
                "0,5,contact-2": {},
                "0,6": {
                    "rentCar-0": "国内租车",
                    "rentCar-1": "国际租车"
                },
                "0,6,rentCar-0": {},
                "0,6,rentCar-1": {},

                "0,7": {
                    "traffic-0": "巴士",
                    "traffic-1": "接送",
                    "traffic-2": "地铁",
                    "traffic-3": "包车"
                },
                "0,7,traffic-0": {},
                "0,7,traffic-1": {},
                "0,7,traffic-2": {},
                "0,7,traffic-3": {}*/
            };

            $.each(res.touristlines, function(i, n){
                if(n.region == 1){ // 国内
                    result['0,0,group'][n.id] = n.name;
                    result['0,0,free'][n.id] = n.name;
                    result['0,0,local'][n.id] = n.name;
                }else{
                    if(n.shipLine){ // 游轮
                       result['0,2,ship-0'][n.id] = n.name;
                       result['0,2,ship-1'][n.id] = n.name;
                    }else{ //国外
                        result['0,1,group'][n.id] = n.name;
                        result['0,1,free'][n.id] = n.name;
                        result['0,1,local'][n.id] = n.name;
                    }
                }
            });

            callback(result);
        });
    },
    // 生成模版
    getHtml: function(res){
        var htmls = '';
        
        $.each(res, function(k, v){
            htmls += '<li><a href="javascript:void(0);" data-value="'+ k +'">'+ v +'</a></li>';
        });

        return htmls;
    },
    // query 品类id  key 对应数据的key值
    _creat: function(query, key){
        var el = this.els[query];
        var hideKey = 'line';

        el.find('ul').html(this.getHtml(this.resource[key]));
        el.removeClass('hide');
        this.els.subBtn.attr('disabled', true);

        // 生成的不是最后一组则隐藏
        if(query != hideKey){
            this.els[hideKey].addClass('hide');
        }
    },
    // 设置显示文案
    setTips: function(){
        var self = this,
            keys = self.keys,
            start = keys.start,
            sp = '<i class="gmIcon gm-arrow"></i>',
            txt = '';

        $.each(self.types, function(i, n){
            var key = keys[n],
                suffix = txt ? sp : '';

            if(key === '') return false;

            txt += suffix + self.resource[start][key];
            start += ',' + key;
        });

        self.els.txt.html(txt);
    },
    bindEvts: function(){
        var self = this;

        $.each(self.types, function(i, n){
            self.els[n].on('click', 'a', function(){
                var value = $(this).data('value'),
                    txt = '',
                    key;

                $.each(self.types, function(ii, nn){
                    if(i == ii){
                        self.keys[nn] = value;
                    }
                    if(ii > i){
                        self.keys[nn] = '';
                    }
                });

                if(i == 0){
                    key = self.keys.start + ',' + value;
                }else if(i == 1){
                    key = self.keys.start + ',' + self.keys.category + ',' + value;
                }else if(i == 2){
                    self.els.subBtn.attr('disabled', false);
                }

                self.setTips();
                $(this).parent().addClass('active').siblings().removeClass('active');

                if(self.types[i + 1]){
                    self._creat(self.types[i + 1], key);
                }                
            });
        });

        self.els.subBtn.on('click', function(){
            var tourtype = self.keys.tourtype.replace(/\-\d+/g, '');
            var abroad = 0;
            if(tourtype=="ship") {
            	   var a = self.keys.tourtype.replace(/ship-/g, '');
            	   if (a==0) {
            		   abroad = 1; //国际
            	   }
            }
            var localTour = 0;
            if (tourtype=="local") {
            	tourtype = 'group';
            	localTour = 1;
            }
           location.href = '/product/input?tourtype='+ tourtype +'&localTour=' + localTour + '&line=' + self.keys.line+"&abroad="+abroad;
        });
    }
}

$(function(){
    category.init();
});