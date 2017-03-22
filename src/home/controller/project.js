'use strict';
import Base from './base.js';
import excludeConfig from '../../common/config/exclude_config'
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
            return this.setSucess('项目不存在', '/')
        }
        return this.display('add.nunj')
    }

    async deleteAction() {
        let get = this.get();
        if (get.project_id) {
            let res = await this.model('project').where('project_id=' + get.project_id).delete();
            if (res) {
                return this.setSucess('删除成功', '/')
            }
        } else {
            return this.setSucess('ID不存在', '/')
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
            return this.setSucess('数据为空:点击返回列表', '/')
        }
        excludeConfig.some((item)=> {
            if (data.project_prefix.indexOf(item) === 0) {
                return this.setSucess('不能使用：【' + item + '】作为前缀开头,该前缀已经被系统占有用', '/');
            }
        });
        excludeConfig.indexOf(data.project_prefix);
        let projectData = await this.model('project').where('project_name="' + data.project_name + '"').find()
        //修改
        if (data.project_id) {
            if (!think.isEmpty(projectData) && data.project_id !== projectData.project_id.toString()) {
                return this.setSucess('项目名称已存在', '/')
            }
            let res = await this.model('project').where('project_id=' + data.project_id).select();
            //行为记录˙
            if (res) {
                await this.model('project').update(data);
                return this.setSucess('修改成功', '/')
            } else {
                this.fail("操作失败！");
            }
        } else {//添加
            if (!think.isEmpty(projectData)) {
                return this.setSucess('项目名称已存在', '/')
            }
            let res = await this.model('project').add(data);
            if (res) {
                // this.active = "/";
                return this.setSucess('添加成功', '/')
            } else {
                this.fail("操作失败！");
            }
            // await this.model("action").log("add_document", "document", res.id, this.user.uid, this.ip(), this.http.url);
        }
        return this.display();
    }
}