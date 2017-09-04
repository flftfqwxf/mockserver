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
    async proxyAction(){

        let url = this.get('url')
        let content = await this.getProxy(url, 'get')
        try {
            return this.json(content)

        } catch (e) {
            return this.json(e)
        }
    }
}