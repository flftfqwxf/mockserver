'use strict';
import Base from './base.js';
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
            return this.setSucess('请设置全局参数', '/')
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
            return this.setSucess('设置成功', '/')
        } else {
            this.fail("操作失败！");
        }
        // await this.model("action").log("add_document", "document", res.id, this.user.uid, this.ip(), this.http.url);
        return this.display();
    }
}