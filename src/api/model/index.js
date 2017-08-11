'use strict';
/**
 * model
 */
export default class extends think.model.base {
    /**
     * 获取系统配置信息
     * @returns {Promise.<*>}
     */
    async  getSystemConfig() {
        return await this.model('system').limit(1).find();
    }

    /**
     * 完整路径查询
     * @param url {string} api地址
     * @param api_type method类型
     * @param project_id 项目id
     * @returns {Promise.<*>}
     */
    async getApiByExactMatch(url, api_type, project_id) {
        return await this.model('mockserver').where({api_url: url, api_type: api_type, "mockserver.project_id": project_id})
            .alias('mockserver')
            .join([{
                table: 'project',
                as: 'project',
                on: ['`mockserver`.`project_id`', '`project`.`project_id`']
            }])
            .find();
    }

    /**
     * 只使用路径中 ？前面部分进行查询，如  aaaa/bb?a=d,查询 匹配【 aaaa/bb?】的数据
     * @param url {string} api地址
     * @param api_type method类型
     * @param project_id 项目id
     * @returns {Promise.<*>}
     */
    async getApiByNotExactMatch(url, api_type, project_id) {
        let tempUrl = url;
        if (tempUrl.split('?').length == 2) {
            tempUrl = tempUrl.split('?')[0];
        }
        return await this.model('mockserver').where("api_url regexp '^" + tempUrl + "\\\\??$' and mockserver.project_id='" + project_id + "' and api_type='" + api_type + "'")
            .alias('mockserver')
            .join([{
                table: 'project',
                as: 'project',
                on: ['`mockserver`.`project_id`', '`project`.`project_id`']
            }])
            .select();
    }

    /**
     * 先获取所有RESTful 格式数据，再从中筛选与当前URL匹配的数据
     * @param url {string} api地址
     * @param api_type method类型
     * @param project_id 项目id
     */
    async getApiByRESTfulFormat(url, api_type, project_id) {
        let regList = await this.model('mockserver').where({"mockserver.project_id": project_id, api_type: api_type, api_url_regexp: ['!=', null]})
            .alias('mockserver')
            .join([{
                table: 'project',
                as: 'project',
                on: ['`mockserver`.`project_id`', '`project`.`project_id`']
            }])
            // .field('mockid')
            .select();
        let reg_data = regList.filter((item) => {
            let m = new RegExp(decodeURI(item.api_url_regexp), "i").exec(url)
            if (m) {
                return true;
            }
        })
        return reg_data
    }
}