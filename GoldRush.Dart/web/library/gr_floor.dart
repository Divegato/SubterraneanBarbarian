part of goldrush;

class gr_Floor {
  List<gr_Tile> tiles = new List<gr_Tile>();
  int width;
  int height;

  getTile(int x, int y){
    return tiles[x + y * width];
  }

  setTile(int x,int y, gr_Tile tile){
    var index = x + y * width;
    while (tiles.length <= index) {
      tiles.add(new gr_Tile());
    }
    tiles[index] = tile;
  }

  // This will become server-side code
  generate() {
    width = (900 / TILE_SIZE).floor();
    height = (600 / TILE_SIZE).floor();
    var r = new Random(1);
    for (int x = 0; x < width; x++) {
      for (int y = 0; y < height; y++) {
        gr_Tile  tile = new gr_Tile();
        tile.wall = x == 0 ||  y == 0 || x == (width-1) || y == (height-1) || (r.nextBool() && r.nextBool());
        tile.x = x;
        tile.y = y;
        setTile(x, y, tile);
      }
    }
  }
}