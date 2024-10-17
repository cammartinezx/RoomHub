import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/NavBar.dart';
import 'package:flutter_frontend/screens/header.dart';

class UserRoom extends StatelessWidget {
  final String roomID;
  const UserRoom({super.key, required this.roomID});

  @override
  Widget build(BuildContext context) {
    // update the boiz with the valid roomID
    return Scaffold(
      backgroundColor: Colors.grey,
      drawer: Navbar(roomId: "The boiz"),
      body: SingleChildScrollView(
          child: Column(
            children: <Widget> [Header(roomId: "The boiz")],
          )
        ),
      );
  }
}
