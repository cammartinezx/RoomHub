
import "package:flutter/material.dart";
import "package:flutter_frontend/screens/createAnnouncement/create_announcement_page.dart";
import 'package:flutter_frontend/screens/home/home_new_user.dart';
import 'package:flutter_frontend/utils/custom_exceptions.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_frontend/utils/response_handler.dart';
import 'package:flutter_frontend/config.dart';
import 'package:flutter_frontend/utils/our_theme.dart';


class Navbar extends StatelessWidget {
  final String roomId;
  final String email;
  const Navbar({super.key, required this.roomId, required this.email});

  void _showDialog(context, leaveRoomWarning){
    showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: const Align(
              alignment: Alignment.center,
              child: Text("Leave Room" ,
                    style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 24,
              ),
                        ),
            ),
            content: Text(leaveRoomWarning),            // this should be gen from api call
            actions: [
              TextButton(
                onPressed: () {print("Go ahead with the leave");leaveRoom(context);},//tell the backend to do stuff.
                child: Text("Leave")),
              TextButton(
                onPressed: () {
                  // dismiss the alert dialog
                  Navigator.pop(context);
                  },
                child: Text("Cancel")),
            ],

          );
        });
  }
  @override
  Widget build(BuildContext context) {
    String imagePath = "assets/logo.png";
    int  numRoomMates = 0;
    return Drawer(
      child: ListView(
        children:[
          Container(
          // room hub logo
            width: double.infinity, // Take up full width of the drawer
            height: MediaQuery.of(context).size.height * 0.25,  // 30% of the screen height
            margin: EdgeInsets.only(top: 30.0,),
             child: Image.asset(
              imagePath,  // Load the local image
              fit: BoxFit.contain,  // Make the image cover the full container
            ),
          ),
          ListTile(
            // room name
            title: Align(
                alignment: Alignment.center,
                child: Text(this.roomId,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 30,
                        ),
            )
          ),
        ),
          ListTile(
            leading: const Icon(Icons.announcement),
            title: const Text("Send Announcement"),
            enabled: numRoomMates > 0,
            onTap: () { Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => CreateAnnouncement(email: email),
              ),
            );
          },
          ),
          ListTile(
            // leave room action
            leading: const Icon(Icons.exit_to_app),
            title: const Text("Leave Room"),
            onTap: () async {String warningMsg = await getWarningMsg();
              if(warningMsg == "ERROR")
              {
                OurTheme().buildToastMessage("Request not available please try again later");
              }else{
                _showDialog(context, warningMsg);
              }
            }
          )
        ],
      ),
    );
  }

  Future<String> getWarningMsg() async {
    String warning_msg;
    try {
      debugPrint(email);
      var response = await http.get(
        Uri.parse("$user/$email$leaveRoomWarning"),
        headers: {"Content-Type": "application/json"},
      );

      warning_msg =
      await getResponse(response, responseType: 'getLeaveRoomWarning');
    } on UserException catch (e) {
      debugPrint(e.message);
      warning_msg = "ERROR";
    }

    debugPrint(warning_msg);
    return warning_msg;
  }

  void leaveRoom(BuildContext context) async {
    try {
      debugPrint(email);
      var response = await http.get(
        Uri.parse("$user/$email$leaveRoomPth"),
        headers: {"Content-Type": "application/json"},
      );
      await getResponse(response, responseType: 'leaveRoom');
    //   go back to the home page for new users.
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context) => const OurHomeNewUser(),
        ),
      );
    } on UserException catch (e) {
      debugPrint(e.message);
      OurTheme().buildToastMessage(e.message);
    }
  }
}
