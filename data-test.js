var http = require('http');
const _this = this;
// app.request = { __proto__: req, app: app };
let server = http.createServer((req, res) => {
    // res.writeHead(200, {"Content-Type": 'application/json; charset=utf-8'});
    // res.writeHead(200, {"Access-Control-Allow-Origin": '*'});
    // // res.writeHead(200, {"Content-Type": 'application/json; charset=utf-8'});
    //
    // res.write('{data:{proxy:1,message:"this is proxy"}}');
    // res.end();
    // console.log(11);
    // res.writeHead(200, {"Access-Control-Allow-Origin": '*',"Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',"Accept-Encoding": 'gzip, deflate, sdch',"Accept-Language": 'en,zh-CN;q=0.8,zh;q=0.6'});
    // res.writeHead(200, {"Connection:":'keep-alive'});
    if (req.url === '/api/demo/proxy') {
        var data = {data: {proxy: 1, message: "this is proxy"}};
        res.writeHead(200, {"Content-Type": 'application/json; charset=utf-8'});
        res.write(JSON.stringify(data));
        res.end()
    } else {
        res.writeHead(404, {"Content-Type": 'text/html'});
        res.write('This is not found');
        res.end()
    }
})
var host = '127.0.0.1';
var port = 8034;
server.listen(port, function() {
    console.log('green', 'server has started')
    console.log('green', 'http://' + host + ':' + port)
});
