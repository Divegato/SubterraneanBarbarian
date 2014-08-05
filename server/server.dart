library dartchat;

import 'dart:io';
import 'package:http_server/http_server.dart' show VirtualDirectory;
import 'webSockets.dart';
import 'chatServer.dart';

final HOST = "127.0.0.1";
final PORT = 3001;

main() {
  HttpServer.bind(HOST, PORT).then((server){
    final sockets = new WebSockets();
    final chatBackend = new ChatBackend(sockets);
    var root = Platform.script.resolve('./web').toFilePath();
    final vDir = new VirtualDirectory(root)
        ..followLinks = true
        ..allowDirectoryListing = true
        ..jailRoot = false;

    server.listen((request) {
      if(request.uri.path == '/ws') {
        sockets.handleRequest(request);
      } else {
        vDir.serveRequest(request);
      }
    });
  });
}