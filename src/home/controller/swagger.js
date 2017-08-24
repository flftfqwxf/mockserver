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
}