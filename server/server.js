try {
    //var websocket = require('websocket');
    //var http = require('http');

    //var server = http.createServer(function (request, response) {
    //    // process HTTP request. Since we're writing just WebSockets server
    //    // we don't have to implement anything.
    //});
    //server.listen(1337, function () { });

    //// create the server
    //wsServer = new websocket.server({
    //    httpServer: server
    //});

    //// WebSocket server
    //wsServer.on('request', function (request) {
    //    var connection = request.accept(null, request.origin);

    //    // This is the most important callback for us, we'll handle
    //    // all messages from users here.
    //    connection.on('message', function (message) {
    //        if (message.type === 'utf8') {
    //            // process WebSocket message
    //        }
    //    });

    //    connection.on('close', function (connection) {
    //        // close user connection
    //    });
    //});

    //var io = require('socket.io');
    //var express = require('express');
    //var http = require('http');

    //var app = express();
    //var server = http.Server(app);
    //var ws = io(server);

    //app.get('/', function (req, res) {
    //    res.sendfile('../web/index.html');
    //});

    //ws.on('connection', function (socket) {
    //    console.log('a user connected');
    //});

    //server.listen(1337, function () {
    //    console.log('listening on *:1337');
    //});


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
} catch (error) {
    // handle the error safely
    console.log(error);
}