'use strict';
import request from "request";
import Base from './base.js';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        //auto render template file index_index.html
        console.log(this.http.url)
        const data = await this.model('mockserver').where("api_url='" + this.http.url + "'").select();
        if (data.length) {
            var item = data[0];
            var _this = this;
            if (item.is_proxy === 0) {
                this.json(item.api_content)
            } else {
                if (item.proxy_prefix) {
                    let fn = think.promisify(request.get);
                    // console.log(fn)
                    let url = item.proxy_prefix + item.api_url
                    fn({
                        url: url,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) Chrome/47.0.2526.111 Safari/537.36"
                        }
                    }).then(function (content) {
                        _this.json(content.body);
                    }).catch(function (err) {
                        console.log(err)
                    });
                    // console.log(fn)
                    // this.json({message: '此接口没有提定代理地址请检查并修改2'});
                } else {
                    this.fail({message: '此接口没有提定代理地址请检查并修改'})
                }
            }
        } else {
            this.fail({message: '没有数据'})
        }
        // return this.display();
    }
}