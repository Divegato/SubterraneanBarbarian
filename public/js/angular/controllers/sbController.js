app.controller('sbController', ['$scope', 'socket', function ($scope, socket) {
    var self = this;
    var messageId = 0;
    $scope.messages = [];
    $scope.map = [];

    $scope.look = function () {
        socket.emit('look');
    };
    $scope.sendMessage = function () {
        socket.emit('chat message', $scope.chatInput);
        $scope.chatInput = '';
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
        $scope.map = msg;
    });
    socket.on('changes', function (msg) {
        for (var i in msg) {
            var change = msg[i];
            self.ensureTileExists(change.x, change.y);
            if ($scope.map[change.y][change.x].render != change.render) {
                $scope.map[change.y][change.x].render = change.render;
            }
        }
    });

    $scope.addMessage = function (message) {
        messageId++;
        message.id = messageId;
        $scope.messages.push(message);
    };

    self.ensureTileExists = function (x, y) {
        while (!$scope.map[y]) {
            $scope.map.push([]);
        }
        while (!$scope.map[y][x]) {
            $scope.map[y].push({ x: $scope.map[y].length, y: y, render: '' });
        }
    };

}]);