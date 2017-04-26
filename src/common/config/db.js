
'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
    type: 'mysql',
    adapter: {
        mysql: {
            host: 'rm-uf65v49t1eyxu4xv8o.mysql.rds.aliyuncs.com',
            port: '3306',
            database: 'mockserver',
            user: 'flftfqwxf',
            password: 'flftfqwxf@126520',
            prefix: 'mock_',
            encoding: 'UTF8MB4_GENERAL_CI'
        },
        mongo: {

        }
    }
};
