var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chat = require('./lib/chat.js').chat(io);
var game = require('./lib/game.js').game(io);

app.use(express.static(__dirname + '/public'));

http.listen(3000, function () {
    console.log('listening on *:3000');
});
