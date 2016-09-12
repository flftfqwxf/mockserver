/**
 * Created by Administrator on 2015/11/13.
 */

window.weixinShareSDK && alert('该对象已存在，请检查是否有同名的对象！');
window.weixinShareSDK = {
    this: window.weixinShareSDK,
    init: function (opts) {
        //this.opts = $.extend({}, this.defaultOpts, opts || {});
        //try {
        //    wx.config(opts);
        //} catch (e) {
        //}
    },
    /**
     * 默认参数，将所有默认参数都放在此处
     */
    defaultOpts: {
        //arguments
        //.....
    },
    webWeiXinShare:function(title,imgUrl,content,checkSuccess,linkUrl){
    	if(!linkUrl){
    		linkUrl = location.href.split('#')[0];
    	}
    	var desc=title+"，"+content;
    	weixinShareSDK.shareTimeline(desc, linkUrl, imgUrl,checkSuccess);
        weixinShareSDK.shareAppMessage(title, content, linkUrl, imgUrl);
        weixinShareSDK.shareWeiBo(title, content,linkUrl, imgUrl);
        weixinShareSDK.shareQQ(title, content,linkUrl, imgUrl);
        weixinShareSDK.shareQZone(title, content,linkUrl, imgUrl);
    },
    /**
     * 首页微信分享
     * @param siteName
     * @param productCount
     */
    /*indexShare: function (siteName, productCount) {
    	var imgUrl;
	    if($('.swipe_item').eq(0).find('img').attr("src") == undefined){
	        imgUrl='http://static.gmmtour.com/m/theme/manage/images/web.jpg';
	    }else{
	        imgUrl = $('.swipe_item').eq(0).find('img').attr('src');
	    }
        var linkUrl = location.href.split('#')[0],
            shareTimelineTitle = siteName + '，甄选' + productCount + '款旅游产品让你随时玩转全球！',
            shareAppMessageDesc = '世界那么大，你想去哪里？甄选' + productCount + '款旅游产品让你随时玩转全球，进来看看吧！';
        weixinShareSDK.shareTimeline(shareTimelineTitle, linkUrl, imgUrl);
        weixinShareSDK.shareAppMessage(siteName, shareAppMessageDesc, linkUrl, imgUrl);
        weixinShareSDK.shareWeiBo(siteName, shareAppMessageDesc,linkUrl, imgUrl);
        weixinShareSDK.shareQQ(siteName, shareAppMessageDesc,linkUrl, imgUrl);
        weixinShareSDK.shareQZone(siteName, shareAppMessageDesc,linkUrl, imgUrl);
    },*/
    /**
     * 列表页微信分享
     * @param siteName
     * @param productCount
     */
    /*listShare: function (siteName, productCount, place) {
        this.siteName = siteName;
        this.place = place;
        var typeList = {'abroad': '出境', 'domestic': '国内', 'around': '周边'};
        var palceList = {'abroad': '全球', 'domestic': '中国', 'around': '四川'};
        var which="";
        if (place) {
        	which=typeList[place];
            place = palceList[place];
        }
        if (!place) {
        	which=typeList['abroad']; 
            place = palceList['abroad'];
        }
        var linkUrl = location.href.split('#')[0],
            imgUrl = $('.swipe-wrap li').eq(0).find('img').attr('src'),
            shareTimelineTitle = siteName + '，甄选' + productCount + '款'+which+'产品让你随时玩转' + place + '！',
            shareAppMessageDesc = '世界那么大，你想去哪里？甄选' + productCount + '款'+which+'产品让你随时玩转' + place + '，进来看看吧！';
        weixinShareSDK.shareTimeline(shareTimelineTitle, linkUrl, imgUrl);
        weixinShareSDK.shareAppMessage(siteName, shareAppMessageDesc,linkUrl, imgUrl);
        weixinShareSDK.shareWeiBo(siteName, shareAppMessageDesc,linkUrl, imgUrl);
        weixinShareSDK.shareQQ(siteName, shareAppMessageDesc,linkUrl, imgUrl);
        weixinShareSDK.shareQZone(siteName, shareAppMessageDesc,linkUrl, imgUrl);
    },*/
    /**
     * 详情页 微信分享
     * @param siteName
     * @param productCount
     */
   /* detailShare: function (siteName, productName, price) {
        var linkUrl = location.href.split('#')[0],
            imgUrl = $('.swipe-wrap li').eq(0).find('img').attr('src'),
            shareTimelineTitle = productName + '，特价' + price + '元起，' + siteName + '为您服务！',
            shareAppMessageDesc = '特价' + price + '元起，' + siteName + '为您服务！';
        weixinShareSDK.shareTimeline(shareTimelineTitle, linkUrl, imgUrl);
        weixinShareSDK.shareAppMessage(productName, shareAppMessageDesc, linkUrl, imgUrl);
        weixinShareSDK.shareWeiBo(productName, shareAppMessageDesc,linkUrl, imgUrl);
        weixinShareSDK.shareQQ(productName, shareAppMessageDesc,linkUrl, imgUrl);
        weixinShareSDK.shareQZone(productName, shareAppMessageDesc,linkUrl, imgUrl);
    },*/
    /**
     * 主站微信分享
     * @param siteName
     * @param productCount
     */
    infoShare: function (infoTitle, linkUrl, imgUrl, summary) {
        linkUrl = linkUrl.split('#')[0];
        weixinShareSDK.shareTimeline(infoTitle, linkUrl, imgUrl);
        weixinShareSDK.shareAppMessage(infoTitle, summary,linkUrl, imgUrl);
        weixinShareSDK.shareWeiBo(infoTitle, summary,linkUrl, imgUrl);
        weixinShareSDK.shareQQ(infoTitle, summary, linkUrl, imgUrl);
        weixinShareSDK.shareQZone(infoTitle, summary, linkUrl, imgUrl);
    },
    /**
     * 在获取后产品数后，重新初始化列表页分享
     * @param productCount
     */
    reSetShareNumAndShare: function (productCount) {
        this.listShare(this.siteName, productCount, this.place);
    },
    /**
     * 分享到朋友圈
     * @param title
     * @param link
     * @param imgUrl
     */
    shareTimeline: function (title, link, imgUrl,checkSuccess) {
        var opts = {
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                if(checkSuccess){            
                    var weiXinSuccess=document.getElementById("weiXinSuccess"),mask=document.getElementById("mask");
                   share_tips=document.getElementById("share_tips");
                    weiXinSuccess.style.display="block";
                    mask.style.display="block";
                    share_tips.style.display="none";
                }
            },
            cancel: function () {
                //alert('cancel');
                // 用户取消分享后执行的回调函数
            }
        };
        try {
            wx.onMenuShareTimeline(opts);
            //alert(3);
        } catch (e) {
            //alert(2);
        }
    }
    ,
    /**
     * 分享到朋友
     * @param title
     * @param link
     * @param imgUrl
     * @param type
     * @param dataUrl
     */
    shareAppMessage: function (title, desc, link, imgUrl, type, dataUrl) {
        var opts = {
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: type, // 分享类型,music、video或link，不填默认为link
            dataUrl: dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        };
        try {
            wx.onMenuShareAppMessage(opts);
        } catch (e) {
        }
    }
    ,
    /**
     * 分享到QQ
     * @param opts
     */
    shareQQ: function (title, desc, link, imgUrl) {
    	 var opts = {
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        };
        try {
            wx.onMenuShareQQ(opts);
        } catch (e) {
        }
    }
    ,
    /**
     * 分享到微博
     * @param opts
     */
    shareWeiBo: function (title, desc, link, imgUrl) {
    	var opts = {
	        title: title, // 分享标题
	        desc: desc, // 分享描述
	        link: link, // 分享链接
	        imgUrl: imgUrl, // 分享图标
	        success: function () {
	            // 用户确认分享后执行的回调函数
	        },
	        cancel: function () {
	            // 用户取消分享后执行的回调函数
	        }
	    };
        try {
            wx.onMenuShareWeibo(opts);
        } catch (e) {
        }
    }
    ,
    /**
     * 分享到QQ空间
     * @param opts
     */
    shareQZone: function (title, desc, link, imgUrl) {
    	var opts = {
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        };
        try {
            wx.onMenuShareQZone(opts);
        } catch (e) {
        }
    }
}
;




