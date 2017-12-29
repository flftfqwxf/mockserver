'use strict';
import Base from '../../common/controller/common';
let project_prefix = '/';
import request from "request";

export default class extends Base {
	/**
	 * index action
	 * @return {Promise} []
	 */
	async indexAction() {

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
			let res = await this.model('mockserver').where('mockid=' + data.mockid).select();
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


	/**
	 * 获取接口数据
	 * @returns {Promise}
	 */
	async getapiAction() {
		let posts = this.post();

		const res = await  this.getProxy(posts.url, posts.method, posts.body, posts.header)
		//auto render template file index_index.html

		return this.json(res);
	}

	async getProxy(url, method, body, header) {
		let _this = this

		let post = body;
		let fn = think.promisify(request[method.toLowerCase()]);
		let send = {
			url: url,
			form: post,
			headers: this.http.headers,
			timeout: 1000 * 5
		};

		return await fn(send).then(function(content) {
			// try {
			// 	content.body = JSON.parse(content.body)
			// } catch (e) {
			// 	return Promise.reject(content.body);
			// }

			return Promise.resolve(content);
		}).catch(function(err) {
			// let conent={
			// 	statusCode:500,
			// 	status:err
			//
			//
			// }
			console.log(err)
			return Promise.reject(err);
		});
	}

}