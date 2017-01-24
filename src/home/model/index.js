'use strict';
/**
 * model
 */
export default class extends think.model.base {
    addmockserver(data) {
        let id = this.add(data);
        console.log(id)
    }

    getmocklist() {
        let instance = this.model('mockserver');
        return instance.select();
    }
}