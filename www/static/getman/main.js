var method = 'GET';
var url = '';
var header = {};
var body = '';
var send_type = 'remote';
var send_success = false;
var res_ip = '';
var res_body = '';
var res_header = {};
var res_cookie = '';
var res_code = 0;
var res_status = '';
var allow_origin = false;
var hst_idx = 0;
var hst = localStorage['history'] ? localStorage['history'].split(',') : [''];
var share_url ='';
var share_alias ='';

var status_list = {
    "200": "服务器已成功处理了请求",
    "302": "所请求的页面已经临时转移至新的位置",
    "304": "自从上次请求后，请求的网页未修改过。服务器返回此响应时，不会返回网页内容",
    "400": "服务器不理解请求的语法",
    "404": "服务器找不到请求的网页",
    "405": "请求中指定的方法不被允许",
    "500": "服务器遇到错误，无法完成请求",
    "502": "服务器作为网关或代理，从上游服务器收到无效响应",
    "503": "服务器暂时无法使用"
};

//-----------------------------------------------------------------------------------------------



function setHistory(url) {
    if (url != hst[0]) {
        hst.unshift(url);
        hst_idx = 0;
    }

    if (hst.length > 10) {
        hst.pop();
    }
    localStorage['history'] = hst.join(',');
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


function make_alert(msg, alert_style) {
    alert_style = arguments[1] ? arguments[1] : 'alert-warning';
    alert_html = '<div class="alert alert-dismissible ' + alert_style + '" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' + msg + '</div>';
    return alert_html;
}

function jsonStringify(data, space) {
    space = arguments[1] ? arguments[1] : 4;
    try {
        data = JSON.parse(data);
        console.log(data);
    } catch (err) {
        return data;
    }

    var seen = [];
    json = JSON.stringify(data, function (key, val) {
        if (!val || typeof val !== 'object') {
            return val;
        }
        if (seen.indexOf(val) !== -1) {
            return '[Circular]';
        }
        seen.push(val);
        return val;
    }, space);
    return json;
}

function ToCDB(str) {
    var tmp = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
        } else {
            tmp += String.fromCharCode(str.charCodeAt(i));
        }
    }
    return tmp;
}

function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}

function is_key(str) {
    if (str.match(/^[a-zA-Z0-9_]+$/g)) {
        return true;
    } else {
        return false;
    }
}

function is_kv(str) {
    var arr = str.split("\n");
    var flag = true;
    $.each(arr, function (i, kv) {
        var index = kv.indexOf(':');
        if (kv.length == 0)
            return true;
        if (index >= 0) {
            var key = kv.substr(0, index).trim();
            var value = kv.substr(index + 1).trim();
            if (is_key(key) == false) {
                flag = false;
            }
        } else {
            flag = false;
        }
    });
    return flag;
}

function kv_to_array(str) {
    var arr = str.split("\n");
    var json = {};
    $.each(arr, function (i, kv) {
        var index = kv.indexOf(':');
        if (index >= 0) {
            var key = kv.substr(0, index).trim();
            var value = kv.substr(index + 1).trim();
            json[key] = value;
        }
    });
    return json;
}

function array_to_raw(arr) {
    var str = '';
    $.each(arr, function (k, v) {
        str += k + '=' + v + '&';
    });
    return str.substring(0, str.length - 1);
}

function array_to_kv(arr) {
    var str = '';
    $.each(arr, function (k, v) {
        str += k + ': ' + v + '\n';
    });
    return str;
}

function array_to_xml(arr) {
    var str = '<?xml version="1.0" encoding="UTF-8" ?>';
    $.each(arr, function (k, v) {
        str += '<' + k + '>' + v + '</' + k + '>';
    });
    return str;
}

function array_to_form_data(arr) {
    str = '';
    $.each(arr, function (k, v) {
        str += "--GetmanFormBoundary\r\n";
        str += 'Content-Disposition: form-data; name="' + k + "\"\r\n\r\n";
        str += v + "\r\n";
    });
    str += '--GetmanFormBoundary--';
    return str;
}

function send_local(data) {
    jQuery.support.cors = true;
    var settings = {
        type: data.method,
        url: data.url,
        data: data.body,
        headers: data.header,
        complete: function (res) {
            res_header = {};
            res_cookie = '';
            res_body = res.responseText;
            res_code = res.status;
            res_status = res_code > 0 ? res_code + " " + res.statusText : res.statusText;
            send_success = res_code == 200 ? true : false;
            response_view();
        }
    };
    $.ajax(settings);
}

function send_remote(data) {
    var settings = {
        type: "POST",
        url: "postman/request",
        data: data,
        // headers: {
        //     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        // },
        complete: function (res) {
            try {
                json = JSON.parse(res.responseText);
            } catch (err) {
                json = {};
            }
            res_header = json.headers;
            res_cookie = json.cookie;
            res_body = json.body;
            res_code = json.errno;
            res_status = json.errmsg ? json.errmsg : res.statusText;
            send_success = res_code == 200 ? true : false;
            share_url = json.share_url;
            share_alias = json.share_alias;
            response_view();
        }
    };
    $.ajax(settings);
}

function response_view() {

    if (res_code >= 200 && res_code < 300) {
        $("#txt_status").attr("class", "text-primary");
    } else if(res_code >= 300 && res_code < 400){
        $("#txt_status").attr("class", "text-warning");
    } else {
        $("#txt_status").attr("class", "text-danger");
    }

    $("#txt_status").text(res_status);
    $("#txt_status").attr("title", status_list[res_code]);

    if (res_header && res_header['Set-Cookie']) {
        $("#btn_response_setcookie").show();
    } else {
        $("#btn_response_setcookie").hide();
    }

    if (res_header && res_header['Location']) {
        $('#txt_url').val(res_header['Location']);
    }

    $("#txt_status").text(res_status);

    $("#txt_response_body").text(jsonStringify(res_body));

    if(res_header){
        var res_header_str = '';
        $.each(res_header, function (key, value) {
            res_header_str += key + ': ' + value + "\r\n";
        });
    }

    $("#txt_response_header").text(res_header_str);

    $("#txt_response_body").removeClass('prettyprinted');
    $("#txt_response_header").removeClass('prettyprinted');
    PR.prettyPrint();

    var domain = (r = url.match(/http[s]?:\/\/(.*?)([:\/]|$)/)) ? r[1] : url;

    // if(res_code == 0 || domain.indexOf('localhost') > -1 || domain.indexOf('127.0.0.1') > -1 || domain.indexOf('10.') > -1 || domain.indexOf('172.') > -1 || domain.indexOf('192.168.') > -1){
    //     if(send_type == 'remote'){
    //         $("#alert").html(make_alert('远程模式无法访问时，可以尝试切换为 <span class="glyphicon glyphicon-link"></span>本地模式'));
    //     }else{
    //         if(!allow_origin){
    //             if (isIE()) {
    //                 $("#alert").html(make_alert('本地访问要求允许跨域 <a target="_blank" href="http://jingyan.baidu.com/article/c33e3f48857933ea15cbb50a.html">IE设置方法</a>'));
    //             } else {
    //                 $("#alert").html(make_alert('本地访问要求允许跨域 Chrome运行参数加入：<strong>--disable-web-security --user-data-dir</strong> (需要重启浏览器)'));
    //             }
    //         }
    //     }
    // }

    window.history.replaceState(null, null, share_alias);


}



if($("#txt_url").val() == ''){
    $("#txt_url").val(hst[0]);
}


$(".method").click(function () {
    method = $(this).text();
    $("#txt_method").text(method);
});

$("#test").click(function () {
    url = 'http://getman.cn/echo.php';
    $("#txt_url").val(url);
    $("#txt_request_body").val('a:1\nb:2');
});

$(".content_type").click(function () {
    header['Content-Type'] = $(this).text();
    $("#txt_request_header").val(array_to_kv(header));
    $("#btn_request_header").addClass("active");
    $("#btn_request_body").removeClass("active");
    $("#txt_request_body").hide();
    $("#txt_request_header").show();
});

$("#txt_url").blur(function () {
    url = $("#txt_url").val().trim();
    if (url && url.length > 0) {
        if (url.indexOf('http') < 0) {
            url = 'http://' + url;
        }
        localStorage.setItem("url", url);
        $("#txt_url").val(url);
    }
});

$("#txt_url").keydown(function (event) {
    switch (event.keyCode) {
        case 13:
            //enter
            $("#txt_url").blur();
            $("#btn_send").click();
            break;
        case 38:
            //up
            if (hst_idx < hst.length - 1) {
                hst_idx++;
                url = hst[hst_idx];
                $("#txt_url").val(url);
            }
            break;
        case 40:
            //down
            if (hst_idx > 0) {
                hst_idx--;
                url = hst[hst_idx];
                $("#txt_url").val(url);
            }
            break;
    }

});

$("#txt_request_header").blur(function () {
    header = kv_to_array($("#txt_request_header").val());
});

$("#btn_send_type").click(function () {
    if (send_type == 'remote') {
        send_type = 'local';
        $("#btn_send_type").attr("title", "Local");
        $("#ico_send_type").attr("class", "glyphicon glyphicon-link");
        if (!allow_origin) {
            $.get("https://captive.apple.com/", function (data, status) {
                if (status == 'success') {
                    allow_origin = true;
                }
            });
        }
    } else {
        send_type = 'remote';
        $("#btn_send_type").attr("title", "Remote");
        $("#ico_send_type").attr("class", "glyphicon glyphicon-cloud");
    }
});

$("#btn_send").click(function () {
    url = $("#txt_url").val();
    if(url.length == 0){
        url = 'https://getman.cn/echo';
    }
    setHistory(url);
    body = $("#txt_request_body").val();
    header = kv_to_array($("#txt_request_header").val());
    content_type = header['Content-Type'] ? header['Content-Type'] : '';
    content_type = content_type.toLowerCase();

    //---
    res_body = '';
    res_header = '';
    res_cookie = '';
    res_code = 0;
    res_status = '';
    //----

    method = $('#txt_method').text();

    if (method == 'GET') {
        if (is_kv(body)) {
            arr = kv_to_array(body);
            param = array_to_raw(arr);
            body = '';
        } else {
            param = '';
        }

        if (param.trim().length > 0) {
            if (url.indexOf('?') > -1) {
                url += '&' + param;
            } else {
                url += '?' + param;
            }
        }

        $("#txt_request_body").val(body);
        $("#txt_url").val(url);

    } else if (content_type.indexOf('application/json') > -1) {
        if (is_kv(body)) {
            arr = kv_to_array(body);
            body = Object.keys(arr).length > 0 ? JSON.stringify(arr) : '';
            $("#txt_request_body").val(body);
        }
    } else if (content_type.indexOf('application/xml') > -1) {
        if (is_kv(body)) {
            arr = kv_to_array(body);
            body = array_to_xml(arr);
            $("#txt_request_body").val(body);
        }
    } else if (content_type.indexOf('multipart/form-data') > -1) {
        if (is_kv(body)) {
            header['Content-Type'] = 'multipart/form-data; boundary=GetmanFormBoundary';
            arr = kv_to_array(body);
            body = array_to_form_data(arr);
            $("#txt_request_body").val(body);
        }
    } else {
        if (is_kv(body)) {
            arr = kv_to_array(body);
            body = array_to_raw(arr);
            $("#txt_request_body").val(body);
        }
    }

    data = {method: method, url: url, body: body, header: header};

    if (url && url.length > 0) {
        //init
        res_body = '';
        res_cookie = '';
        $("#txt_status").attr("class", "text-muted");
        $("#txt_status").attr("title", "");
        $("#txt_status").text("Loading");

        //send
        if (send_type == 'local') {
            send_local(data);
        } else {
            send_remote(data);
        }
    }

});

$("#txt_url").focus(function () {
    $(this).select();
});

$("#txt_request_body").change(function () {
    $(this).val(ToCDB($(this).val()));
    body = $(this).val();
});

$("#txt_request_header").change(function () {
    $(this).val(ToCDB($(this).val()));
    header = $(this).val();
});

$("#btn_request_header").click(function () {
    $(this).addClass("active");
    $("#btn_request_body").removeClass("active");
    $("#txt_request_body").hide();
    $("#txt_request_header").show();
    $("#txt_request_header").val($("#txt_request_header").val());

});

$("#btn_request_body").click(function () {
    $(this).addClass("active");
    $("#btn_request_header").removeClass("active");
    $("#txt_request_body").show();
    $("#txt_request_header").hide();
});

$("#btn_response_header").click(function () {
    $(this).addClass("active");
    $("#btn_response_body").removeClass("active");
    $("#txt_response_body").hide();
    $("#txt_response_header").show();


});

$("#btn_response_body").click(function () {

    if ($(this).hasClass("active")) {
        if ($(this).attr('preview') == "true") {
            $(this).attr('preview', false);
            $("#txt_response_body").text(jsonStringify(res_body));
            $("#txt_response_body").removeClass('prettyprinted');
            PR.prettyPrint();
        } else {
            $(this).attr('preview', true);
            $("#txt_response_body").html(res_body);
        }
    }

    $(this).addClass("active");
    $("#btn_response_header").removeClass("active");
    $("#txt_response_body").show();
    $("#txt_response_header").hide();

});

$("#btn_response_setcookie").click(function () {
    if (res_header && res_header['Set-Cookie']) {
        header['Cookie'] = res_header['Set-Cookie'];
        $("#txt_request_header").val(array_to_kv(header));
    }

    $("#btn_request_header").addClass("active");
    $("#btn_request_body").removeClass("active");
    $("#txt_request_body").hide();
    $("#txt_request_header").show();

});

//---------------------------------------------
console.log('http://getman.cn');
contact = 'enp4MDk0QGdtYWlsLmNvbQ==';
