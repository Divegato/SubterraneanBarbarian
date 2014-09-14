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

    });
});
