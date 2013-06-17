import 'dart:html';
import 'dart:math';
import 'library/gr_library.dart';

gr_Render render = new gr_Render();

void main() {
  gr_Floor floor = new gr_Floor();
  floor.generate();
  render.renderFloor(floor);

  query("#canvas")
    ..onClick.listen(mouseClick);
}

void mouseClick(MouseEvent event) {
  render.renderDot(event.clientX, event.clientY);
}
