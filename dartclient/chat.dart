library chat;

class Chat {
  List messages = [];

  void newUser(Map message) =>
  addMessage("${message["name"]} just joined the chat!");

  void newMessage(Map message) =>
  addMessage("${message["name"]}: ${message["text"]}");

  addMessage(message) =>
      messages.add({"timestamp": new DateTime.now(), "text": message});
}