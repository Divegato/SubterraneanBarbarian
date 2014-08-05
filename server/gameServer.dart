library sb_game;

import 'webSockets.dart';

class GameServer {
  final WebSockets sockets;
  final Map users = {};

  GameServer(this.sockets){
    sockets.onNewConnection.listen(onNewConnection);
  }

  void onNewConnection(conn){
    registerGuest(conn);
    setUpListener(conn);
  }

  registerGuest(conn){
    var name = "Guest ${users.length + 1}";
    users[conn] = {"name": name};
  }

  setUpListener(conn){
    sockets.onMessage(conn).listen((m){
      if(m["type"] == "look"){
        sockets.broadcast(conn, {
            "type" : "look",
            "name" : users[conn]["name"],
            "map" : { 'test': 'test'}
        });
      }
    });
  }
}