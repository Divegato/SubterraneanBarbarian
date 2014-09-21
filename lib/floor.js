var exports = exports || {};

var floor = function () {
    var self = this;
    self.map = generate();

    function generate() {
        var width = Math.ceil(Math.random() * 15 + 15);
        var height = Math.ceil(Math.random() * 15 + 15);
        var floor = [];

        for (var y = 0; y <= height; y++) {
            floor.push([]);
            for (var x = 0; x <= width; x++) {
                var tile = {}
                tile.x = x + (y % 2 == 0 ? 0.5 : 0);
                tile.y = y;

                var border = (y == 0 || x == 0 || y == height || x == width);

                tile.render = (border || (Math.random() > 0.9)) ? 'X' : ' ';
                floor[y].push(tile);
            }
        }

        return floor;
    };

    // Add a new player to the map and return it's tile.
    self.addPlayer = function () {
        var x, y, canMove;

        do {
            y = Math.floor(Math.random() * self.map.length);
            x = Math.floor(Math.random() * self.map[0].length);

            canMove = self.canMove(x, y);
        }
        while (!canMove);

        self.map[y][x].player = true;

        return getTile(x, y);
    }

    // Remove a player from the map and return it's tile.
    self.removePlayer = function (player) {
        if (!player) {
            throw new Error("Cannot remove undefined player.");
        }

        var x = Math.floor(player.x);
        var y = player.y;

        self.map[y][x].player = false;

        return getTile(x, y);
    }

    self.movePlayer = function (player, direction) {
        var changes = [];

        var currentTile = getTile(player.x, player.y)
        var targetTile = getAdjacentTile(currentTile, direction);

        if (self.canMove(targetTile.x, targetTile.y)) {
            currentTile.player = false;
            targetTile.player = true;

            changes = [
                currentTile,
                targetTile
            ];

            self.map[player.y][Math.floor(player.x)].player = false;
            player.x = targetTile.x;
            player.y = targetTile.y;
            self.map[player.y][Math.floor(player.x)].player = true;

            return changes;
        }
    }

    self.canMove = function (x, y) {
        var canMove = false;

        var target = getTile(x, y);
        if (target && target.render == 0) {
            canMove = true;
        }

        return canMove;
    }

    self.getVision = function (player) {
        var sight = [];
        try {
            var currentSet = [getTile(player.x, player.y)];

            for (var r = 0; r < 5; r++) {
                var nextSet = [];

                for (var i in currentSet) {
                    var currentTile = currentSet[i];
                    sight.push(currentTile);

                    if (currentTile.render != 'X') {
                        var tiles = getNextTiles(currentTile, player.x, player.y);

                        for (var j in tiles) {
                            var tile = tiles[j];
                            if (tile) {
                                nextSet.push(tile);
                            }
                        }
                    }
                }

                currentSet = nextSet;
            }

            return sight;
        }
        catch (exception) {
            console.error(exception.stack);
        }

        //return sight;
    }

    function generateTile() {
        var y = Math.floor(Math.random() * self.map.length);
        var x = Math.floor(Math.random() * self.map[0].length);
        var render = (Math.random() > 0.9) ? 'X' : ' ';
        self.map[y][x].render = render;

        return self.map[y][x];
    }

    function getAdjacentTile(tile, direction) {
        var x = tile.x;
        var y = tile.y;

        switch (direction) {
            case 'nw':
                y -= 1;
                x -= 0.5;
                break;
            case 'ne':
                x += 0.5;
                y -= 1;
                break;
            case 'sw':
                y += 1;
                x -= 0.5;
                break;
            case 'se':
                y += 1;
                x += 0.5;
                break;
            case 'e':
                x += 1;
                break;
            case 'w':
                x -= 1;
                break;
            default:
        }

        return getTile(x, y);
    }

    function getTile(x, y) {
        var result = null;

        if (self.map[y] && self.map[y][Math.floor(x)]) {
            result = self.map[y][Math.floor(x)];
        }

        return result;
    }

    // over simplified function to get tiles in a line.  doesn't support direct n/s
    function getNextTile(tile, x, y) {
        var direction = '';

        if (tile.y < y) {
            direction = 'n';
        } else if (tile.y > y) {
            direction = 's';
        }

        var xOffset = tile.x + (tile.y % 2 == 0 ? -0.5 : 0.5);
        if (xOffset > x) {
            direction += 'e';
        } else if (xOffset < x) {
            direction += 'w';
        }

        return getAdjacentTile(tile, direction);
    }

    // This is very manual, optimized for sight range 2
    // todo: optimize for any sight range
    function getNextTiles(tile, x, y) {
        var direction = '';

        if (tile.y < y) {
            direction = 'n';
        } else if (tile.y > y) {
            direction = 's';
        }

        if (tile.x > x) {
            direction += 'e';
        } else if (tile.x < x) {
            direction += 'w';
        }

        var results = [];
        switch (direction) {
            case '':
                results.push(getAdjacentTile(tile, 'nw'));
                results.push(getAdjacentTile(tile, 'ne'));
                results.push(getAdjacentTile(tile, 'w'));
                results.push(getAdjacentTile(tile, 'sw'));
                results.push(getAdjacentTile(tile, 'se'));
                results.push(getAdjacentTile(tile, 'e'));
                break;
            case 'nw':
                results.push(getAdjacentTile(tile, 'nw'));
                results.push(getAdjacentTile(tile, 'ne'));
                results.push(getAdjacentTile(tile, 'w'));
                break;
            case 'n':
                results.push(getAdjacentTile(tile, 'nw'));
                results.push(getAdjacentTile(tile, 'ne'));
                break;
            case 'ne':
                results.push(getAdjacentTile(tile, 'nw'));
                results.push(getAdjacentTile(tile, 'ne'));
                results.push(getAdjacentTile(tile, 'e'));
                break;
            case 'w':
                results.push(getAdjacentTile(tile, 'nw'));
                results.push(getAdjacentTile(tile, 'sw'));
                results.push(getAdjacentTile(tile, 'w'));
                break;
            case 'e':
                results.push(getAdjacentTile(tile, 'ne'));
                results.push(getAdjacentTile(tile, 'se'));
                results.push(getAdjacentTile(tile, 'e'));
                break;
            case 'sw':
                results.push(getAdjacentTile(tile, 'sw'));
                results.push(getAdjacentTile(tile, 'se'));
                results.push(getAdjacentTile(tile, 'w'));
                break;
            case 's':
                results.push(getAdjacentTile(tile, 'sw'));
                results.push(getAdjacentTile(tile, 'se'));
                break;
            case 'se':
                results.push(getAdjacentTile(tile, 'sw'));
                results.push(getAdjacentTile(tile, 'se'));
                results.push(getAdjacentTile(tile, 'e'));
                break;
            default:
        }

        return results;
    }
}

exports.generate = floor;
