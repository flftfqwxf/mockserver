'use strict';
import Base from './base.js';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let res = await this.model('project').select();
        this.assign({
            title: '项目列表',
            list: res
        })
        //auto render template file index_index.html
        return this.display();
    }

    addAction() {
        //auto render template file index_index.html
        this.assign({
            is_proxy:0
        })
        return this.display();
    }

    async  editAction() {
        let data = this.get();
        if (data.project_id) {
            let res = await this.model('project').where('project_id=' + data.project_id).select();
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
        if (get.project_id) {
            let res = await this.model('project').where('project_id=' + get.project_id).delete();
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
        if (data.project_id) {
            let res = await this.model('project').where('project_id=' + data.project_id).select();
            //行为记录˙
            if (res) {
                await this.model('project').update(data);
                this.assign({
                    message: '修改成功',
                    url: '/'
                })
                return this.display('common/tips/sucess.nunj');
            } else {
                this.fail("操作失败！");
            }
        } else {

            let res = await this.model('project').add(data);
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


}