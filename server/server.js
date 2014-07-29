var http = require('http');
var net = require('net');

var server = net.createServer();
server.addListener('connection', function (c) {
    c.end("{ test: 'bob' }");
});

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end("{ test: 'bob' }");
});

server.listen(1337);

//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });

//    var result = '';
//    for (var i in req) {
//        if (!isFunction(req[i])) {
//            result += i + ': ' + req[i] + '\n';
//        }
//        else {
//            result += i + ': function\n';
//        }
//    }

//    res.end(result);

//}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}