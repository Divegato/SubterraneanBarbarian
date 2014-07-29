import 'dart:html';
import './library/gr_library.dart';

gr_Render render = new gr_Render();

void main() {
  var webSocket = new WebSocket('ws://localhost:1337');

  webSocket.onMessage.listen((MessageEvent e) {
    print(e.data);
  });

  gr_Floor floor = new gr_Floor();
  floor.generate();
  render.renderFloor(floor);

  querySelector("#canvas")
    ..onClick.listen(mouseClick);
}

void mouseClick(MouseEvent event) {
  render.renderDot(event.client.x, event.client.y);
}
