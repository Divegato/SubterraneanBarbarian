var io = require('socket.io');
var express = require('express');
var http = require('http');

var app = express();
var server = http.Server(app);
var ws = io(server);

//app.get('/', function (req, res) {
//    res.sendfile('index.html');
//});

ws.on('connection', function (socket) {
    console.log('a user connected');
});

server.listen(1337, function () {
    console.log('listening on *:1337');
});


//ws.sockets.on('connection', function (socket) {
//    socket.on('setPseudo', function (data) {
//        socket.set('pseudo', data);
//    });

//    socket.on('message', function (message) {
//        socket.get('pseudo', function (error, name) {
//            var data = { 'message': message, pseudo: name };
//            socket.broadcast.emit('message', data);
//            console.log("user " + name + " send this : " + message);
//        })
//    });
//});

//var http = require('http');
//var net = require('net');
//var server = net.createServer();
//server.addListener('connection', function (c) {
//    c.end("{ test: 'bob' }");
//});

//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'application/json' });
//    res.end("{ test: 'bob' }");
//});

//server.listen(1337);

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

//function isFunction(functionToCheck) {
//    var getType = {};
//    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
//}

console.log('Server running');