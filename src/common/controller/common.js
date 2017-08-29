"use strict";
import cn from '../config/locale/zh-cn';
import en from '../config/locale/en';
import db from '../config/db';
import request from "request";
import _ from 'lodash';
import mixin from 'mixin';
import pathToRegexp from 'path-to-regexp'
export default class Base extends mixin(think.logic.base, think.controller.base) {
    /**
     * load language config
     * @returns {Promise.<void>}
     * @private
     */
    async __before() {
        // this.lang('en');
        let lang = this.lang()
        switch (lang) {
            case 'en':
                this.assign({'LN': en});
                break;
            case 'cn':
                this.assign({'LN': cn});
                break;
            default:
                this.assign({'LN': cn});
                break;
        }
        this.LN = this.assign('LN')
        this.getCurrentRoute();
        this.checkMysqlInit();
        //需要在此入返回一个 promise.reject，否则依然会进入action，在数据库未初始化时会报出一个错误
        if (this.stop) {
            return Promise.reject("Database is uninitialized");
        }
    }

    /**
     * 获取当前路由
     */
    getCurrentRoute() {
        console.log(this.lang())
        console.log(this.http.url);
        this.assign(
            {
                curr_path: this.http.url
            })
    }

    /**
     * check mysql init
     */
    checkMysqlInit() {
        // console.log(db.adapter.mysql)
        if (!db.adapter.mysql) {
            if (this.http.url !== '/system/init' && this.http.url !== '/system/lang/en' && this.http.url !== '/system/lang/zh-cn') {
                {
                    // console.log(this.http.url)
                    this.stop = true;
                    this.redirect('/system/init');
                }
            }
        }
    }

    /**
     * set message
     * @param message
     * @param url
     * @param btnTxt
     * @param apiUrl
     * @param apiUrlTxt
     */
    setSuccess(opts) {
        opts = Object.assign({}, {message: '', url: '', btnTxt: '', apiUrl: '', apiUrlTxt: '', goBack: false}, opts || {});
        // btnTxt = btnTxt || 'go back';
        this.assign(opts);
        return this.display('common/tips/sucess.nunj');
    }

    setErrorMessage(msg) {
        let opts = Object.assign({}, {errors: msg});
        // btnTxt = btnTxt || 'go back';
        this.assign(opts);
        return this.display('common/tips/error.nunj');
    }

    async getProxy(url, method) {
        let _this = this
        method = method || this.method().toLowerCase();
        let post = this.post();
        let fn = think.promisify(request[method]);
        // console.log(this.http.headers)
        let send = {
            url: url,
            form: post,
            postDataSource: ''
        };
        let headersBlacklist = [
            'host',
            'accept-encoding',
            'content-type'//
        ]
        let headersObj = {};
        let headers = this.http.headers;
        for (var key in headers) {
            key = _.trim(key.toLowerCase());
            if (headersBlacklist.indexOf(key) === -1) {
                headersObj[key] = headers[key];
            }
        }
        send.headers = headersObj;
        return await fn(send).then(function(content) {
            try {
                content.body = JSON.parse(content.body)
            } catch (e) {
                return Promise.reject(content.body);
            }
            //todo:将返回的HEADER返回给客户端,有BUG
            //有些HEADER信息返回后会无法返回数据
            /**
             * todo:！！！要注意，如果不屏蔽content-type，将会影响当前请求的显示，比如，url参数类型为 json，如果不屏蔽，则页面只会以json格式输出
             * todo:将返回的HEADER返回给客户端.
             * todo:有BUG有些HEADER信息返回后会无法返回数据
             * todo:此处必须try 之后,因为返回content-length header信息,在返回 fail时,会报错:
             * net::ERR_CONTENT_LENGTH_MISMATCH
             */
            // for (var item in content.headers) {
            //     // console.log(item)
            //     _this.header(item, content.headers[item])
            // }
            content.body.proxyDataSource = url
            return Promise.resolve(content.body);
        }).catch(function(err) {
            console.log(err)
            return Promise.reject(err);
        });
    }

    /**
     * 如果输入的api地址是 RESTful格式，则转换为正则，并设置验证状态
     * @param data
     * @returns {Promise.<{data: *, check_reg: boolean, urlData: *}>}
     */
    async checkApiIsExit(data) {
        let keys = [];
        let reg = pathToRegexp(data.api_url, keys).toString().substring(1);
        reg = encodeURI(reg.substring(0, reg.length - 2))
        //当路径中存在类似 /:id/:use 等动态参数时才保存生成的正则表达式
        if (keys.length > 0) {
            data.api_url_regexp = reg
        } else {
            data.api_url_regexp = null
        }
        let where = {api_url: data.api_url, api_type: data.api_type}, check_reg = false;
        let urlData = await this.model('mockserver').where(where).find();
        if (think.isEmpty(urlData) && data.api_url_regexp) {
            where = {api_url_regexp: data.api_url_regexp, api_type: data.api_type};
            urlData = await this.model('mockserver').where(where).find();
            check_reg = true;
        }
        return {data, check_reg, urlData}
    }

    /**
     * 导入api接口
     * @param importData
     * @returns {Promise.<*>}
     */
    async importApi(importData) {
        let {data, check_reg, urlData} = await this.checkApiIsExit(importData)
        if (!think.isEmpty(urlData)) {
            if (check_reg) {
                return this.LN.interface.controller.addRESTfullApiIsExist + data.api_url + '<br>' + urlData.api_url
            } else {
                return this.LN.interface.controller.addApiIsExist + data.api_url
            }
        }
        let res = await this.model('mockserver').add(data);
        if (res) {
            // this.active = "/";
            return data.api_url + this.LN.interface.controller.addSuccess
        } else {
            return data.api_url + this.LN.interface.controller.actionError
        }
    }
}