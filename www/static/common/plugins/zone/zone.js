/**
 * Created by cai on 2015/5/12.
 */



(function ($) {

    $.fn.selectZone = function (arg) {



        var targetObj = $(this);
        var textContainer = $(arg.textContainer);

        var totalLength = hostArea['childrens'].length;
        var totalChildrens = hostArea['childrens'];
        var htmlHead = "";
        var htmlFooter = "";


        var proDom = "";
        var cityDom = "";

        //var AGArr = [];
        //var HKArr = [];
        //var LSArr = [];
        //var TZArr = [];

        var arrByFirstLetter = {"ABCDEFG": [], "HIJK": [], "LMNOPQRS": [], "TUVWXYZ": []};
        //alert(arrByFirstLetter.length)

        var firstLetter = ""

        var provinceText = "";
        var cityText = "";
        var resultText = "";

        var isClicked = false;
        var isHavePro=false;

        //拼接dom的前面部分
        htmlHead += '<div class="select-zone">';
        htmlHead += '<ul class="name-title">';
        htmlHead += '<li class="name-title-li under-line province-title"><span class="ft ft0">省份</span></li>';
        htmlHead += '<li class="name-title-li city-title"><span class="ft ft1">城市</span></li>';
        //htmlHead+='<li class="name-title-li"><span class="ft">区县</span></li>';
        //htmlHead+='<li class="name-title-li"><span class="ft">街道</span></li>';
        htmlHead += '</ul>';
        htmlHead += '<div class="active-box">';

        //拼接dom的后面部分
        htmlFooter = "</div></div>";


        //alert(totalLength)
        //添加省
        //A B C D E F G
        var initProvince = function () {
            proDom = "";
            for (var i = 0; i < totalLength; i++) {
                if (totalChildrens[i].parentId == 11) {
                    //如果为省，然后判断首字母索引
                    firstLetter = totalChildrens[i].pinyin.substr(0, 1);
                    //

                    if ("ABCDEFG".indexOf(firstLetter) != -1) {
                        arrByFirstLetter["ABCDEFG"].push(totalChildrens[i]);
                    }
                    if ("HIJK".indexOf(firstLetter) != -1) {
                        arrByFirstLetter["HIJK"].push(totalChildrens[i]);
                    }
                    if ("LMNOPQRS".indexOf(firstLetter) != -1) {
                        arrByFirstLetter["LMNOPQRS"].push(totalChildrens[i]);
                    }
                    if ("TUVWXYZ ".indexOf(firstLetter) != -1) {
                        arrByFirstLetter["TUVWXYZ"].push(totalChildrens[i]);
                    }

                }
            }

            proDom += "<div class='pro'>";
            for (j in arrByFirstLetter) {
                proDom += "<div class='pro-kind-one clearfix'>";
                proDom += "<div class='index-e'>" + j + "</div>";
                proDom += "<ul class='pro-ul'>";

                for (var k = 0; k < arrByFirstLetter[j].length; k++) {
                    proDom += "<li pid=" + arrByFirstLetter[j][k].id + " class='pro-one'><span>" + arrByFirstLetter[j][k].cn_name + "</span></li>";
                }

                proDom += "</ul>";
                proDom += "</div>";
            }

            //$(htmlHead+proDom+htmlFooter).appendTo($("html"))
            //$(htmlHead+proDom+htmlFooter).appendTo(targetObj)

            //初始化位置，于选择原始想左下角
            targetObj.css({position: "relative"});
            $(".select-zone").css({left: 0, top: targetObj.height() + 2});

        }


        //给每个省绑定事件

        $(targetObj).on("click",".pro-one", function (e) {
            e.stopPropagation();
            //alert($(this).attr("pid"))
            var indexPid = parseInt($(this).attr("pid"));
            provinceText = $(this).text();
            var cityChildrens;

            cityDom = "";
            $(".city-ul").empty();
            cityDom += '<div class="city">';
            cityDom += '<ul class="city-ul clearfix">';

            for (var i = 0; i < totalLength; i++) {
                if (totalChildrens[i].id == indexPid) {
                    cityChildrens = totalChildrens[i].childrens;
                    for (var c =0; c < cityChildrens.length; c++) {
                        cityDom += '<li data_obj=\'' + JSON.stringify(cityChildrens[c]) + '\' cid=' + cityChildrens[c].id + ' class="city-one"><span>' + cityChildrens[c].cn_name + '</span> </li>';
                    }
                }
            }

            cityDom += '</ul>';
            cityDom += '</div>';

            $(cityDom).appendTo(".active-box");
            $(".pro").css("display", "none");
            $(".ft1").css("visibility", "visible");

            resultText = " ";
            resultText += provinceText;
            textContainer.text(resultText);
            isHavePro=true;
        })

        //点击出现下拉框
        targetObj.on("click",targetObj,function (e) {
            e.stopPropagation();
            if (!isClicked) {
                $(htmlHead + proDom + htmlFooter).appendTo(targetObj)
                isClicked = true;
            }
            $(".select-zone").css("display", "block");

        })

        //对每个市绑定事件,选择好城市之后移除dom
        targetObj.on("click",".city-one", function (e) {
            e.stopPropagation();
            cityText = $(this).text();
            resultText += cityText;
            textContainer.text(resultText);

            isClicked = false;
            var data = eval('(' + $(this).attr("data_obj") + ')');
            arg.callBack(data);
            $(".select-zone").remove();
            $(".select-zone").hide();
        })


        //重新选择省份
        targetObj.on("click",".ft0",function (e) {
            e.stopPropagation();
            $(".city").css("display", "none");
            $(".ft1").css("visibility", "hidden");
            $(".pro").css("display", "block");
        })

        //点击空白处移除dom
        $("html").on("click",function(e){
            if(isHavePro){
                $(".select-zone").hide();
            }else{
                $(".select-zone").remove();
                isClicked=false;
            }
        })


        initProvince();

    }


})(jQuery)

