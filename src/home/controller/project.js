'use strict';
import Base from '../../common/controller/common';
import excludeConfig from '../../common/config/exclude_config'
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let res = await this.model('project').select();
        this.assign({
            title: this.LN.project.controller.title,
            list: res
        })
        //auto render template file index_index.html
        return this.display();
    }

    addAction() {
        //auto render template file index_index.html
        this.assign({
            is_proxy: 0
        })
        return this.display();
    }

    /**
     * 编辑时显示数据
     * @returns {*}
     */
    async  editAction() {
        let data = this.get();
        if (data.project_id) {
            let res = await this.model('project').where('project_id=' + data.project_id).select();
            if (res.length === 1) {
                this.assign(res[0])
            }
        } else {
            return this.setSucess(this.LN.project.controller.projectIsNotExit, '/')
        }
        return this.display('add.nunj')
    }

    async deleteAction() {
        let get = this.get();
        if (get.project_id) {
            let res = await this.model('project').where('project_id=' + get.project_id).delete();
            if (res) {
                return this.setSucess(this.LN.project.controller.deleteSuccess, '/')
            }
        } else {
            return this.setSucess(this.LN.project.controller.idIsNotExit, '/')
        }
    }

    /**
     * 添加和修改项目
     * @returns {*}
     */
    async updateAction() {
        //不允许使用的前缀
        // console.log(this.post())
        let data = this.post();
        if (think.isEmpty(data)) {
            return this.setSucess(this.LN.project.controller.dataIsEmpty, '/')
        }
        // excludeConfig.some((item) => {
        //     if (data.project_prefix.indexOf(item) === 0) {
        //         return this.setSucess('【' + item + '】'this.LN.project.controller.title, '/');
        //     }
        // });
        // excludeConfig.indexOf(data.project_prefix);
        let projectData = await this.model('project').where('project_name="' + data.project_name + '"').find()
        //修改
        if (data.project_id) {
            if (!think.isEmpty(projectData) && data.project_id !== projectData.project_id.toString()) {
                return this.setSucess(this.LN.project.controller.projectNameIsExit, '/')
            }
            let res = await this.model('project').where('project_id=' + data.project_id).select();
            //行为记录˙
            if (res) {
                await this.model('project').update(data);
                return this.setSucess(this.LN.project.controller.editSuccess, '/')
            } else {
                this.fail(this.LN.project.controller.actionError);
            }
        } else {//添加
            if (!think.isEmpty(projectData)) {
                return this.setSucess(this.LN.project.controller.projectNameIsExit, '/')
            }
            let res = await this.model('project').add(data);
            if (res) {
                // this.active = "/";
                return this.setSucess(this.LN.project.controller.addSuccess, '/')
            } else {
                this.fail(this.LN.project.controller.actionError);
            }
            // await this.model("action").log("add_document", "document", res.id, this.user.uid, this.ip(), this.http.url);
        }
        return this.display();
    }
}