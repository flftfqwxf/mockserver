'use strict';
export default class extends think.controller.base {
    /**
     * some base method in here
     */

    setSucess(message, url, btnTxt) {
        btnTxt = btnTxt || '返回'
        this.assign({message: message, url: url, btnTxt: btnTxt})
        return this.display('common/tips/sucess.nunj');
    }
}