part of goldrush;

final CanvasRenderingContext2D context = (query("#canvas") as CanvasElement).context2D;

const String ORANGE = "orange";
const int SEED_RADIUS = 2;
const num TAU = PI * 2;

const int TILE_SIZE = 15;

class gr_Render {
  renderFloor(gr_Floor floor){
    for (int i = 0; i < floor.tiles.length; i++) {
      renderTile(floor.tiles[i]);
    }
  }

  renderTile(gr_Tile tile) {
    if ( tile.wall){
      context.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  renderDot(int x, int y) {
    context..beginPath()
    ..lineWidth = 2
    ..fillStyle = ORANGE
    ..strokeStyle = ORANGE
    ..arc(x, y, SEED_RADIUS, 0, TAU, false)
    ..fill()
    ..closePath()
    ..stroke();
  }
}