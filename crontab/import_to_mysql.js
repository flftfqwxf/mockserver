var mysql = require('mysql');
var path = require('path')
var fs = require('fs')
let mysqlConfig = {
    host: '127.0.0.1',
    port: '3306',
    database: 'mockserver_import5',
    user: 'root',
    password: '',
    sqlfile: path.resolve(__dirname, '../mockserver.sql') // destination file
}
console.log(mysqlConfig.sqlfile)
var con = mysql.createConnection({
    host: mysqlConfig.host,
    user: mysqlConfig.user,
    password: mysqlConfig.password,
    multipleStatements: true
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE " + mysqlConfig.database, function(err, result) {
        if (err) throw err;
        console.log("Database created");
        fs.readFile(mysqlConfig.sqlfile, 'utf8', function(err, sql) {
            if (err) throw err;
            console.log(sql)
            con.query('use ' + mysqlConfig.database + ';' + sql, function(err, results) {
                if (err) throw err;
                // if (!_.isArray(results)) {
                //     results = [results];
                // }
                if (results) {
                    console.log('Import successful')
                }
            });
        });
    });
});
