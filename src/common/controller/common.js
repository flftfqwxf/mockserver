"use strict";
import cn from '../config/locale/zh-cn';
import en from '../config/locale/en';
import db from '../config/db';
export default class language extends think.controller.base {
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
}