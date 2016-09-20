'use strict';
import Base from './base.js';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let res = await this.model('mockserver').select();
        //auto render template file index_index.html
        return this.display();
    }

    addAction() {
        //auto render template file index_index.html
        return this.display();
    }

    async updateAction() {
        // console.log(this.post())
        let data = this.post();
        let res = await this.model('mockserver').addmockserver(data);
        if (res) {
            //行为记录
            if (!res.data.id) {
                // await this.model("action").log("add_document", "document", res.id, this.user.uid, this.ip(), this.http.url);
                this.success({name: "添加成功"});
            } else {
                this.success({name: "更新成功"});
            }
        } else {
            this.fail("操作失败！");
        }
    }

    demoAction() {
        //auto render template file index_index.html
        return this.display();
    }
}