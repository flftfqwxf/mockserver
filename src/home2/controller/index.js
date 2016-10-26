'use strict';
import Base from './base.js';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let data = this.get(), res, where = {};
        if (data.api_name) {
            where.api_name = ["like", "%" + data.api_name + "%"];
        }
        if (data.project_id) {
            where['mockserver.project_id'] = data.project_id;
            res = await this.model('mockserver').where(where).order('mockid desc')
                .alias('mockserver')
                .field('`mockserver`.*, `project`.`project_name`')
                .join([{
                    table: 'project',
                    as: 'project',
                    on: ['`mockserver`.`project_id`', '`project`.`project_id`']
                }])
                .select();
        } else {
            res = await this.model('mockserver').where(where)
                .alias('mockserver')
                .field('`mockserver`.*, `project`.`project_name`')
                .join([{
                    table: 'project',
                    as: 'project',
                    on: ['`mockserver`.`project_id`', '`project`.`project_id`']
                }])
                .select();
        }
        // let res = await this.model.join('project on mockserver.project_id=project.project_id').select();
        this.assign({
            title: '接口列表',
            list: res,
            project_id: data.project_id,
            api_name: data.api_name
        })
        //auto render template file index_index.html
        return this.display();
    }

    async addAction() {
        //auto render template file index_index.html
        let project = await this.model('project').select();
        let data = this.get();
        if (data.mockid && data.iscopy === '1') {
            let res = await this.model('mockserver').where('mockid=' + data.mockid).find();
            if (!think.isEmpty(res)) {
                res.mockid = '';
                res.project = project;
                this.assign(res)
            } else {
                return this.setSucess('复制的数据不存在', '/home2/index')
            }
        } else {
            this.assign({
                is_proxy: 0,
                project: project
            })
        }
        return this.display();
    }

    async  editAction() {
        let data = this.get();
        let project = await this.model('project').select();
        if (data.mockid) {
            let res = await this.model('mockserver').where('mockid=' + data.mockid).select();
            if (res.length === 1) {
                res[0].project = project;
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
                return this.setSucess('删除成功', this.http.header.referer)
            }
        } else {
            return this.setSucess('ID不存在', this.http.header.referer)
        }
    }

    async updateAction() {
        // console.log(this.post())
        let data = this.post();
        if (think.isEmpty(data)) {
            return this.setSucess('数据为空:点击返回列表', '/home2/index')
        }
        let urlData = await this.model('mockserver').where('api_url="' + data.api_url + '"').find();
        if (data.mockid) {
            if (!think.isEmpty(urlData) && urlData.mockid.toString() !== data.mockid) {
                return this.setSucess('修改失败:接口地址[' + data.api_url + ']已存在,返回修改', this.http.header.referer)
            } else {
                let res = await this.model('mockserver').where('mockid=' + data.mockid).select();
                //行为记录
                if (res) {
                    await this.model('mockserver').update(data);
                    return this.setSucess('修改成功', '/home2/index/index?project_id=' + data.project_id, '返回列表')
                } else {
                    this.fail("操作失败！");
                }
            }
            return this.display('common/tips/sucess.nunj');
        } else {
            if (!think.isEmpty(urlData)) {
                return this.setSucess('添加失败:接口地址[' + data.api_url + ']已存在,返回修改', this.http.headers.referer)
            }
            let res = await this.model('mockserver').add(data);
            if (res) {
                // this.active = "/";
                this.setSucess('添加成功', '/home2/index/index?project_id=' + data.project_id, '返回列表')
            } else {
                this.fail("操作失败！");
            }
            // await this.model("action").log("add_document", "document", res.id, this.user.uid, this.ip(), this.http.url);
        }
        // return this.display();
    }

    async setproxyAction() {
        const mockid = this.get('mockid');
        const is_proxy = this.get('is_proxy');
        if (think.isEmpty(mockid)) {
            this.fail({message: 'mockid为空 '})
        }
        if (think.isEmpty(is_proxy)) {
            this.fail({message: 'is_proxy为空 '})
        }
        let data = await this.model('mockserver').where("mockid=" + mockid + "").find();
        if (!think.isEmpty(data)) {
            var _this = this;
            let data = await this.model('mockserver').where("mockid=" + mockid + "").update({is_proxy: is_proxy});
            if (data) {
                this.success({message: '修改成功'})
            } else {
                this.fail({message: '修改失败'})
            }
        } else {
            this.fail({message: 'mockid不存在'})
        }
        // return this.display();
    }

    async setproxysAction() {
        const is_proxy = this.get('is_proxy');
        const mockids = this.get('mockids');
        if (think.isEmpty(is_proxy)) {
            this.fail({message: 'is_proxy为空 '})
        }
        if (think.isEmpty(mockids)) {
            this.fail({message: 'mockids为空 '})
        }
        let data = await this.model('mockserver').where(" mockid in (" + mockids + ")").update({is_proxy: is_proxy});
        if (data) {
            this.success({message: '修改成功'})
        } else {
            this.fail({message: '修改失败'})
        }
        // return this.display();
    }

    demoAction() {
        //auto render template file index_index.html
        return this.display();
    }
}