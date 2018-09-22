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
		let mockid = this.get('mockid');
		if (mockid) {
			let interfaceData = await this.model('interface').getInterfaceById(mockid)
			if (!think.isEmpty(interfaceData)) {
				let url = {url: 'http://' + this.http.headers.host + '/' + interfaceData.project_id + '/' + interfaceData.api_url}
				let data = Object.assign({}, interfaceData, url)
				data.api_type = data.api_type && data.api_type.toUpperCase()
				this.assign(data)
			}


		} else {
			this.assign({})
		}

		let data = this.get();
		let project = await this.model('project').select();
		let systemConfig = await this.model('system').find();
		let curr_project;
		if (data.mockid) {
			let interfaceData = await this.model('interface').getInterfaceById(mockid)
			if (!think.isEmpty(interfaceData)) {
				if (interfaceData.project_id) {
					curr_project = project.filter(item => item.project_id === interfaceData.project_id);
					if (curr_project.length > 0) {
						project_prefix = curr_project[0].project_prefix
						interfaceData.curr_project = curr_project[0]
					} else {
						project_prefix = '/'

					}
				}
				interfaceData.project = project;
				interfaceData.systemConfig = systemConfig;
				interfaceData.project_prefix = project_prefix;
				let tem_url = interfaceData.api_url.split(':');
				if (!interfaceData.proxy_prefix && curr_project[0].proxy_url) {
					interfaceData.proxy_prefix = curr_project[0].proxy_url;

				} else if (!interfaceData.proxy_prefix && systemConfig.proxy_url) {

					interfaceData.proxy_prefix = systemConfig.proxy_url;

				}
				// interfaceData.swagger_url =
				let url = {
					url: tem_url.length > 1 ? ':' + tem_url.slice(1).join(':') : interfaceData.api_url,
					project_url: 'http://' + this.http.headers.host + '/' + interfaceData.project_id + '/' ,
					open_proxy_project_url: interfaceData.proxy_prefix

				};
				if (interfaceData.api_url.split(':').length>1) {
					url.project_url+=interfaceData.api_url.split(':')[0]
					url.open_proxy_project_url+=interfaceData.api_url.split(':')[0]

				}




				interfaceData = Object.assign({}, interfaceData, url)
				interfaceData.api_type = interfaceData.api_type && interfaceData.api_type.toUpperCase()
				this.assign(interfaceData)
			} else {
				this.assign({})

			}
		}


		return this.display();
	}






	/**
	 * 获取接口数据
	 * @returns {Promise}
	 */
	async getapiAction() {
		let posts = this.post();
		if (posts.url.indexOf('https') === 0) {
			posts.url = posts.url.replace('https', 'http');

		}
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
			timeout: 1000 * 500
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