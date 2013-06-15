import 'dart:html';
import 'dart:math';

final CanvasRenderingContext2D context = (query("#canvas") as CanvasElement).context2D;

const String ORANGE = "orange";
const int SEED_RADIUS = 2;
const num TAU = PI * 2;

const int TILE_SIZE = 15;

void main() {
  var xMax = 900 / TILE_SIZE;
  var yMax = 600 / TILE_SIZE;
  var r = new Random(1);
  for (int x = 0; x < xMax; x++) {
    for (int y = 0; y < yMax; y++) {
      Tile  tile = new Tile();
      tile.filled = x == 0 ||  y == 0 || x == (xMax-1) || y == (yMax-1) || (r.nextBool() && r.nextBool());
      tile.x = x;
      tile.y = y;
      renderTile(tile);
    }
  }
  query("#canvas")
    ..onClick.listen(drawDot);
}

void drawDot(MouseEvent event) {

  context..beginPath()
  ..lineWidth = 2
  ..fillStyle = ORANGE
  ..strokeStyle = ORANGE
  ..arc(event.layerX , event.layerY, SEED_RADIUS, 0, TAU, false)
  ..fill()
  ..closePath()
  ..stroke();
}

renderMap(Map map){
  
}

renderTile(Tile tile) {
  if ( tile.filled){
  context.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}}

class Map {
  List<Tile> tiles;
  int width;
  int height;

  getTile(int x, int y){
    return tiles[x + y * width];
  }
  
  setTile(int x,int y, Tile tile){
    tiles[x + y * width] = tile;
  }
  
  render(){
    for (int i = 0; x < tiles.length; i++) {
      tiles[i].render();
    }
  }
}

class Tile {
  bool filled;
  int x;
  int y;
  
  render(){
    if ( filled){
      context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}