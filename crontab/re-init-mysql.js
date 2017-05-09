var mysql = require('mysql');
var path = require('path')
var fs = require('fs')
crontab = require('node-crontab')
let fn = () => {
    //定时任务具体逻辑
    //调用一个 Action
    reInitDatabase();
    // think.http('/home/image/spider', true); //模拟访问 /home/image/spier
}
// 1 小时执行一次
let jobId = crontab.scheduleJob('* 1 * * *', fn);
//开发环境下立即执行一次看效果
// if(think.env === 'development'){
//     fn();
// }
let mysqlConfig = {
    host: '127.0.0.1',
    port: '3306',
    database: 'mockserver',
    user: 'root',
    password: '',
    sqlfile: path.resolve(__dirname, '../mockserver.sql') // destination file
}
/**
 * 重新初始化数据库
 */
function reInitDatabase() {
    var con = mysql.createConnection({
        host: mysqlConfig.host,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        multipleStatements: true
    });
    console.log(mysqlConfig.sqlfile)
    con.connect(function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Connected!");
        con.query("DROP DATABASE IF EXISTS " + mysqlConfig.database + ";CREATE DATABASE " + mysqlConfig.database, function(err, result) {
            if (err) {
                console.log(err);
            }
            console.log("Database created");
            fs.readFile(mysqlConfig.sqlfile, 'utf8', function(err, sql) {
                if (err) {
                    console.log(err);
                }
                // console.log(sql)
                con.query('use ' + mysqlConfig.database + ';' + sql, function(err, results) {
                    if (err) {
                        console.log(err);
                    }
                    // if (!_.isArray(results)) {
                    //     results = [results];
                    // }
                    // console.log(results)
                    if (results) {
                        console.log(Date()+':re-Init database is successful!')
                    }
                });
            });
        });
    });
}

