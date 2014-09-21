app.controller('sbController', ['$scope', '$interval', 'socket', function ($scope, $interval, socket) {
    var self = this;
    var messageId = 0;
    $scope.messages = [];
    $scope.map = [];

    $scope.look = function () {
        socket.emit('look');
    };
    $scope.lookFull = function () {
        socket.emit('lookfull');
    };
    $scope.sendMessage = function () {
        socket.emit('chat message', $scope.chatInput);
        $scope.chatInput = '';
    };
    $scope.move = function (direction) {
        socket.emit('move', direction);
    };
    var randomPromise;
    $scope.stopRandom = function () {
        $interval.cancel(randomPromise);
    };
    $scope.moveRandom = function () {
        $scope.stopRandom();
        randomPromise = $interval(function () {
            var directionInt = Math.ceil(Math.random() * 6);
            var direction;

            switch (directionInt) {
                case 1:
                    direction = 'nw';
                    break;
                case 2:
                    direction = 'ne';
                    break;
                case 3:
                    direction = 'sw';
                    break;
                case 4:
                    direction = 'se';
                    break;
                case 5:
                    direction = 'e';
                    break;
                case 6:
                    direction = 'w';
                    break;
                default:
                    break;
            }

            if (direction) {
                socket.emit('move', direction);
            }
        }, 200);
    };
    socket.on('chat message', function (msg) {
        $scope.addMessage({ text: msg });
    });
    socket.on('newUser', function (msg) {
        $scope.addMessage({ text: msg + ' has joined the room' });
    });
    socket.on('userDisconnect', function (msg) {
        $scope.addMessage({ text: msg + ' has left the room' });
    });
    socket.on('look', function (msg) {
        $scope.processChanges(msg);
        //$scope.map = msg;
    });
    socket.on('changes', function (msg) {
        $scope.processChanges(msg);
        $scope.look();
    });

    $scope.processChanges = function (msg) {
        for (var i in msg) {
            var change = msg[i];
            self.ensureTileExists(change);
            if ($scope.map[change.y][Math.floor(change.x)] != change) {
                $scope.map[change.y][Math.floor(change.x)] = change;
            }
        }
    }

    $scope.addMessage = function (message) {
        messageId++;
        message.id = messageId;
        $scope.messages.push(message);
    };

    self.ensureTileExists = function (tile) {
        while (!$scope.map[tile.y]) {
            $scope.map.push([]);
        }
        while (!$scope.map[tile.y][Math.floor(tile.x)]) {
            $scope.map[tile.y].push({ x: $scope.map[tile.y].length + (tile.y % 2 == 0 ? 0.5 : 0), y: tile.y, render: 'U' });
        }
    };

}]);