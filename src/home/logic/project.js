'use strict';
import Base from '../../common/controller/common';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends Base {
    /**
     * index action logic
     * @return {} []
     */
    updateAction() {
        this.allowMethods = 'post'
        let rules = {
            project_name: 'required',
            proxy_url: "url",
            swagger_url: 'url'
        }
        if (!this.validate(rules)) {
            return this.setErrorMessage(this.errors())
        }
    }

    addMockServerAction() {
        //auto render template file index_index.html
    }
}