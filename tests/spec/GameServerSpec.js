describe("Game Server", function () {
    var io;
    var gameFunction;

    beforeEach(function () {
        io = { on: function () { } };
        gameFunction = new game(io);
    });

    describe("game", function () {

        it("registers connection event", function () {
            io = { on: jasmine.createSpy('io.on') };

            game(io);

            expect(io.on).toHaveBeenCalledWith('connection', jasmine.any(Function));
        });

        describe("onConnection", function () {
            var socket;

            beforeEach(function () {
                socket = { on: jasmine.createSpy('socket.on') };
                gameFunction.registerPlayer = jasmine.createSpy('registerPlayer');
            });

            it("registers a new player", function () {
                gameFunction.onConnection(io, socket);

                expect(gameFunction.registerPlayer).toHaveBeenCalled();
            });

            it("registers disconnect event", function () {
                gameFunction.onConnection(io, socket);

                expect(socket.on).toHaveBeenCalledWith('disconnect', jasmine.any(Function));
            });

            it("registers look event", function () {
                gameFunction.onConnection(io, socket);

                expect(socket.on).toHaveBeenCalledWith('look', jasmine.any(Function));
            });

            it("registers move event", function () {
                gameFunction.onConnection(io, socket);

                expect(socket.on).toHaveBeenCalledWith('move', jasmine.any(Function));
            });

        });

    });
});
