'use strict';
import Base from './base.js';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let res = await this.model('mockserver').select();
        this.assign({
            title: '首页',
            list: res
        })
        //auto render template file index_index.html
        return this.display();
    }

    addAction() {
        //auto render template file index_index.html
        return this.display();
    }

    async  editAction() {
        let data = this.get();
        if (data.mockid) {
            let res = await this.model('mockserver').where('mockid=' + data.mockid).select();
            if (res.length === 1) {
                this.assign(res[0])
            }
        } else {
            return this.display('common/tips/sucess.nunj');
        }
        return this.display('add.nunj')
    }

    async deleteAction() {
        let get = this.get();
        if (get.mockid) {
            let res = await this.model('mockserver').where('mockid=' + get.mockid).delete();
            if (res) {
                this.assign({message: '删除成功', url: '/'})
                return this.display('common/tips/sucess.nunj');
            }
        } else {
            this.assign({message: 'ID不存在', url: '/'})
            return this.display('common/tips/sucess.nunj');
        }
    }

    async updateAction() {
        // console.log(this.post())
        let data = this.post();
        if (data.mockid) {
            let res = await this.model('mockserver').where('mockid=' + data.mockid).select();
            //行为记录
            if (res) {
                await this.model('mockserver').update(data);
                this.assign({
                    message: '修改成功',
                    url: '/'
                })
                return this.display('common/tips/sucess.nunj');
            } else {
                this.fail("操作失败！");
            }
        } else {
            let res = await this.model('mockserver').add(data);
            if (res) {
                // this.active = "/";
                this.assign({
                    message: '添加成功',
                    url: '/'
                })
                return this.display('common/tips/sucess.nunj');
            } else {
                this.fail("操作失败！");
            }
            // await this.model("action").log("add_document", "document", res.id, this.user.uid, this.ip(), this.http.url);
        }
        return this.display();
    }

    demoAction() {
        //auto render template file index_index.html
        return this.display();
    }
}