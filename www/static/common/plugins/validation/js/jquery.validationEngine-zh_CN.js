(function($) {
    // 验证规则
    $.fn.validationEngineLanguage = function() {
    };
    $.validationEngineLanguage = {
        newLang: function() {
            $.validationEngineLanguage.allRules = {
                "required": { // Add your regex rules here, you can take telephone as an example
                    "regex": "none",
                    "alertText": "此处不可空白",
                    "alertTextCheckboxMultiple": "请选择一个项目",
                    "alertTextCheckboxe": "该选项为必选",
                    "alertTextDateRange": "日期范围不可空白"
                },
                "dateRange": {
                    "regex": "none",
                    "alertText": "无效的 ",
                    "alertText2": " 日期范围"
                },
                "dateTimeRange": {
                    "regex": "none",
                    "alertText": "无效的 ",
                    "alertText2": " 时间范围"
                },
                "minSize": {
                    "regex": "none",
                    "alertText": "最少 ",
                    "alertText2": " 个字符"
                },
                "maxSize": {
                    "regex": "none",
                    "alertText": "最多 ",
                    "alertText2": " 个字符"
                },
                "groupRequired": {
                    "regex": "none",
                    "alertText": "至少填写其中一项"
                },
                "min": {
                    "regex": "none",
                    "alertText": "最小值为 "
                },
                "max": {
                    "regex": "none",
                    "alertText": "最大值为 "
                },
                "past": {
                    "regex": "none",
                    "alertText": "日期需在 ",
                    "alertText2": " 之前"
                },
                "future": {
                    "regex": "none",
                    "alertText": "日期需在 ",
                    "alertText2": " 之后"
                },
                "maxCheckbox": {
                    "regex": "none",
                    "alertText": "最多选择 ",
                    "alertText2": " 个项目"
                },
                "minCheckbox": {
                    "regex": "none",
                    "alertText": "最少选择 ",
                    "alertText2": " 个项目"
                },
                "equals": {
                    "regex": "none",
                    "alertText": "两次输入的密码不一致"
                },
                "creditCard": {
                    "regex": "none",
                    "alertText": "无效的信用卡号码"
                },
                "phone": {
                    // credit:jquery.h5validate.js / orefalo
                    "regex": /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
                    "alertText": "无效的电话号码"
                },
                "mobilePhone": {
                    "regex": /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/,
                    "alertText": "* 无效手机号"
                },
                "email": {
                    // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
                    "regex": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
                    "alertText": "无效的邮件地址"
                },
                "integer": {
                    "regex": /^[\-\+]?\d+$/,
                    "alertText": "请输入整数"
                },
                "number": {
                    // Number, including positive, negative, and floating decimal. credit:orefalo
                    "regex": /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
                    "alertText": "无效的数值"
                },
                "date": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
                    "alertText": "无效的日期，格式必需为 YYYY-MM-DD"
                },
                "ipv4": {
                    "regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                    "alertText": "无效的 IP 地址"
                },
                "url": {
                    "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                    "alertText": "无效的网址"
                },
                "onlyNumberSp": {
                    "regex": /^[0-9\ ]+$/,
                    "alertText": "只能填写数字"
                },
                "onlyLetterSp": {
                    "regex": /^[a-zA-Z\ \']+$/,
                    "alertText": "只能填写英文字母"
                },
                "onlyLetterNumber": {
                    "regex": /^[0-9a-zA-Z]+$/,
                    "alertText": "只能填写数字与英文字母"
                },
                //tls warning:homegrown not fielded
                "dateFormat": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
                    "alertText": "无效的日期格式"
                },
                //tls warning:homegrown not fielded
                "dateTimeFormat": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
                    "alertText": "无效的日期或时间格式",
                    "alertText2": "可接受的格式： ",
                    "alertText3": "mm/dd/yyyy hh:mm:ss AM|PM 或 ",
                    "alertText4": "yyyy-mm-dd hh:mm:ss AM|PM"
                },
                /**
                 * 正则验证规则补充
                 * Author: ciaoca@gmail.com
                 * Date: 2013-10-12
                 */
                "chinese": {
                    "regex": /^[\u4E00-\u9FA5]+$/,
                    "alertText": "只能填写中文汉字"
                },
                "chinaId": {
                    /**
                     * 2013年1月1日起第一代身份证已停用，此处仅验证 18 位的身份证号码
                     * 如需兼容 15 位的身份证号码，请使用宽松的 chinaIdLoose 规则
                     * /^[1-9]\d{5}[1-9]\d{3}(
                     *    (
                     *        (0[13578]|1[02])
                     *        (0[1-9]|[12]\d|3[01])
                     *    )|(
                     *        (0[469]|11)
                     *        (0[1-9]|[12]\d|30)
                     *    )|(
                     *        02
                     *        (0[1-9]|[12]\d)
                     *    )
                     * )(\d{4}|\d{3}[xX])$/i
                     */
                    "regex": /^[1-9]\d{5}[1-9]\d{3}(((0[13578]|1[02])(0[1-9]|[12]\d|3[0-1]))|((0[469]|11)(0[1-9]|[12]\d|30))|(02(0[1-9]|[12]\d)))(\d{4}|\d{3}[xX])$/,
                    "alertText": "无效的身份证号码"
                },
                "chinaIdLoose": {
                    "regex": /^(\d{18}|\d{15}|\d{17}[xX])$/,
                    "alertText": "无效的身份证号码"
                },
                "chinaZip": {
                    "regex": /^\d{6}$/,
                    "alertText": "无效的邮政编码"
                },
                "qq": {
                    "regex": /^[1-9]\d{4,10}$/,
                    "alertText": "无效的 QQ 号码"
                },
                "noSensitiveChar": {
                    "regex": /^(([^<>'?"])*)$/,
                    "alertText": "不能含有敏感字符"
                },
                "mobilephone": {
                    // credit: jquery.h5validate.js / orefalo
                    //"regex": /^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}?$|15[89]\d{8}?$/,
                    "regex": /^(1(([35][0-9])|(47)|[78][0-9]))\d{8}$/,
                    "alertText": "* 无效的手机号码"
                },
                "notOnlyNumber": {
                    "regex": /^(?!\d+$)[\dA-Za-z]{5,15}$/,
                    "alertText": "* 5-15位字母、数字组合,必须包含字母"
                },
                "d6": {
                    "regex": /^\d{0,6}$/,
                    "alertText": "* 只能是6位以内的数字"
                },
                "d5": {
                    "regex": /^\d{0,5}$/,
                    "alertText": "* 只能是5位以内的数字"
                },
                "d3-4": {
                    "regex": /^\d{3,4}$/,
                    "alertText": "* 只能是3-4位数字"
                },
                "d6-8": {
                    "regex": /^\d{6,8}$/,
                    "alertText": "* 只能是6-8位数字"
                },
                "d10": {
                    "regex": /^\d{10}$/,
                    "alertText": "* 只能是10位数字"
                },
                "md8": {
                    "regex": /^\d{1,8}$/,
                    "alertText": "* 1-8位数字"
                },
                "d15": {
                    "regex": /^\d{0,15}$/,
                    "alertText": "* 只能是15位以内的数字"
                },
                "project_prefix":{
                    "regex":/^\/[\w_\d]+\/$/,
                    "alertText": "格式错误，正确格式为/xxx/"

                }

                /**
                 * 自定义公用提示信息：
                 * 外部通过 $.validationEngineLanguage.allRules.validate2fields.alertText 可获取
                 *
                 *    "validate2fields": {
				 * 		"alertText": "* 请输入 HELLO"
				 *	 },
                 *
                 *
                 * 自定义规则示例：
                 *    "requiredInFunction": {
				 * 		"func": function(field,rules,i,options){
				 * 			return (field.val()=="test") ? true : false;
				 * 		},
				 * 		"alertText": "* Field must equal test"
				 * 	},
                 *
                 *
                 * Ajax PHP 验证示例
                 *    "ajaxUserCallPhp": {
				 * 		"url": "phpajax/ajaxValidateFieldUser.php",
				 * 		// you may want to pass extra data on the ajax call
				 * 		"extraData": "name=eric",
				 * 		// if you provide an "alertTextOk", it will show as a green prompt when the field validates
				 * 		"alertTextOk": "* 此帐号名称可以使用",
				 * 		"alertText": "* 此名称已被其他人使用",
				 * 		"alertTextLoad": "* 正在确认帐号名称是否有其他人使用，请稍等。"
				 * 	},
                 *    "ajaxNameCallPhp": {
				 * 		// remote json service location
				 * 		"url": "phpajax/ajaxValidateFieldName.php",
				 * 		// error
				 * 		"alertText": "* 此名称已被其他人使用",
				 * 		// speaks by itself
				 * 		"alertTextLoad": "* 正在确认名称是否有其他人使用，请稍等。"
				 * 	}
                 */
            };
        }
    };
    $.validationEngineLanguage.newLang();
})(jQuery);