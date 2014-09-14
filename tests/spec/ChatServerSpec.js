describe("Chat Server", function () {
    var io;
    var chatFunction;

    beforeEach(function () {
        io = { on: function () { } };
        chatFunction = new chat(io);
    });

    describe("chat", function () {

        it("registers connection event", function () {
            io = { on: jasmine.createSpy('io.on') };

            chat(io);

            expect(io.on).toHaveBeenCalledWith('connection', jasmine.any(Function));
        });

    });

    describe("onConnection", function () {
        var socket;

        beforeEach(function () {
            socket = { on: jasmine.createSpy('socket.on') };
            chatFunction.registerGuest = jasmine.createSpy('registerGuest');
        });

        it("registers a new guest", function () {
            chatFunction.onConnection(io, socket);

            expect(chatFunction.registerGuest).toHaveBeenCalled();
        });

        it("registers disconnect event", function () {
            chatFunction.onConnection(io, socket);

            expect(socket.on).toHaveBeenCalledWith('disconnect', jasmine.any(Function));
        });

        it("registers chat message event", function () {
            chatFunction.onConnection(io, socket);

            expect(socket.on).toHaveBeenCalledWith('chat message', jasmine.any(Function));
        });

    });

    describe("registerGuest", function () {
        var socket;

        beforeEach(function () {
            socket = { conn: {} };
            io = { emit: jasmine.createSpy('io.emit') };

            chatFunction.userCount = 0;
            chatFunction.users = {};
        });

        it("increments guest count", function () {
            var initialUserCount = chatFunction.userCount;
            chatFunction.registerGuest(io, socket);
            var secondaryUserCount = chatFunction.userCount;
            chatFunction.registerGuest(io, socket);
            var finalUserCount = chatFunction.userCount;

            expect(initialUserCount).toBe(0);
            expect(secondaryUserCount).toBe(1);
            expect(finalUserCount).toBe(2);
        });

        it("stores generated guest name", function () {
            socket.conn.id = 'test';

            chatFunction.registerGuest(io, socket);

            expect(chatFunction.users['test'].name).toBe('Guest 1');
        });

        it("sends new user message", function () {
            chatFunction.registerGuest(io, socket);

            expect(io.emit).toHaveBeenCalledWith('newUser', jasmine.any(String));
        });

    });

    describe("onDisconnect", function () {
        var socket;

        beforeEach(function () {
            io = { emit: jasmine.createSpy('io.emit') };
            socket = { conn: {} };
        });

        it("sends user disconnect message", function () {
            chatFunction.onDisconnect(io, socket);

            expect(io.emit).toHaveBeenCalledWith('userDisconnect', jasmine.any(String));
        });
    });

    describe("onChatMessage", function () {
        var socket;

        beforeEach(function () {
            io = { emit: jasmine.createSpy('io.emit') };
            socket = { conn: {} };
        });

        it("sends chat message", function () {
            chatFunction.onChatMessage(io, socket);

            expect(io.emit).toHaveBeenCalledWith('chat message', jasmine.any(String));
        });
    });

    describe("getUserName", function () {
        var socket;

        beforeEach(function () {
            socket = { conn: {} };
        });

        it("returns stored username", function () {
            socket.conn.id = 'Test Id';
            chatFunction.users['Test Id'] = { name: 'Test User' };

            var result = chatFunction.getUserName(socket);

            expect(result).toBe('Test User');
        });

        describe("returns 'Unknown User'", function () {

            it("when null socket", function () {
                socket = undefined;

                var result = chatFunction.getUserName(socket);

                expect(result).toBe('Unknown User');
            });

            it("when null socket connection", function () {
                socket = {};

                var result = chatFunction.getUserName(socket);

                expect(result).toBe('Unknown User');
            });

            it("when null socket connection id", function () {
                socket = { conn: {} };

                var result = chatFunction.getUserName(socket);

                expect(result).toBe('Unknown User');
            });

            it("when null user for socket connection id", function () {
                socket = { conn: { id: 'Test Id' } };

                var result = chatFunction.getUserName(socket);

                expect(result).toBe('Unknown User');
            });

            it("when null user name for socket connection id", function () {
                socket = { conn: { id: 'Test Id' } };
                chatFunction.users['Test Id'] = {};

                var result = chatFunction.getUserName(socket);

                expect(result).toBe('Unknown User');
            });

        });

    });
});
