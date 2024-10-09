
const url = 'https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/';

const user = "${url}user";
const room = "${url}room";

//get
//final getNotification = user/:id/get-notification
////final getusersroom GET	user/:id/get-room

//post
const JoinRoom = "${url}notification/join-room-request";
const signup = "$user/add-user";
const addRoommate = "$room/add-roommate";
const createRoom = "$room/create-room";
