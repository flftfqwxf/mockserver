'use strict';
import Base from '../../common/controller/common';
let project_prefix = '/';
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
                .field('`mockserver`.*, `project`.*')
                .join([{
                    table: 'project',
                    as: 'project',
                    on: ['`mockserver`.`project_id`', '`project`.`project_id`']
                }])
                .select();
        } else {
            res = await this.model('mockserver').where(where)
                .alias('mockserver')
                .field('`mockserver`.*, `project`.*')
                .join([{
                    table: 'project',
                    as: 'project',
                    on: ['`mockserver`.`project_id`', '`project`.`project_id`']
                }])
                .select();
        }
        let systemData = await this.model('system').limit(1).find();
        this.assign({
            title: this.LN.interface.controller.APIList,
            list: res,
            project_id: data.project_id,
            project: projectData,
            api_name: data.api_name,
            keyword: data.keyword,
            systemData: systemData
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
            if (curr_project.length > 0 && curr_project[0].project_prefix) {
                project_prefix = curr_project[0].project_prefix
            }
        }
        if (data.mockid && data.iscopy === '1') {
            let res = await this.model('mockserver').where('mockid=' + data.mockid).find();
            if (!think.isEmpty(res)) {
                if (res.project_id) {
                    curr_project = project.filter(item => item.project_id.toString() === res.project_id);
                    if (curr_project.length > 0 && curr_project[0].project_prefix) {
                        project_prefix = curr_project[0].project_prefix
                    }
                }
                res.mockid = '';
                res.project = project;
                res.systemConfig = systemConfig;
                res.project_prefix = project_prefix;
                res.curr_project = project.filter((item) => {
                    if (item['project_id'] == data.project_id) {
                        return item;
                    }
                });
                // res.project_id=data.project_id
                this.assign(res)
            } else {
                return this.setSuccess({message: this.LN.interface.controller.cloneError, url: '/interface/index', btnTxt: this.LN.interface.controller.returnList})
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
            let res = await this.model('interface').getInterfaceById(data.mockid).select();
            if (res.length === 1) {
                if (res[0].project_id) {
                    curr_project = project.filter(item => item.project_id === res[0].project_id);
                    if (curr_project.length > 0) {
                        project_prefix = curr_project[0].project_prefix
                        res[0].curr_project = curr_project[0]
                    } else {
                        project_prefix = '/'
                    }
                }
                res[0].project = project;
                res[0].systemConfig = systemConfig;
                res[0].project_prefix = project_prefix;
                // res[0].swagger_url =
                this.assign(res[0])
            } else {
                return this.setSuccess({message: this.LN.interface.controller.idIsNotExist, url: '/interface/index', btnTxt: this.LN.interface.controller.returnList})
            }
        }
        return this.display('add.nunj')
    }

    async deleteAction() {
        let get = this.get();
        if (get.mockid) {
            let res = await this.model('mockserver').where('mockid=' + get.mockid).delete();
            if (res) {
                return this.setSuccess({message: this.LN.interface.controller.deleteSuccess, url: this.http.headers.referer, btnTxt: this.LN.interface.controller.returnList})
            }
        } else {
            return this.setSuccess({message: this.LN.interface.controller.idIsNotExist, url: this.http.headers.referer, btnTxt: this.LN.interface.controller.returnList})
        }
    }

    async updateAction() {
        // console.log(this.post())
        let {data, check_reg, urlData} = await this.checkApiIsExit(this.post())
        project_prefix = data.project_prefix;
        if (!data.mockid) {
            await  this.addApi(data, urlData, check_reg)
        } else {
            await  this.updateApi(data, urlData, check_reg)
        }
    }

    /**
     * 修改API
     * @param data
     * @param urlData
     * @param isRESTFulPath
     * @returns {Promise.<*>}
     */
    async updateApi(data, urlData, isRESTFulPath) {
        //如果
        if (!think.isEmpty(urlData) && urlData.mockid.toString() !== data.mockid) {
            if (isRESTFulPath) {
                return this.setSuccess({
                    message: this.LN.interface.controller.RESTfulApiIsExist + data.api_url + '\r\n' + urlData.api_url,
                    url: this.http.headers.referer,
                    btnTxt: this.LN.interface.controller.editAgain
                })
            } else {
                return this.setSuccess({
                    message: this.LN.interface.controller.apiIsExist + data.api_url,
                    url: this.http.headers.referer,
                    btnTxt: this.LN.interface.controller.editAgain
                })
            }
        } else {
            let res = await this.model('mockserver').where('mockid=' + data.mockid).select();
            if (res) {
                await this.model('mockserver').update(data);
                return this.setSuccess({
                    message: this.LN.interface.controller.editSuccess,
                    url: '/interface/index?project_id=' + data.project_id,
                    btnTxt: this.LN.interface.controller.returnList,
                    apiUrl: '/' + data.project_id + '/' + data.api_url,
                    apiUrlTxt: this.LN.interface.controller.details,
                    api_type: data.api_type
                })
            } else {
                return this.setSuccess({message: this.LN.interface.controller.actionError, goBack: true})
            }
        }
        return this.display('common/tips/sucess.nunj');
    }

    /**
     * 添加api
     * @param data
     * @param urlData
     * @param isRESTFulPath
     * @returns {Promise.<*>}
     */
    async addApi(data, urlData, isRESTFulPath) {
        if (!think.isEmpty(urlData)) {
            if (isRESTFulPath) {
                return this.setSuccess({
                    message: this.LN.interface.controller.addRESTfullApiIsExist + data.api_url + '<br>' + urlData.api_url,
                    goBack: true
                })
            } else {
                return this.setSuccess({
                    message: this.LN.interface.controller.addApiIsExist + data.api_url,
                    goBack: true
                })
            }
        }
        let res = await this.model('mockserver').add(data);
        if (res) {
            // this.active = "/";
            this.setSuccess({
                message: this.LN.interface.controller.addSuccess,
                url: '/interface/index?project_id=' + data.project_id,
                btnTxt: this.LN.interface.controller.returnList,
                apiUrl: '/' + data.project_id + '/' + data.api_url,
                apiUrlTxt: this.LN.interface.controller.details,
                api_type: data.api_type
            })
        } else {
            return this.setSuccess({message: this.LN.interface.controller.actionError, goBack: true})
        }
    }

    async setproxyAction() {
        const mockid = this.get('mockid');
        const is_proxy = this.get('is_proxy');
        if (think.isEmpty(mockid)) {
            this.fail(400, this.LN.interface.controller.mockIdIsEmpty)
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
            this.fail(400, this.LN.interface.controller.mockIdIsEmpty)
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