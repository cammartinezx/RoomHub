
import "package:flutter/material.dart";

class Navbar extends StatelessWidget {
  final String roomId;
  const Navbar({super.key, required this.roomId});

  void _showDialog(context){
    showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: const Text("Leave Room" ,
                  style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 24,
            ),
          ),
            content: Text("Are you sure you want to leave room"),            // this should be gen from api call
            actions: [
              TextButton(
                onPressed: () {print("Go ahead with the leave");},//tell the backend to do stuff.
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
    return Drawer(
      child: ListView(
        children:[
          Container(
          // room hub logo
            width: double.infinity, // Take up full width of the drawer
            height: MediaQuery.of(context).size.height * 0.3,  // 30% of the screen height
            child: Image.asset(
              imagePath,  // Load the local image
              fit: BoxFit.cover,  // Make the image cover the full container
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
            title: const Text("Create Announcement"),
            onTap: () => print("Create New announcement tapped."),
          ),
          ListTile(
            // leave room action
            leading: const Icon(Icons.exit_to_app),
            title: const Text("Leave Room"),
            onTap: () => _showDialog(context)
          )
        ],
      ),
    );
  }
}
