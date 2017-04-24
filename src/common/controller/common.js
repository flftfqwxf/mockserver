"use strict";
import cn from '../config/locale/zh-cn';
import en from '../config/locale/en';
export default class language extends think.controller.base {
    /**
     * load language config
     * @returns {Promise.<void>}
     * @private
     */
    async __before() {
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
        this.LN=this.assign('LN')
        this.getCurrentRoute();
    }

    /**
     * 获取当前路由
     */
    getCurrentRoute() {
        console.log(this.lang())
        console.log(this.http.pathname)
    }

    /**
     * set message
     * @param message
     * @param url
     * @param btnTxt
     * @param apiUrl
     * @param apiUrlTxt
     */
    setSucess(message, url, btnTxt, apiUrl, apiUrlTxt) {
        btnTxt = btnTxt || 'go back';
        this.assign({message: message, url: url, btnTxt: btnTxt, apiUrl: apiUrl, apiUrlTxt: apiUrlTxt, preUrl: this.http.headers.referer})
        return this.display('common/tips/sucess.nunj');
    }
}