var exports = exports || {};

function chat(io) {
    var self = this;

    self.userCount = 0;
    self.users = {};

    // Register connection event
    io.on('connection', function (socket) {
        self.onConnection(io, socket);
    });

    self.onConnection = function (io, socket) {
        // Register new guest
        self.registerGuest(io, socket);

        // Register disconnect event
        socket.on('disconnect', function () {
            self.onDisconnect(io, socket);
        });

        // Register chat message event
        socket.on('chat message', function (msg) {
            self.onChatMessage(io, socket, msg);
        });
    }

    self.registerGuest = function (io, socket) {
        // Increment guest count
        self.userCount++;

        // Generate guest name
        var name = "Guest " + self.userCount;

        // Store guest name
        self.users[socket.conn.id] = { "name": name };

        // Send new user message
        io.emit('newUser', name);
    }

    self.onDisconnect = function (io, socket) {
        var name = self.getUserName(socket);

        // Send user disconnect message
        io.emit('userDisconnect', name);
    }

    self.onChatMessage = function (io, socket, msg) {
        var name = self.getUserName(socket);

        // Send chat message
        io.emit('chat message', name + ': ' + msg);
    }

    self.getUserName = function (socket) {
        var username = 'Unknown User';

        if (socket && socket.conn && socket.conn.id && self.users[socket.conn.id] && self.users[socket.conn.id].name) {
            username = self.users[socket.conn.id].name;
        }

        return username;
    }
};

exports.chat = chat;
