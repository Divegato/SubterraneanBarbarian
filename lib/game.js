var floor = require('./floor.js');

var exports = exports || {};

function game(io) {
    var self = this;

    self.players = {};
    self.map = new floor.generate();

    // Register connection event
    io.on('connection', function (socket) {
        self.onConnection(io, socket);
    });

    self.onConnection = function (io, socket) {
        // Register new player
        self.registerPlayer(io, socket);

        // Register disconnect event
        socket.on('disconnect', function () {
            self.onDisconnect(io, socket);
        });

        // Register look event
        socket.on('look', function (msg) {
            self.onLook(io, socket);
        });

        // Register look event
        socket.on('lookfull', function (msg) {
            socket.emit('look', self.map.map);
        });

        // Register move event
        socket.on('move', function (msg) {
            self.onMove(io, socket, msg);
        });
    }

    self.getPlayer = function (socket) {
        var player;

        if (socket && socket.conn && socket.conn.id && self.players[socket.conn.id]) {
            player = self.players[socket.conn.id];
        } else {
            throw new Error("Attempting to retrieve a player that doesn't exist.");
        }

        return player;
    };

    self.registerPlayer = function (io, socket) {
        var playerLocation = self.map.addPlayer();

        var player = {
            id: socket.conn.id,
            x: playerLocation.x,
            y: playerLocation.y
        };

        self.players[player.id] = player;

        var look = self.map.getVision(player);
        socket.emit('look', look);
        //todo: emit player tile to any other sockets within sight range
    }

    self.onDisconnect = function (io, socket) {
        var player = self.getPlayer(socket);

        self.map.removePlayer(player);
        //todo: emit changes to any other sockets within sight range
    }

    self.onLook = function (io, socket) {
        var player = self.getPlayer(socket);

        var look = self.map.getVision(player);
        socket.emit('look', look);
    }

    self.onMove = function (io, socket, direction) {
        var player = self.getPlayer(socket);

        var changes = self.map.movePlayer(player, direction);
        socket.emit('changes', changes);
        //todo: emit changes to any other sockets within sight range
    }
}

exports.game = game;
