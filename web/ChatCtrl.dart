import 'package:angular/angular.dart';
import 'chat.dart';
import 'socket.dart';

main(){
  final module = new Module()
      ..type(ChatController)
      ..value(Socket, new Socket("ws://127.0.0.1:3001/ws"));

  ngBootstrap(module: module);
}

@NgController(selector: '[chat-ctrl]', publishAs: 'ctrl')
class ChatController {
  @NgTwoWay("message") String message;

  Chat chat = new Chat();
  Socket socket;

  ChatController(this.socket){
    socket.onMessage.listen(handleMessage);
  }

  void handleMessage(Map message){
    final handlers = {"newUser": chat.newUser, "newMessage": chat.newMessage};
    handlers[message["type"]](message);
  }

  void sendMessage(){
    chat.newMessage({"name": "You", "text": message});
    socket.sendMessage({"type": "message", "text": message});
    message = "";
  }
}