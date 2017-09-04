'use strict';
// let routes = new GetRoute();
// const apiroutes = routes.getRoute();
// const apireg=/^/
export default [
    [/^demo$/, 'home/interface/demo'],
    //项目设置路由
    [/^project\/add$/, 'home/project/add'],
    [/^project\/update$/, 'home/project/update'],
    [/^project\/edit/, 'home/project/edit'],
    [/^project\/delete/, 'home/project/delete'],
    //swagger 路由
    [/^swagger\/index/, 'home/swagger/index'],
    [/^swagger\/proxy\/(.+)/, 'home/swagger/proxy?url=:1'],
    //系统设置路由
    [/^system\/init/, 'home/system/init'],
    [/^system\/add/, 'home/system/add'],
    [/^system\/update/, 'home/system/update'],
    [/^system\/edit/, 'home/system/edit'],
    [/^system\/lang\/([\w-]+)$/, 'home/system/lang?lang=:1'],
    //接口设置路由
    [/^interface\/index/, 'home/interface/index'],
    [/^interface\/add$/, 'home/interface/add'],
    [/^interface\/add\/(\w+)$/, 'home/interface/add?project_id=:1'],
    [/^interface\/update/, '/home/interface/update'],
    [/^interface\/delete/, '/home/interface/delete'],
    [/^interface\/edit/, '/home/interface/edit'],
    [/^interface\/setproxy/, '/home/interface/setproxy'],
    [/^interface\/setproxies/, '/home/interface/setproxies'],
    [/^api\//, 'api/index'],
    [/^[\w_\d]+\//, 'api/index'],
]

