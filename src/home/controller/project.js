'use strict';
import Base from '../../common/controller/common';
import excludeConfig from '../../common/config/exclude_config'
import crypto from 'crypto'
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
            let res = await this.model('project').where({project_id: data.project_id}).select();
            if (res.length === 1) {
                this.assign(res[0])
            } else {
                return this.setSuccess({message: this.LN.project.controller.projectIsNotExist, url: '/', btnTxt: this.LN.project.controller.returnProjectList})
            }
        } else {
            return this.setSuccess({message: this.LN.project.controller.projectIsNotExist, url: '/', btnTxt: this.LN.project.controller.returnProjectList})
        }
        return this.display('add.nunj')
    }

    async deleteAction() {
        let get = this.get();
        if (get.project_id) {
            let res = await this.model('project').where({project_id: get.project_id}).delete();
            if (res) {
                return this.setSuccess({message: this.LN.project.controller.deleteSuccess, url: '/', btnTxt: this.LN.project.controller.returnProjectList})
            }
        } else {
            return this.setSuccess({message: this.LN.project.controller.idIsNotExist, url: '/', btnTxt: this.LN.project.controller.returnProjectList})
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
            return this.setSuccess({message: this.LN.project.controller.dataIsEmpty, url: '/', btnTxt: this.LN.project.controller.returnProjectList})
        }
        // excludeConfig.some((item) => {
        //     if (data.project_prefix.indexOf(item) === 0) {
        //         return this.setSuccess({message:'【' + item +url: '】'this.LN.project.controller.title,btnTxt: '/'});
        //     }
        // });
        // excludeConfig.indexOf(data.project_prefix);
        let projectData = await this.model('project').where('project_name="' + data.project_name + '"').find()
        //修改
        if (data.project_id) {
            if (!think.isEmpty(projectData) && data.project_id !== projectData.project_id.toString()) {
                return this.setSuccess({
                    message: this.LN.project.controller.projectNameIsExist,
                    url: this.http.headers.referer,
                    btnTxt: this.LN.project.controller.editAgain,
                    apiUrl: '/',
                    apiUrlTxt: this.LN.project.controller.returnProjectList
                })
            }
            let res = await this.model('project').where({project_id: data.project_id}).select();
            //行为记录˙
            if (res) {
                await this.model('project').update(data);
                return this.setSuccess({
                    message: this.LN.project.controller.editSuccess,
                    url: this.http.headers.referer,
                    btnTxt: this.LN.project.controller.editAgain,
                    apiUrl: '/',
                    apiUrlTxt: this.LN.project.controller.returnProjectList
                })
            } else {
                return this.setSuccess({
                    message: this.LN.project.controller.actionError,
                    url: this.http.headers.referer,
                    btnTxt: this.LN.project.controller.editAgain,
                    apiUrl: '/',
                    apiUrlTxt: this.LN.project.controller.returnProjectList
                })
            }
        } else {//添加
            if (!think.isEmpty(projectData)) {
                return this.setSuccess({
                    message: this.LN.project.controller.projectNameIsExist,
                    url: this.http.headers.referer,
                    btnTxt: this.LN.project.controller.editAgain,
                    apiUrl: '/',
                    apiUrlTxt: this.LN.project.controller.returnProjectList
                })
            }
            data.project_id = crypto.randomBytes(10).toString('hex')
            let res = await this.model('project').add(data);
            console.log(res)
            if (res) {
                // this.active = "/";
                return this.setSuccess({
                    message: this.LN.project.controller.addSuccess,
                    url: this.http.headers.referer,
                    btnTxt: this.LN.project.controller.add,
                    apiUrl: '/',
                    apiUrlTxt: this.LN.project.controller.returnProjectList
                })
            } else {
                return this.setSuccess({
                    message: this.LN.project.controller.actionError,
                    url: this.http.headers.referer,
                    btnTxt: this.LN.project.controller.editAgain,
                    apiUrl: '/',
                    apiUrlTxt: this.LN.project.controller.returnProjectList
                })
            }
            // await this.model("action").log("add_document", "document", res.id, this.user.uid, this.ip(), this.http.url);
        }
        return this.display();
    }
}