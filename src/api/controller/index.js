'use strict';
import request from "request";
import Base from '../../common/controller/common';
import Mock from 'mockjs';
import _ from 'lodash';
// import index from '../model/index'
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        //允许跨域访问接口
        this.http.header('Access-Control-Allow-Origin', '*');
        let _this = this;
        this.project_id = "";
        this.prefix = "";
        this.LN = this.assign('LN');
        //获取全局配置
        this.systemConfig = await this.model('index').getSystemConfig();
        //auto render template file index_index.html
        // console.log(this.http.url)
        this.prefix = this.http.url.match(/\/[\w_\d]+\//);
        if (this.prefix.length > 0) {
            this.prefix = this.prefix[0];
            this.project_id = this.prefix.replace(/\//ig, '');
        } else {
            return this.fail({message: 'Url format is error'});
        }
        this.url = this.http.url.replace(this.prefix, '');
        let api_type = this.post('_method') | this.method()
        //先全路径匹配
        let data = await this.model('index').getApiByExactMatch(this.url, api_type, this.project_id)
        //如果查不到相应接口,则将 URL【?】后去掉后再查询
        if (think.isEmpty(data)) {
            // let firstObj = this.urlParmsTransform(url);
            const tempdata = await this.model('index').getApiByNotExactMatch(this.url, api_type, this.project_id)
            //当匹配方式为只匹配【?】后面参数时
            if (tempdata.length == 1 && tempdata[0].exact_match === 0) {
                data = tempdata[0];
            } else if (tempdata.length > 1) {
                data = [];
                tempdata.forEach((item, index) => {
                    if (item.exact_match !== 1) {
                        data.push(item);
                    }
                })
                if (data.length > 1) {
                    return this.json({'message': _this.LN.api.multipleInterfaceError, list: data})
                }
            }
        }
        /**
         * 如果查不到相应接口，则通过 api_url_regexp 匹配查询
         */
        if (think.isEmpty(data)) {
            // let firstObj = this.urlParmsTransform(url);
            const reg_data = await this.model('index').getApiByRESTfulFormat(this.url, api_type, this.project_id)
            // console.log(reg_data)
            if (reg_data.length === 1) {
                // console.log(reg_data)
                data = reg_data[0]
            } else if (reg_data.length > 1) {
                return this.json({'message': _this.LN.api.multipleInterfaceError, list: reg_data})
            }
        }
        if (!think.isEmpty(data)) {
            var item = this.item = data;
            if (item.is_proxy === 0) {
                let api_header;
                if (item.api_header) {
                    try {
                        api_header = JSON.parse(item.api_header);
                    } catch (e) {
                        return this.fail({message: _this.LN.api.headerFormatError});
                    }
                    for (var header in api_header) {
                        // console.log(header, api_header[header])
                        let val = api_header[header];
                        // this.http.header(header, encodeURIComponent(val));
                        this.http.header(header, encodeURI(val));
                    }
                }
                item.api_content = JSON.parse(item.api_content)
                if (item.is_mockjs) {
                    item.api_content = Mock.mock(item.api_content);
                }
                if (item.api_state_code) {
                    this.http.status(item.api_state_code)
                }
                if (item.api_type !== 'get') {
                    item.api_content.desc = "当请求类型不为GET时，查看接口是通过表单提交来获取不同的请求类型的数据。因此，刷新时会提示再次提交表单，为正常现象。相反，如果在浏览器的地址栏中，回车刷新页面，则不会提交表单，此时访问的接口为GET请求，可能与预期不一致，因此不建议如此使用"
                }
                if (item.api_lazy_time && item.api_lazy_time > 0) {
                    setTimeout(() => {
                        this.json(item.api_content);
                    }, item.api_lazy_time)
                } else {
                    this.json(item.api_content);
                }
            } else {
                if (item.proxy_prefix) {
                    /**
                     * 当模式为只匹配【?】前部分并开启了二次代理时，直接请求用户发送的URL，
                     * 原因是：当能匹配到数据时，说明用户发送的URL与数据库的数据的【？】前部分匹配，而【?】后的参数不一定相同，如：
                     * 数据库URL为：/a/b?a=1
                     * 用户请求URL为:/a/b?a=2
                     * 此时开启了二次代理，直接请求用户请求的URL，才可获取到用户动态参数的的数据
                     */
                    if (item.exact_match === 0) {
                        item.api_url = _this.url;
                    }
                    return _this.getProxy(item.proxy_prefix, item.api_url, item.api_type)
                    // console.log(fn)
                    // this.json({message: '此接口没有提定代理地址请检查并修改2'});
                } else {
                    if (!this.checkProjectProxy(_this.systemConfig.proxy_url)) {
                        this.fail({message: _this.LN.api.proxyIsEmptyError})
                    } else {
                        return this.getProxyFromProject(item.api_type, _this.systemConfig.proxy_url)
                    }
                }
            }
        } else {
            return this.getProxyFromProject(null, this.systemConfig.proxy_url)
        }
        // return this.display();
    }

    async  getProxyFromProject(methodType, systemProxyUrl) {
        const proxy_url = await this.checkProjectProxy(systemProxyUrl);
        if (proxy_url) {
            return this.getProxy(proxy_url, this.http.url.replace(this.prefix, ''), methodType);
        } else {
            return this.fail({message: this.LN.api.globalProxyIsEmptyError})
        }
    }

    /**
     * 获取代理前缀地址,获取权重 COOKIE>header>系统全局设置
     * @param systemProxyUrl 系统全局的代理路径
     * @returns {*}
     */
    async checkProjectProxy(systemProxyUrl) {
        let current_project = await this.model('project').where({"project_id": this.project_id}).find()
        let proxy_prefix = this.cookie('proxy_prefix') || this.http.headers.proxy_prefix;
        if (!think.isEmpty(current_project)) {
            proxy_prefix = current_project.proxy_url
        }
        if (proxy_prefix) {
            return proxy_prefix;
        }
        if (systemProxyUrl) {
            return systemProxyUrl
        } else {
            return this.fail({message: this.LN.api.globalProxyIsEmptyError})
        }
    }

    /**
     * 从指定URL获取数据
     * @param httpPrefix {string} 域名前缀，格式如:http://192.168.0.1/
     * @param api_url {string} 接口地址
     * @param method {string} 请求方式：GET,PUT,DELETE,POST等
     * @returns {*}
     */
    getProxy(httpPrefix, api_url, method) {
        let _this = this
        method = method || this.method().toLowerCase();
        let post = this.post();
        let fn = think.promisify(request[method]);
        const curHttp = this.http;
        // console.log(this.http.headers)
        let url = httpPrefix + '/' + api_url;
        curHttp.url = url;
        let send = {
            url: url,
            form: post,
            postDataSource: ''
            // headers:this.http.headers
        };
        let headersWhiteList = []
        let headersBlacklist = [
            'host',
            'accept-encoding'
        ]
        let headersObj = {};
        let headers = this.http.headers;
        if (this.systemConfig) {
            if (this.systemConfig.headers_proxy_state === 0 || !this.systemConfig.headers_proxy_state) {
                if (this.systemConfig.headers_black_list) {
                    headersBlacklist = this.systemConfig.headers_black_list.toLowerCase().replace('\r\n', '||').replace('\n', '||').split('||').filter((item) => {
                        return item.replace(/\s/ig, '')
                    });
                }
                for (var key in headers) {
                    key = _.trim(key.toLowerCase());
                    if (headersBlacklist.indexOf(key) === -1) {
                        headersObj[key] = headers[key];
                    }
                }
            } else if (this.systemConfig.headers_proxy_state === 1) {
                if (this.systemConfig.headers_white_list) {
                    headersWhiteList = this.systemConfig.headers_white_list.toLowerCase().replace('\r\n', '||').replace('\n', '||').split('||').filter((item) => {
                        return item.replace(/\s/ig, '')
                    })
                }
                for (var key in headersWhiteList) {
                    key = _.trim(key.toLowerCase());
                    headersObj[headersWhiteList[key]] = headers[headersWhiteList[key]];
                }
            }
            // headersObj.host='www.covisiondd.com'
            send.headers = headersObj;
        }
        send.headers['is-mock-server-proxy'] = 1;
        //将请求端的header信息获取,并传递给请求
        //此处将 accept-encodeing 设置空:是因为编码问题,可能会造成乱码,并解析错误
        // send.headers = Object.assign({}, this.http.headers, {'accept-encoding': null})
        // }
        // console.log(url)
        // _this.fail({message: ':获取数据错误,可能是接口不存在,或参数错误,错误信息:'});
        // console.log(send)
        fn(send).then(function(content) {
            // console.log(content.body)
            try {
                content.body = JSON.parse(content.body)
            } catch (e) {
                return Promise.reject(content.body);
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
                setTimeout(() => {
                    _this.json(content.body);
                }, _this.item.api_lazy_time)
            } else {
                _this.json(content.body);
            }
        }).catch(function(err) {
            console.log(err)
            return _this.fail({proxyUrl: url, errorMessage: _this.LN.api.getProxyDataError, errorContent: err});
        });
    }
}

