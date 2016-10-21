'use strict';
import request from "request";
import Base from './base.js';
const prefix = '/api/';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        //auto render template file index_index.html
        // console.log(this.http.url)
        const data = await this.model('mockserver').where("api_url='" + this.http.url.replace('/api/', '') + "'").find();
        if (!think.isEmpty(data)) {
            var item = data;
            var _this = this;
            let headers;
            if (item.is_proxy === 0) {
                if (item.api_header) {
                    try {
                        const api_header = JSON.parse(item.api_header);
                        for (var header in api_header) {
                            console.log(header, api_header[header])
                            let val = api_header[header];
                            this.http.header(header, encodeURIComponent(val)
                            );
                        }
                    } catch (e) {
                        return this.fail({message: e.message});
                    }
                    // headers = item.api_header.split(':');
                    // this.http.header(prefix + headers[0], headers[1].replace(/\r\n/ig, '').replace(/\n/ig, ''));
                }
                this.json(item.api_content)
            } else {
                if (item.proxy_prefix) {
                    _this.getProxy(item.proxy_prefix, prefix, item.api_url, item.api_type)
                    // console.log(fn)
                    // this.json({message: '此接口没有提定代理地址请检查并修改2'});
                } else {
                    if (!this.checkProjectProxy()) {
                        this.fail({message: '此接口没有指定全局和局部代理地址请检查并修改'})
                    } else {
                        this.getProxyFromProject(item.api_type)
                    }
                }
            }
        } else {
            this.getProxyFromProject()
        }
        // return this.display();
    }

    async getProxyFromProject(methodType) {
        const proxy_url = await this.checkProjectProxy()
        if (proxy_url) {
            this.getProxy(proxy_url, prefix, this.http.url.replace('/api/', ''), methodType);
        } else {
            this.fail({message: '此接口未定义全局代理'})
        }
    }

    async checkProjectProxy() {
        // const proxy_prefix = this.cookie('proxy_prefix');
        const proxy_prefix = 'http://192.168.28.218';
        if (proxy_prefix) {
            return proxy_prefix;
        }
        const project_id = this.http.headers.mock_project_id;
        if (project_id) {
            const projectItem = await this.model('project').where("project_id=" + project_id).find();
            // console.log(projectItem)
            if (!think.isEmpty(projectItem) && projectItem.proxy_url) {
                return projectItem.proxy_url
            }
            return false
        } else {
            // this.fail({message: '未指定项目名称'})
            return false
        }
    }

    getProxy(httpPrefix, prefix, api_url, method) {
        let _this = this
        // method = 'post';
        method = method || this.method().toLowerCase();
        let post = this.post();
        // post = {"mobile": "15800000003", "password": "123456"}
        // switch (method.toLowerCase()) {
        //     case 'post':
        //         ;
        //         break;
        //     case 'get':
        //         ;
        //         break;
        //     case '':
        //         ;
        //         break;
        //     default:
        //         break;
        // }
        let fn = think.promisify(request[method]);
        const curHttp = this.http;
        console.log(this.http.headers)
        let url = httpPrefix + prefix + api_url;
        curHttp.url = url;
        let send = {
            url: url,
            form: post,
            postDataSource: ''
            // headers:this.http.headers
        };

        //将请求端的header信息获取,并传递给请求
        //此处将 accept-encodeing 设置空:是因为编码问题,可能会造成乱码,并解析错误
        send.headers = Object.assign({}, this.http.headers, {'accept-encoding':null})
        // }
        console.log(url)
        fn(send).then(function (content) {
            for (var item in content.headers) {
                // console.log(item)
                _this.header(item, content.headers[item])
            }
            // console.log(content.body)
            content.body = JSON.parse(content.body)
            content.body.proxyDataSource = url
            _this.json(content.body);
        }).catch(function (err) {
            console.log(err)
        });
    }
}