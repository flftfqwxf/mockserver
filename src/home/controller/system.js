'use strict';
import Base from '../../common/controller/common';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */


    async addAction() {
        let res = await this.model('system').limit(1).find();
        if (!think.isEmpty(res)) {
            this.assign(res)
        }
        return this.display('add.nunj')
    }

    async updateAction() {
        // console.log(this.post())
        let data = this.post();
        if (think.isEmpty(data)) {
            return this.setSucess(this.LN.system.controller.dataIsEmpty, '/')
        }
        let systemData = await this.model('system').limit(1).find();
        let res;
        if (!think.isEmpty(systemData)) {
            res = await this.model('system').where({id: systemData.id}).update(data);
        } else {
            res = await this.model('system').add(data);
        }
        if (res) {
            // this.active = "/";
            return this.setSucess(this.LN.system.controller.dataIsEmpty, '/')
        } else {
            this.fail(this.LN.system.controller.dataIsEmpty);
        }
        // await this.model("action").log("add_document", "document", res.id, this.user.uid, this.ip(), this.http.url);
        return this.display();
    }

    async langAction() {
        let lang = this.get('lang');
        if (think.isEmpty(lang)) {
            return this.fail(this.LN.system.controller.langIsEmpty, 500)
        }
        await this.cookie('think_locale', lang);
        this.lang(lang);
        return this.success(this.LN.system.controller.updateSuccess);
    }
}