'use strict';
// import think from 'thinkjs/c'
class GetRoute {
    getUrls() {
        let list = []
        const reg = /^api/;
        const url = "api/index";
        let item = [reg, url]
        list.push(item)
        return list
        // return this.model('mockserver').select();
    }
}
const list = new GetRoute().getUrls()
export default list
