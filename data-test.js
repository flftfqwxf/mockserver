var http = require('http');
const _this = this;
// app.request = { __proto__: req, app: app };
let server = http.createServer((req, res) => {
    res.writeHead(404, {"Content-Type": 'application/json'});
    res.write('{data:{proxy:1,message:"this is proxy"}}');
    res.end();
})
var host = '127.0.0.1';
var port = 8099;
server.listen(port, host, function() {
    console.log('green', 'server has started')
    console.log('green', 'http://' + host + ':' + port)
});
