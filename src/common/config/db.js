
'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
    type: 'mysql',
    adapter: {
        mysql: {
            host: '127.0.0.1',
            port: '3306',
            database: 'mockserver',
            user: 'root',
            password: '',
            prefix: 'mock_',
            encoding: 'UTF8MB4_GENERAL_CI'
        },
        // mysql: {
        //     host: '192.168.28.218',
        //     port: '3306',
        //     database: 'mockserver',
        //     user: 'ironhide',
        //     password: 'ironhide_staging123!',
        //     prefix: 'mock_',
        //     encoding: 'UTF8MB4_GENERAL_CI'
        // },
        mongo: {

        }
    }
};
