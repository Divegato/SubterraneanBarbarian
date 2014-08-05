import 'dart:io';
import 'dart:async';
import 'dart:convert';

/**
* A wrapper around WebSocket to provide a socketio like API.
*/
class WebSockets {
  final List<WebSocket> sockets = [];
  StreamController controller;
  Stream<WebSocket> onNewConnection;

  WebSockets(){
    controller = new StreamController();
    onNewConnection = controller.stream
        .transform(new WebSocketTransformer())
        .map((conn){sockets.add(conn); return conn;});
  }

  Stream<Map> onMessage(WebSocket conn) => conn.map(JSON.decode);

  void broadcast(WebSocket conn, Map message){
    final m = JSON.encode(message);
    sockets.where((s) => s != conn).forEach((s) => s.add(m));
  }

  void handleRequest(HttpRequest request) => controller.add(request);
}