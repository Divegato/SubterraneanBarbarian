var userCount = 0;
var users = {};

exports.on = function (io) {
    io.on('connection', function (socket) {
        registerGuest(socket.conn, io);
        socket.on('disconnect', function () {
            var name = users[socket.conn.id].name;
            io.emit('userDisconnect', name);
        });
        socket.on('chat message', function (msg) {
            var name = users[socket.conn.id].name;
            io.emit('chat message', users[socket.conn.id].name + ': ' + msg);
        });
    });
};

function registerGuest(conn, io) {
    userCount++;
    var name = "Guest " + userCount;
    users[conn.id] = { "name": name };
    io.emit('newUser', name);
}