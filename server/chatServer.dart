library dartchat;

import 'webSockets.dart';

class ChatBackend {
  final WebSockets sockets;
  final Map users = {};

  ChatBackend(this.sockets){
    sockets.onNewConnection.listen(onNewConnection);
  }

  void onNewConnection(conn){
    registerGuest(conn);
    setUpListener(conn);
  }

  registerGuest(conn){
    var name = "Guest ${users.length + 1}";
    users[conn] = {"name": name};
    sockets.broadcast(conn, {"type" : "newUser", "name" : name});
  }

  setUpListener(conn){
    sockets.onMessage(conn).listen((m){
      if(m["type"] == "message"){
        sockets.broadcast(conn, {
            "type" : "newMessage",
            "name" : users[conn]["name"],
            "text" : m["text"]
        });
      }
    });
  }
}