"use strict";
import cn from '../config/language/zh-cn';
import en from '../config/language/en';
export default class language extends think.controller.base {
    /**
     * load language config
     * @returns {Promise.<void>}
     * @private
     */
    async __before() {
        let system = await this.model('system').limit(1).select();
        if (think.isEmpty(system)) {
            this.assign({'LN': cn});
        } else {
            switch (system[0].language_type) {
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
    setSucess(message, url, btnTxt, apiUrl, apiUrlTxt) {
        btnTxt = btnTxt || 'go back';
        this.assign({message: message, url: url, btnTxt: btnTxt, apiUrl: apiUrl, apiUrlTxt: apiUrlTxt, preUrl: this.http.headers.referer})
        return this.display('common/tips/sucess.nunj');
    }
}