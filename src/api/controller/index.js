'use strict';
import request from "request";
import Base from './base.js';
import Mock from 'mockjs';
const prefix = '/api/';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        //获取全局配置
        this.systemConfig = await this.model('system').limit(1).find();
        //auto render template file index_index.html
        // console.log(this.http.url)
        let url = this.http.url.replace('/api/', '');
        //先全路径匹配
        let data = await this.model('mockserver').where("api_url='" + this.http.url.replace('/api/', '') + "'").find();
        let tempUrl = url;
        if (tempUrl.split('?').length == 2) {
            tempUrl = tempUrl.split('?')[0];
        }
        //如果查不到相应接口,则将 URL【?】后去掉后再查询
        if (think.isEmpty(data)) {
            // let firstObj = this.urlParmsTransform(url);
            const tempdata = await this.model('mockserver').where("api_url regexp '^" + tempUrl + "\\\\?'").select();
            //当匹配方式为只匹配【?】后面参数时
            if (tempdata.length == 1 && tempdata[0].exact_match === 0) {
                data = tempdata[0];
            } else if (tempdata.length > 1) {
                data = [];
                tempdata.forEach((item, index)=> {
                    if (item.exact_match !== 1) {
                        data.push(item);
                    }
                })
                if (data.length > 1) {
                    return this.json({'message': '有多个接口使用了此路径', list: data})
                }
            }
        }
        if (!think.isEmpty(data)) {
            var item = data;
            var _this = this;
            this.item = data;
            let headers;
            if (item.is_proxy === 0) {
                let api_header;
                if (item.api_header) {
                    try {
                        api_header = JSON.parse(item.api_header);
                    } catch (e) {
                        return this.fail({message: 'header信息格式错误'});
                    }
                    for (var header in api_header) {
                        // console.log(header, api_header[header])
                        let val = api_header[header];
                        this.http.header(header, encodeURIComponent(val));
                    }
                    // headers = item.api_header.split(':');
                    // this.http.header(prefix + headers[0], headers[1].replace(/\r\n/ig, '').replace(/\n/ig, ''));
                }
                if (item.is_mockjs) {
                    item.api_content = Mock.mock(JSON.parse(item.api_content));
                }
                if (item.api_state_code) {
                    this.http.status(item.api_state_code)
                }
                if (item.api_lazy_time && item.api_lazy_time > 0) {
                    setTimeout(()=> {
                        this.json(item.api_content);
                    }, item.api_lazy_time)
                } else {
                    this.json(item.api_content);
                }
            } else {
                if (item.proxy_prefix) {
                    let api_url = item.api_url.split('?');
                    let request_url = url.split('?');
                    /**
                     * 当模式为只匹配【?】前部分并开启了二次代理时，直接请求用户发送的URL，
                     * 原因是：当能匹配到数据时，说明用户发送的URL与数据库的数据的【？】前部分匹配，而【?】后的参数不一定相同，如：
                     * 数据库URL为：/a/b?a=1
                     * 用户请求URL为:/a/b?a=2
                     * 此时开启了二次代理，直接请求用户请数的URL，才可获取到用户动态参数的的数据
                     */
                    if (item.exact_match === 0) {
                        item.api_url = url;
                    }
                    _this.getProxy(item.proxy_prefix, prefix, item.api_url, item.api_type)
                    // console.log(fn)
                    // this.json({message: '此接口没有提定代理地址请检查并修改2'});
                } else {
                    if (!this.checkProjectProxy(_this.systemConfig.proxy_url)) {
                        this.fail({message: '此接口没有指定全局和局部代理地址请检查并修改'})
                    } else {
                        this.getProxyFromProject(item.api_type, _this.systemConfig.proxy_url)
                    }
                }
            }
        } else {
            this.getProxyFromProject(null, this.systemConfig.proxy_url)
        }
        // return this.display();
    }

    urlParmsTransform(url) {
        let tempUrl = url.split('?');
        let parm, parmstr = [], tempObj = {};
        if (tempUrl.length == 2) {
            let parmsList = tempUrl[1].split('&');
            parmsList.forEach((item)=> {
                parm = item.split('=');
                if (parm.length == 2) {
                    tempObj[parm[0]] = parm[1];
                }
            })
        }
        return tempObj;
    }

    async  getProxyFromProject(methodType, systemProxyUrl) {
        const proxy_url = await this.checkProjectProxy(systemProxyUrl);
        if (proxy_url) {
            return this.getProxy(proxy_url, prefix, this.http.url.replace('/api/', ''), methodType);
        } else {
            return this.fail({message: '此接口未定义全局代理'})
        }
    }

    /**
     * 获取代理前缀地址,获取权重 COOKIE>header>系统全局设置
     * @param systemProxyUrl 系统全局的代理路径
     * @returns {*}
     */
    async checkProjectProxy(systemProxyUrl) {
        let proxy_prefix = this.cookie('proxy_prefix') || this.http.headers.proxy_prefix;
        if (proxy_prefix) {
            return proxy_prefix;
        }
        if (systemProxyUrl) {
            return systemProxyUrl
        } else {
            return this.fail({message: '请在全局设置中设置全局二次代理'})
        }
    }

    /**
     * 从指定URL获取数据
     * @param httpPrefix {string} 域名前缀，格式如:http://192.168.0.1/
     * @param prefix {string} 接口前缀，目前指定为 [api]目的是为了规范接口格式，也避免与系统本身的路由冲突
     * @param api_url {string} 接口地址
     * @param method {string} 请求方式：GET,PUT,DELETE,POST等
     * @returns {*}
     */
    getProxy(httpPrefix, prefix, api_url, method) {
        let _this = this
        method = method || this.method().toLowerCase();
        let post = this.post();
        let fn = think.promisify(request[method]);
        const curHttp = this.http;
        // console.log(this.http.headers)
        let url = httpPrefix + prefix + api_url;
        curHttp.url = url;
        let send = {
            url: url,
            form: post,
            postDataSource: ''
            // headers:this.http.headers
        };
        if (this.systemConfig && this.systemConfig.api_headers) {
            let api_headers;
            try {
                api_headers = JSON.parse(this.systemConfig.api_headers);
            } catch (e) {
                return this.fail({message: e.message})
            }
            if (think.isArray(api_headers.headers)) {
                let headersObj = {};
                api_headers.headers.forEach((item)=> {
                    item = item.toLowerCase();
                    if (_this.http.headers[item]) {
                        headersObj[item] = _this.http.headers[item];
                    }
                });
                send.headers = headersObj;
            } else {
                return this.fail({message: 'header格式错误,请参考全局配置中格式说明'})
            }
        }
        //将请求端的header信息获取,并传递给请求
        //此处将 accept-encodeing 设置空:是因为编码问题,可能会造成乱码,并解析错误
        // send.headers = Object.assign({}, this.http.headers, {'accept-encoding': null})
        // }
        // console.log(url)
        // _this.fail({message: ':获取数据错误,可能是接口不存在,或参数错误,错误信息:'});
        fn(send).then(function(content) {
            // console.log(content.body)
            try {
                content.body = JSON.parse(content.body)
            } catch (e) {
                return Promise.reject(e.message);
            }
            //todo:将返回的HEADER返回给客户端,有BUG,
            //有些HEADER信息返回后会无法返回数据
            /**
             * todo:将返回的HEADER返回给客户端.
             * todo:有BUG有些HEADER信息返回后会无法返回数据
             * todo:此处必须try 之后,因为返回content-length header信息,在返回 fail时,会报错:
             * net::ERR_CONTENT_LENGTH_MISMATCH
             */
            for (var item in content.headers) {
                // console.log(item)
                _this.header(item, content.headers[item])
            }
            content.body.proxyDataSource = url
            if (_this.item && _this.item.api_lazy_time && _this.item.api_lazy_time > 0) {
                setTimeout(()=> {
                    _this.json(content.body);
                }, _this.item.api_lazy_time)
            } else {
                _this.json(content.body);
            }
        }).catch(function(err) {
            console.log(err)
            _this.fail({message: url + ':获取数据错误,可能是接口不存在,或参数错误,错误信息:' + err});
        });
    }
}