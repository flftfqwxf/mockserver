'use strict';
import Base from '../../common/controller/common';
import mysql from 'mysql';
import path from 'path';
import fs from'fs';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */


    async addAction() {
        let res = await this.model('system').limit(1).find();
        if (!think.isEmpty(res)) {
            this.assign(res)
        }
        return this.display('add.nunj')
    }

    async updateAction() {
        // console.log(this.post())
        let data = this.post();
        if (think.isEmpty(data)) {
            return this.setSuccess({message: this.LN.system.controller.dataIsEmpty, url: '/system/add', btnTxt: this.LN.system.controller.editAgain})
        }
        let systemData = await this.model('system').limit(1).find();
        let res;
        if (!think.isEmpty(systemData)) {
            res = await this.model('system').where({id: systemData.id}).update(data);
        } else {
            res = await this.model('system').add(data);
        }
        if (res) {
            // this.active = "/";
            return this.setSuccess({message: this.LN.system.controller.updateSuccess, url: '/system/add', btnTxt: this.LN.system.controller.editAgain})
        } else {
            return this.setSuccess({message: this.LN.system.controller.updateFailed, url: '/system/add', btnTxt: this.LN.system.controller.editAgain})
        }
        // await this.model("action").log("add_document", "document", res.id, this.user.uid, this.ip(), this.http.url);
        return this.display();
    }

    async initAction() {
        if (this.http.isPost()) {
            await this.initPost(this.post())
        } else {
            return this.display()
        }
    }

    async initPost(post) {
        var _this = this;
        if (!post.host) {
            return this.setSuccess({message: this.LN.system.controller.hostIsEmpty, url: '/system/init', btnTxt: this.LN.system.controller.editAgain})
        }
        if (!post.port) {
            return this.setSuccess({message: this.LN.system.controller.portIsEmpty, url: '/system/init', btnTxt: this.LN.system.controller.editAgain})
        }
        if (!post.database) {
            return this.setSuccess({message: this.LN.system.controller.databaseIsEmpty, url: '/system/init', btnTxt: this.LN.system.controller.editAgain})
        }
        if (!post.user) {
            return this.setSuccess({message: this.LN.system.controller.userIsEmpty, url: '/system/init', btnTxt: this.LN.system.controller.editAgain})
        }
        let mysqlConfig = {
            host: post.host,
            port: post.port || 3306,
            database: post.database,
            user: post.user,
            password: post.password || '',
            sqlfile: path.resolve(__dirname, '../../../mockserver.sql'), // .sql file
            db_config_file: path.resolve(__dirname, '../../../src/common/config/db.js')
        }
        console.log(mysqlConfig.sqlfile)
        var con = mysql.createConnection({
            host: mysqlConfig.host,
            user: mysqlConfig.user,
            password: mysqlConfig.password,
            multipleStatements: true
        });
        await con.connect(function(err) {
            if (err) {
                return _this.setSuccess({message: err, url: '/system/init', btnTxt: _this.LN.system.controller.editAgain})
            }
            console.log("Connected!");
            con.query("CREATE DATABASE " + mysqlConfig.database, function(err, result) {
                if (err) {
                    return _this.setSuccess({message: err, url: '/system/init', btnTxt: _this.LN.system.controller.editAgain})
                }
                console.log("Database created");
                fs.readFile(mysqlConfig.sqlfile, 'utf8', function(err, sql) {
                    if (err) {
                        return _this.setSuccess({message: err, url: '/system/init', btnTxt: _this.LN.system.controller.editAgain})
                    }
                    // console.log(sql)
                    con.query('use ' + mysqlConfig.database + ';' + sql, function(err, results) {
                        if (err) {
                            return _this.setSuccess({message: err, url: '/system/init', btnTxt: _this.LN.system.controller.editAgain})
                        }
                        // if (!_.isArray(results)) {
                        //     results = [results];
                        // }
                        // console.log(results)
                        if (results) {
                            fs.open('myfile', 'w', (err, fd) => {
                                if (err) {
                                    return _this.setSuccess({message: err, url: '/system/init', btnTxt: _this.LN.system.controller.editAgain})
                                }
                                let config = " 'use strict';                                    \n" +
                                    " /**                                              \n" +
                                    " * db config                                     \n " +
                                    " * @type {Object}                                 \n" +
                                    " */                                               \n" +
                                    " export default {                                \n " +
                                    "     type: 'mysql',                              \n " +
                                    "     adapter: {                                  \n " +
                                    "          mysql: {                             \n " +
                                    "              host: '" + mysqlConfig.host + "',                \n" +
                                    "              port: '" + mysqlConfig.port + "',                     \n" +
                                    "              database: '" + mysqlConfig.database + "',           \n" +
                                    "              user: '" + mysqlConfig.user + "',                     \n" +
                                    "              password: '" + mysqlConfig.password + "',                     \n" +
                                    "              prefix: 'mock_',                  \n" +
                                    "             encoding: 'UTF8MB4_GENERAL_CI'     \n" +
                                    "          },                                    \n" +
                                    "         mongo: {                                 \n" +
                                    "                                                  \n" +
                                    "         }                                        \n" +
                                    "     }                                            \n" +
                                    " };                                               \n"
                                fs.writeFile(mysqlConfig.db_config_file, config, 'utf8', function(err) {
                                    if (err) {
                                        return _this.setSuccess({message: err, url: '/system/init', btnTxt: _this.LN.system.controller.editAgain})
                                    }
                                    setTimeout(() => {
                                        _this.redirect('/system/add')
                                    }, 1500)
                                })
                            });
                        }
                    });
                });
            });
        });
    }

    async langAction() {
        let lang = this.get('lang');
        if (think.isEmpty(lang)) {
            return this.fail(this.LN.system.controller.langIsEmpty, 500)
        }
        await this.cookie('think_locale', lang);
        this.lang(lang);
        return this.success(this.LN.system.controller.updateSuccess);
    }
}