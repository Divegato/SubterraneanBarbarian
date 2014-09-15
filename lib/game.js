var exports = exports || {};

function game(io) {
    var self = this;

    self.players = {};
    self.map = generateMap();

    // Register connection event
    io.on('connection', function (socket) {
        self.onConnection(io, socket, self.map);
    });

    self.onConnection = function (io, socket, map) {
        // Register new player
        self.registerPlayer(io, socket);

        // Register disconnect event
        socket.on('disconnect', function () {
            self.onDisconnect(io, socket);
        });

        // Register look event
        socket.on('look', function (msg) {
            self.onLook(io, socket, map);
        });

        // Register move event
        socket.on('move', function (msg) {
            self.onMove(io, socket, msg, map);
        });
    }

    self.registerPlayer = function (io, socket) {
        var player = placePlayer(self.map);

        self.players[socket.conn.id] = player;

        var changes = [self.map[player.y][player.x]];

        io.emit('changes', changes);
    }

    self.onDisconnect = function (io, socket) {
        var player = self.players[socket.conn.id];

        self.map[player.y][player.x].player = false;

        self.players[socket.conn.id] = undefined;

        var changes = [self.map[player.y][player.x]];

        io.emit('changes', changes);
    }

    self.onLook = function (io, socket, map) {
        //var player = getPlayer(socket);
        //socket.emit('look', getLook(map, player));
        socket.emit('look', map);
    }

    self.onMove = function (io, socket, msg, map) {
        //var player = getPlayer(socket);
        //socket.emit('look', getLook(map, player));
        var changes = [];

        var player = self.players[socket.conn.id];

        var x = player.x;
        var y = player.y;
        switch (msg) {
            case 'nw':
                y -= 1;
                x += y % 2 == 1 ? -1 : 0
                break;
            case 'ne':
                x += y % 2 == 1 ? 1 : 0
                y -= 1;
                break;
            case 'sw':
                y += 1;
                x += y % 2 == 1 ? -1 : 0
                break;
            case 'se':
                y += 1;
                x += y % 2 == 1 ? 0 : 1
                break;
            case 'e':
                x += 1;
                break;
            case 'w':
                x -= 1;
                break;
            default:
        }

        if (self.canMove(x, y)) {
            self.map[player.y][player.x].player = false;
            changes.push(self.map[player.y][player.x]);
            player.x = x;
            player.y = y;
            self.map[player.y][player.x].player = true;
            changes.push(self.map[player.y][player.x]);
            io.emit('changes', changes);
        }
    }

    self.canMove = function (x, y) {
        var canMove = false;

        if (self.map[y] && self.map[y][x] && !self.map[y][x].player && self.map[y][x].render == 0) {
            canMove = true;
        }

        return canMove;
    }

    function getLook(player) {
        var sight = [];
        try {
            sight = [[self.map[player.y][player.x]]];
            sight[0][0].player = true;
            var xMin = player.x;
            var xMax = player.x;
            var yMin = player.y;
            var yMax = player.y;
            var iSawSomething = true;
            while (iSawSomething) {
                iSawSomething = false;
                // Expand limits of sight
                xMin--;
                yMin--;
                xMax++;
                yMax++;

                // Add empty rows to y min and max
                if (self.map[yMin]) {
                    sight.splice(0, 0, []);
                }
                if (self.map[yMax]) {
                    sight.push([]);
                }

                // Check the top and bottom rows of the new sight range
                for (var x = xMin; x <= xMax; x++) {
                    if (self.map[yMin]) {
                        var yMinTile = self.map[yMin][x];
                        sight[0].push(yMinTile);
                        if (yMinTile.render == ' ') {
                            iSawSomething = true;
                        }
                    }
                    if (self.map[yMax]) {
                        var yMaxTile = self.map[yMax][x];
                        if (yMaxTile) {
                            sight[sight.length - 1].push(yMaxTile);
                            if (yMaxTile.render == ' ') {
                                iSawSomething = true;
                            }
                        }
                    }
                }

                // Check the left and right columns of the new sight range
                for (var y = yMin + 1; y < yMax; y++) {
                    if (self.map[y]) {
                        var xMinTile = self.map[y][xMin];
                        if (xMinTile) {
                            sight[y - yMin].splice(0, 0, xMinTile);
                            if (xMinTile.render == ' ') {
                                iSawSomething = true;
                            }
                        }
                        var xMaxTile = self.map[y][xMax];
                        if (xMaxTile) {
                            sight[y - yMin].push(xMaxTile);
                            if (xMaxTile.render == ' ') {
                                iSawSomething = true;
                            }
                        }
                    }
                }
            }
        }
        catch (exception) {
            console.error(exception);
        }

        return sight;
    }

    function placePlayer(map) {
        var y = Math.floor(Math.random() * map.length);
        var x = Math.floor(Math.random() * map[0].length);

        var player = { x: x, y: y }

        map[player.y][player.x].player = true;

        return player;
    }

    function generateMap() {
        var width = Math.ceil(Math.random() * 15 + 15);
        var height = Math.ceil(Math.random() * 15 + 15);
        var floor = [];

        for (var y = 0; y <= height; y++) {
            floor.push([]);
            for (var x = 0; x <= width; x++) {
                var tile = {}
                tile.x = x;
                tile.y = y;

                var border = (y == 0 || x == 0 || y == height || x == width);

                tile.render = (border || (Math.random() > 0.9)) ? 'X' : ' ';
                floor[y].push(tile);
            }
        }

        return floor;
    };

    function generateTile() {
        var y = Math.floor(Math.random() * self.map.length);
        var x = Math.floor(Math.random() * self.map[0].length);
        var render = (Math.random() > 0.9) ? 'X' : ' ';
        self.map[y][x].render = render;

        return self.map[y][x];
    }
}

exports.game = game;
