'use strict';
import Base from '../../common/controller/common';
import crypto from 'crypto'
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        return this.display();
    }

    async proxyAction() {
        let url = this.get('url')
        let headers = await this.model('swagger').where({type: 1}).select()
        let content = await this.getProxy(url, 'get', headers)
        try {
            return this.json(content)
        } catch (e) {
            return this.json(e)
        }
    }

    async setHeaderAction() {
        let type = this.get('type')
        let posts = this.post()
        for (var item in posts) {
            var data = {
                header_name: item,
                header_val: posts[item],
                type: type
            }
            const res = await this.model('swagger').add(data)
            if (res) {
                return this.success('save success')
            }
            return this.fail('save error', 500)
        }
        return this.fail('arguments errors', 500)
    }
}