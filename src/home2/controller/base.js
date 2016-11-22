'use strict';
export default class extends think.controller.base {
    /**
     * some base method in here
     */

    setSucess(message, url, btnTxt,apiUrl,apiUrlTxt) {
        btnTxt = btnTxt || '返回'
        this.assign({message: message, url: url, btnTxt: btnTxt,apiUrl:apiUrl,apiUrlTxt:apiUrlTxt})
        return this.display('common/tips/sucess.nunj');
    }
}