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
export default [
    [/^demo$/, 'home/interface/demo'],
    [/^api/, 'api/index'],
    //项目设置路由
    [/^project\/add$/, 'home/project/add'],
    [/^project\/update$/, 'home/project/update'],
    [/^project\/edit/, 'home/project/edit'],
    [/^project\/delete/, 'home/project/delete'],
    //系统设置路由
    [/^system\/add/, 'home/system/add'],
    [/^system\/update/, 'home/system/update'],
    [/^system\/edit/, 'home/system/edit'],
    //接口设置路由
    [/^interface\/index/, 'home/interface/index'],
    [/^interface\/add/, 'home/interface/add'],
    [/^interface\/update/, '/home/interface/update'],
    [/^interface\/delete/, '/home/interface/delete'],
    [/^interface\/edit/, '/home/interface/edit'],
    [/^interface\/setproxy/, '/home/interface/setproxye']
]

