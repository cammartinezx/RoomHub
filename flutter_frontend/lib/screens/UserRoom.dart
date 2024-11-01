import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/NavBar.dart';
import 'package:flutter_frontend/screens/header.dart';
import 'package:flutter_frontend/utils/our_theme.dart';

import 'AllTask.dart';

class UserRoom extends StatelessWidget {
  final String roomID;
  final String email;
  final List<String> homeCards = ["Tasks"];
  UserRoom({super.key, required this.roomID, required this.email});

  @override
  Widget build(BuildContext context) {
    final theme = OurTheme();
    // update the boiz with the valid roomID
    return Scaffold(
      backgroundColor: theme.lightgrey,
      drawer: Navbar(roomId: roomID, email: email),
      body: SingleChildScrollView(
          child: Column(
            children: <Widget> [
              Header(roomId: roomID),
              const SizedBox(height: 100,),
              SizedBox(
                width: 300,
                height: 150,
                child: GestureDetector(
                  onTap: () { Navigator.of(context).pushReplacement(
                    MaterialPageRoute(
                      builder: (context) => AllTasks(email: email, roomId: roomID,),
                    ),
                  );},
                  child: Card(
                    color: theme.darkblue,
                    child: const Padding(
                      padding: EdgeInsets.all(5.0),
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center, // Aligns text to the center
                          mainAxisAlignment: MainAxisAlignment.center, // Centers text vertically
                          children: [
                            Text(
                              "TASKS",
                              style: TextStyle(color: Colors.white, fontSize: 30, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(height: 10),
                          ]
                      ),
                    ),
                  ),
                ),
              ),
            ],
          )
        ),
      );
  }
}
