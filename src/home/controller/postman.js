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
			let interfaceData = await this.model('interfaceData').getInterfaceById(mockid)
			if (!think.isEmpty(interfaceData)) {
				let url = {url: 'http://' + this.http.headers.host + '/' + interfaceData.project_id + '/' + interfaceData.api_url}
				let data = Object.assign({}, interfaceData, url)
				this.assign(data)
			}


		}else{
			this.assign({})
		}
		return this.display();
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
			// headers: this.http.headers,
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