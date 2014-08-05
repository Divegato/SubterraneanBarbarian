library socket;

import 'dart:html';
import 'dart:convert';
import 'dart:async';

/**
* A wrapper around WebSocket to provide a socketio like API.
*/
class Socket {
  WebSocket webSocket;

  Socket(String url){
    webSocket = new WebSocket(url);
  }

  Stream<Map> get onMessage =>
      webSocket.onMessage.map((m) => m.data).map(JSON.decode);

  void sendMessage(Map message) => webSocket.sendString(JSON.encode(message));
}