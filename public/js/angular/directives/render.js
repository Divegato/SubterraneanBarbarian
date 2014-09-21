app.directive("sbRender", ['$window', function ($window) {
    return {
        restrict: "A",
        scope: {
            map: '=sbMap',
            player: '=sbPlayer',
            tileSize: '=sbTileSize'
        },
        controller: function ($scope, $element) {
            var canvas = $element[0].getContext('2d');

            $scope.$watch('map', function (newValue, oldValue) {
                render();
            }, true);

            $scope.$watch('tileSize', function (newValue, oldValue) {
                render();
            });

            function render() {
                canvas.rect(0, 0, $element[0].width, $element[0].height)
                canvas.fillStyle = "#CCC";
                canvas.fill();
                for (var y in $scope.map) {
                    var row = $scope.map[y];
                    for (var x in row) {
                        var tile = row[x];
                        if (tile.render != 'U') {
                            renderTile(tile);
                        }
                    }
                }
            };

            function renderTile(tile) {
                var x = tile.x;
                var y = tile.y;

                var tileRadius = ($scope.tileSize / 2);

                // Calculate the actual hexagon width based on the tile size
                var tileWidth = $scope.tileSize * Math.cos(Math.PI / 6);

                // Effective height is smaller than tile size because hexagon rows overlap
                var tileEffectiveHeight = tileRadius + (tileRadius * Math.sin(Math.PI / 6))

                // Calculate the center of the desired location to draw the hexagon
                var renderX = (x * tileWidth) + (tileWidth / 2);
                var renderY = (y * tileEffectiveHeight) + tileRadius;

                // Calculate the center of the screen
                var centerX = $element[0].width / 2;
                var centerY = $element[0].height / 2;

                // Calculate the center of the player
                var playerX = ($scope.player.x * tileWidth) + (tileWidth / 2);
                var playerY = ($scope.player.y * tileEffectiveHeight) + tileRadius;

                // Alternating tiles are indented
                //renderX += y % 2 == 0 ? 0 : (tileWidth / 2);

                renderX += centerX - playerX;
                renderY += centerY - playerY;

                canvas.beginPath();
                hexagon(renderX, renderY, tileRadius);

                canvas.fillStyle = tile.player ? "rgb(51,128,255)" : (tile.render == "X" ? "#666" : "rgb(255,255,255)");
                canvas.strokeStyle = "#666";
                canvas.fill();
                //canvas.stroke();
            };

            // Shortcut for hexagons!
            function hexagon(x, y, radius) {
                polygon(canvas, x, y, radius, 6, -Math.PI / 2, false);
            }

            // Cool function I found online
            // http://www.storminthecastle.com/2013/07/24/how-you-can-draw-regular-polygons-with-the-html5-canvas-api/
            function polygon(ctx, x, y, radius, sides, startAngle, anticlockwise) {
                if (sides < 3) return;
                var a = (Math.PI * 2) / sides;
                a = anticlockwise ? -a : a;
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(startAngle);
                ctx.moveTo(radius, 0);
                for (var i = 1; i < sides; i++) {
                    ctx.lineTo(radius * Math.cos(a * i), radius * Math.sin(a * i));
                }
                ctx.closePath();
                ctx.restore();
            }
        },
        link: function (scope, element) {
            var ctx = element[0].getContext('2d');

            // variable that decides if something should be drawn on mousemove
            var drawing = false;

            // the last coordinates before the current move
            var lastX;
            var lastY;

            element.bind('mousedown', function (event) {
                if (event.offsetX !== undefined) {
                    lastX = event.offsetX;
                    lastY = event.offsetY;
                } else { // Firefox compatibility
                    lastX = event.layerX - event.currentTarget.offsetLeft;
                    lastY = event.layerY - event.currentTarget.offsetTop;
                }

                // begins new line
                ctx.beginPath();

                //drawing = true;
            });
            element.bind('mousemove', function (event) {
                if (drawing) {
                    // get current mouse position
                    if (event.offsetX !== undefined) {
                        currentX = event.offsetX;
                        currentY = event.offsetY;
                    } else {
                        currentX = event.layerX - event.currentTarget.offsetLeft;
                        currentY = event.layerY - event.currentTarget.offsetTop;
                    }

                    draw(lastX, lastY, currentX, currentY);

                    // set current coordinates to last one
                    lastX = currentX;
                    lastY = currentY;
                }

            });
            element.bind('mouseup', function (event) {
                // stop drawing
                drawing = false;
            });

            function draw(lX, lY, cX, cY) {
                // line from
                ctx.moveTo(lX, lY);
                // to
                ctx.lineTo(cX, cY);
                // color
                ctx.strokeStyle = "#4bf";
                // draw it
                ctx.stroke();
            }

            function reset() {
                // canvas reset
                element[0].width = $window.innerWidth;
                element[0].height = $window.innerHeight - 20;
            }

            $window.addEventListener('resize', reset, false);
            reset();
        }
    };
}]);