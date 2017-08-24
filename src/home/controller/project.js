'use strict';
import Base from '../../common/controller/common';
import crypto from 'crypto'
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let res = await this.model('project').getAllProjects();
        this.assign({
            title: this.LN.project.controller.title,
            list: res
        })
        return this.display();
    }

    /**
     * 添加项目
     */
    addAction() {
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
            let res = await this.model('project').getProjectById(data.project_id);
            if (!think.isEmpty(res)) {
                this.assign(res)
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
            let res = await this.model('project').deleteProjectById(get.project_id);
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
        var projectData = await this.model('project').getProjectByName(data.project_name)
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
                // if (data.swagger_url) {
                //     const swagger_json = await this.getProxy(data.swagger_url, 'get')
                //     if (typeof swagger_json === 'object') {
                //         for (var path in swagger_json.paths) {
                //             let apiArray = swagger_json.paths[path]
                //             for (var method in apiArray) {
                //                 let api = apiArray[method];
                //                 let postData = {
                //                     "project_id": data.project_id,
                //                     "api_name": api.tags + '-' + api.summary,
                //                     "api_type": method,
                //                     "api_url": path,
                //                     "project_prefix": "/",
                //                     "api_querys_desc": "{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}",
                //                     "api_req_header_desc": "{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}",
                //                     "api_req_header": "{\r\n  \"header1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}",
                //                     "exact_match": "0",
                //                     "api_parms_desc": "{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}",
                //                     "api_parms": "{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}",
                //                     "api_content_desc": "{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}",
                //                     "api_content": "{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"stringsss\": \"@string(5)\",\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  }\r\n}",
                //                     "is_mockjs": "0",
                //                     "api_state_code": "200",
                //                     "api_lazy_time": "0",
                //                     "api_header_desc": "{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}",
                //                     "api_header": "{\r\n  \"headere1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}",
                //                     "proxy_prefix": "",
                //                     "is_proxy": "0"
                //                 }
                //                 for (var item in postData) {
                //                     this.http.post(item, postData[item])
                //                 }
                //                 await this.action('home/interface','update')
                //             }
                //         }
                //     }
                // }
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
            //此处必须在添加后重新查找一次，以判断是否添加成功，原因为project表没有主键id，在添加成功后，无法判断是否添加成功
            projectData = await this.model('project').getProjectByName(data.project_name)
            console.log('res:' + projectData.project_id)
            if (projectData.project_id) {
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