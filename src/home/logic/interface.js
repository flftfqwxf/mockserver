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
            project_id: 'required',
            api_name: "required",
            api_url: 'required',
            api_content: 'required',
        }
        if (!this.validate(rules)) {
            return this.setErrorMessage(this.errors())
        }
    }

    addMockServerAction() {
        //auto render template file index_index.html
    }
}