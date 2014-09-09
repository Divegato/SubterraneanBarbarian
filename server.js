var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chat = require('./chat.js').on(io);
var game = require('./game.js')(io);

app.use(express.static(__dirname + '/public'));

http.listen(3000, function () {
    console.log('listening on *:3000');
});
