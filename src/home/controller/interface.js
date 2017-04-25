'use strict';
import Base from '../../common/controller/common';
let project_prefix = '/api/';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let data = this.get(), res, where = {}, projectData = {project_name: this.LN.interface.controller.projectName};
        if (data.keyword) {
            where._complex = {
                api_name: ["like", "%" + data.keyword + "%"],
                api_url: ["like", "%" + data.keyword + "%"],
                _logic: "or"
            };
        }
        if (data.project_id) {
            projectData = await  this.model('project').where({project_id: data.project_id}).find();
            where['mockserver.project_id'] = data.project_id;
            res = await this.model('mockserver').where(where).order('mockid desc')
                .alias('mockserver')
                .field('`mockserver`.*, `project`.`project_name`,`project`.`project_prefix`')
                .join([{
                    table: 'project',
                    as: 'project',
                    on: ['`mockserver`.`project_id`', '`project`.`project_id`']
                }])
                .select();
        } else {
            res = await this.model('mockserver').where(where)
                .alias('mockserver')
                .field('`mockserver`.*, `project`.`project_name`,`project`.`project_prefix`')
                .join([{
                    table: 'project',
                    as: 'project',
                    on: ['`mockserver`.`project_id`', '`project`.`project_id`']
                }])
                .select();
        }
        this.assign({
            title: this.LN.interface.controller.APIList,
            list: res,
            project_id: data.project_id,
            project_name: projectData.project_name,
            api_name: data.api_name,
            keyword: data.keyword,
        })
        //auto render template file index_index.html
        return this.display();
    }

    async addAction() {
        //auto render template file index_index.html
        let project = await this.model('project').select();
        let systemConfig = await this.model('system').find();
        let data = this.get();
        let curr_project;
        if (data.project_id) {
            curr_project = project.filter(item => item.project_id.toString() === data.project_id);
            curr_project.length > 0 ? project_prefix = curr_project[0].project_prefix ? curr_project[0].project_prefix : project_prefix : '';
        }
        if (data.mockid && data.iscopy === '1') {
            let res = await this.model('mockserver').where('mockid=' + data.mockid).find();
            if (!think.isEmpty(res)) {
                res.mockid = '';
                res.project = project;
                this.assign(res)
            } else {
                return this.setSucess(this.LN.interface.controller.cloneError, '/interface/index')
            }
        } else {
            this.assign({
                is_proxy: 0,
                project: project,
                systemConfig: systemConfig,
                project_id: data.project_id,
                project_prefix: project_prefix,
                curr_project: project.filter((item) => {
                    if (item['project_id'] == data.project_id) {
                        return item;
                    }
                })
            })
        }
        return this.display();
    }

    async  editAction() {
        let data = this.get();
        let project = await this.model('project').select();
        let systemConfig = await this.model('system').find();
        let curr_project;
        if (data.mockid) {
            let res = await this.model('mockserver').where('mockid=' + data.mockid).select();
            if (res.length === 1) {
                if (res[0].project_id) {
                    curr_project = project.filter(item => item.project_id === res[0].project_id);
                    curr_project.length > 0 ? project_prefix = curr_project[0].project_prefix ? curr_project[0].project_prefix :
                            project_prefix : '';
                }
                res[0].project = project;
                res[0].systemConfig = systemConfig;
                res[0].project_prefix = project_prefix;
                res[0].curr_project = project.filter((item) => {
                    if (item['project_id'] == res[0].project_id) {
                        return item;
                    }
                });
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
                return this.setSucess(this.LN.interface.controller.deleteSuccess, this.http.header.referer)
            }
        } else {
            return this.setSucess(this.LN.interface.controller.idIsNotExist, this.http.header.referer)
        }
    }

    async updateAction() {
        // console.log(this.post())
        let data = this.post();
        if (think.isEmpty(data)) {
            return this.setSucess(this.LN.interface.controller.dataIsEmpty, '/interface/index')
        }
        let urlData = await this.model('mockserver').where('api_url="' + data.api_url + '"').find();
        project_prefix = data.project_prefix;
        if (data.mockid) {
            if (!think.isEmpty(urlData) && urlData.mockid.toString() !== data.mockid) {
                return this.setSucess(this.LN.interface.controller.cloneError + data.api_url + ']', this.http.header.referer)
            } else {
                let res = await this.model('mockserver').where('mockid=' + data.mockid).select();
                //行为记录
                if (res) {
                    await this.model('mockserver').update(data);
                    return this.setSucess(this.LN.interface.controller.editSuccess, '/interface/index?project_id=' + data.project_id,this.LN.interface.controller.returnList, project_prefix + data.api_url,this.LN.interface.controller.details)
                } else {
                    this.fail(this.LN.interface.controller.actionError);
                }
            }
            return this.display('common/tips/sucess.nunj');
        } else {
            if (!think.isEmpty(urlData)) {
                return this.setSucess(this.LN.interface.controller.addApiIsExist+ data.api_url, this.http.headers.referer)
            }
            let res = await this.model('mockserver').add(data);
            if (res) {
                // this.active = "/";
                this.setSucess(this.LN.interface.controller.addSuccess, '/interface/index?project_id=' + data.project_id, this.LN.interface.controller.returnList, project_prefix + data.api_url,this.LN.interface.controller.details)
            } else {
                this.fail(this.LN.interface.controller.actionError);
            }
            // await this.model("action").log("add_document", "document", res.id, this.user.uid, this.ip(), this.http.url);
        }
        // return this.display();
    }

    async setproxyAction() {
        const mockid = this.get('mockid');
        const is_proxy = this.get('is_proxy');
        if (think.isEmpty(mockid)) {
            this.fail(400,this.LN.interface.controller.mockIdIsEmpty)
        }
        if (think.isEmpty(is_proxy)) {
            this.fail(400, this.LN.interface.controller.proxyIsEmpty)
        }
        let data = await this.model('mockserver').where("mockid=" + mockid + "").find();
        if (!think.isEmpty(data)) {
            var _this = this;
            let data = await this.model('mockserver').where("mockid=" + mockid + "").update({is_proxy: is_proxy});
            if (data) {
                this.success(this.LN.interface.controller.editSuccess)
            } else {
                this.fail(500, this.LN.interface.controller.editFail)
            }
        } else {
            this.fail(400,this.LN.interface.controller.mockIdIsEmpty)
        }
        // return this.display();
    }

    async setproxiesAction() {
        const is_proxy = this.get('is_proxy');
        const mockids = this.get('mockids');
        if (think.isEmpty(is_proxy)) {
            this.fail(400, this.LN.interface.controller.proxyIsEmpty)
        }
        if (think.isEmpty(mockids)) {
            this.fail(400, this.LN.interface.controller.mockIdIsEmpty)
        }
        let data = await this.model('mockserver').where(" mockid in (" + mockids + ")").update({is_proxy: is_proxy});
        if (data) {
            this.success(this.LN.interface.controller.editSuccess)
        } else {
            this.fail(500, this.LN.interface.controller.editFail)
        }
        // return this.display();
    }

    demoAction() {
        //auto render template file index_index.html
        return this.display();
    }
}