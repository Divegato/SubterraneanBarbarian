module.exports = function (io) {
    io.on('connection', function (socket) {
        socket.on('look', function (msg) {
            //socket.emit('look', getLook(map, player));
            socket.emit('look', map);
        });
        socket.on('move', function (msg) {
            //socket.emit('look', getLook(map, player));
            var changes = [];
            map[player.y][player.x].player = false;
            changes.push(map[player.y][player.x]);
            switch (msg) {
                case 'n':
                    player.y -= 1;
                    break;
                case 's':
                    player.y += 1;
                    break;
                case 'e':
                    player.x += 1;
                    break;
                case 'w':
                    player.x -= 1;
                    break;
                default:
            }
            map[player.y][player.x].player = true;
            changes.push(map[player.y][player.x]);
            io.emit('changes', changes);
        });
    });

    var map = generateMap();
    var player = placePlayer(map);
    map[player.y][player.x].player = true;

    setInterval(function () {
        var changes = getChanges();
        if (changes.length > 0) {
            io.emit('changes', changes);
        }
    }, 1000);
}

function getLook(map, player) {
    var sight = [];
    try {
        sight = [[map[player.y][player.x]]];
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
            if (map[yMin]) {
                sight.splice(0, 0, []);
            }
            if (map[yMax]) {
                sight.push([]);
            }

            // Check the top and bottom rows of the new sight range
            for (var x = xMin; x <= xMax; x++) {
                if (map[yMin]) {
                    var yMinTile = map[yMin][x];
                    sight[0].push(yMinTile);
                    if (yMinTile.render == ' ') {
                        iSawSomething = true;
                    }
                }
                if (map[yMax]) {
                    var yMaxTile = map[yMax][x];
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
                if (map[y]) {
                    var xMinTile = map[y][xMin];
                    if (xMinTile) {
                        sight[y - yMin].splice(0, 0, xMinTile);
                        if (xMinTile.render == ' ') {
                            iSawSomething = true;
                        }
                    }
                    var xMaxTile = map[y][xMax];
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
    var y = Math.floor(Math.random() * map.length);
    var x = Math.floor(Math.random() * map[0].length);
    var render = (Math.random() > 0.9) ? 'X' : ' ';
    map[y][x].render = render;

    return map[y][x];
}

function getChanges() {
    var changes = [];
    //var qty = Math.floor(Math.random() * 10);
    //for (var i = 0; i < qty; i++) {
    //    changes.push(generateTile());
    //}

    return changes;
};
