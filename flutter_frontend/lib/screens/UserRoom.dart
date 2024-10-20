import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/NavBar.dart';
import 'package:flutter_frontend/screens/header.dart';

class UserRoom extends StatelessWidget {
  final String roomID;
  final String email;
  const UserRoom({super.key, required this.roomID, required this.email});

  @override
  Widget build(BuildContext context) {
    // update the boiz with the valid roomID
    return Scaffold(
      backgroundColor: Colors.grey,
      drawer: Navbar(roomId: "The boiz", email: email),
      body: SingleChildScrollView(
          child: Column(
            children: <Widget> [Header(roomId: "The boiz")],
          )
        ),
      );
  }
}
