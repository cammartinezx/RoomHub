import 'package:flutter_frontend/screens/joinRoom/join_room.dart';

final url = 'https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/';

final user = url + "user";
final room = url + "room";

//get
//final getNotification = user/:id/get-notification
////final getusersroom GET	user/:id/get-room

//post
final JoinRoom = url +"notification/join-room-request";
final signup = user + "/add-user";
final addRoommate = room + "/add-roommate";
final createRoom = room + "/create-room";
