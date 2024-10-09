/*import 'package:flutter/material.dart';

class Homenewuser extends StatelessWidget {
  const Homenewuser({super.key});

  @override
  Widget build(BuildContext context){
    return Scaffold(   
        body: Container(
        decoration: const BoxDecoration (
          gradient: LinearGradient(
          colors: [ Color.fromARGB(255, 29, 52, 83), ],
          begin: FractionalOffset(0.0, 0.4), 
          end: Alignment. topRight,
        )
        )
    )
    );
  }
}*/
import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/createRoom/create_room.dart';
import 'package:flutter_frontend/screens/joinRoom/join_room.dart';
import 'package:flutter_frontend/widgets/button.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:flutter_frontend/widgets/gradient_button.dart';
import 'package:flutter_frontend/widgets/our_container.dart';
import 'package:flutter_frontend/utils/comingsoon.dart';

import 'package:flutter_frontend/providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_frontend/aws_auth.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';

class OurHomeNewUser extends ConsumerStatefulWidget {
  const OurHomeNewUser({super.key});

  @override
  ConsumerState<OurHomeNewUser> createState() => _OurHomeNewUserState();
}

class _OurHomeNewUserState extends ConsumerState<OurHomeNewUser> {
  final theme = OurTheme();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16.0), // Add padding to the left
          child: Icon(
            Icons.menu,
            color: theme.darkblue,
            size: 34.0,
          ),
        ),
        title: Padding(
          padding: const EdgeInsets.only(
              top: 33.0), // Add horizontal padding to the text
          child: Text(
            'RoomHub',
            style: TextStyle(
              color: theme.darkblue,
              fontSize: 28.0,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        actions: [
          Padding(
            padding:
                const EdgeInsets.only(right: 16.0), // Add padding to the right
            child: IconButton(
              icon: Icon(
                Icons.notifications,
                color: theme.darkblue,
                size: 34.0,
              ),
              onPressed: () {
                // Add functionality here
              },
            ),
          ),
        ],
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            child: ListView(
              padding: const EdgeInsets.only(
                  top: 40.0, right: 20, left: 20, bottom: 20),
              children: <Widget>[
//CREATE ROOM CONTAINER
                OurContainer(
                  child: Row(
                    children: [
                      Expanded(
                        flex: 6,
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              const Text("Create a Room",
                                  style: TextStyle(
                                      color: Color.fromARGB(255, 29, 52, 83),
                                      fontSize: 23.0,
                                      fontWeight: FontWeight.bold)),
                              const Text('If is your first time in the app',
                                  softWrap: true),
                              const SizedBox(height: 10),
                              GradientButton(
                                  text: "Continue",
                                  onTap: () {
                                    Navigator.of(context)
                                        .push(MaterialPageRoute(
                                      builder: (context) => CreateRoom(),
                                    ));
                                  })
                            ]),
                      ),
                      Expanded(
                        flex: 4,
                        child: Image.asset(
                            'assets/bed.png'), //,width: 150.0, height: 150.0)
                      )
                    ],
                  ),
                ),
                const SizedBox(height: 10),

//JOIN ROOM
                OurContainer(
                  child: Row(
                    children: [
                      Expanded(
                        flex: 6,
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              const Text("Join a Room",
                                  style: TextStyle(
                                      color: Color.fromARGB(255, 29, 52, 83),
                                      fontSize: 23.0,
                                      fontWeight: FontWeight.bold)),
                              const Text(
                                  'If the room has already been created by your roommates',
                                  softWrap: true),
                              const SizedBox(height: 10),
                              GradientButton(
                                  text: "Continue",
                                  onTap: () {
                                    Navigator.of(context)
                                        .push(MaterialPageRoute(
                                      builder: (context) => JoinRoom(),
                                    ));
                                  })
                            ]),
                      ),
                      Expanded(
                        flex: 4,
                        child: Image.asset(
                            'assets/find_room.png'), //,width: 150.0, height: 150.0)
                      )
                    ],
                  ),
                ),
                const SizedBox(height: 10),

//FIND ROOMMATES

                OurContainer(
                  child: Row(
                    children: [
                      Expanded(
                        flex: 6,
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              const Text("Find Roommates",
                                  style: TextStyle(
                                      color: Color.fromARGB(255, 29, 52, 83),
                                      fontSize: 23.0,
                                      fontWeight: FontWeight.bold)),
                              const Text(
                                  'If you are looking for your perfect match',
                                  softWrap: true),
                              const SizedBox(height: 10),
                              GradientButton(
                                  text: "Continue",
                                  onTap: () {
                                    Navigator.of(context).push(
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                ComingSoonPage()));
                                  })
                            ]),
                      ),
                      Expanded(
                        flex: 4,
                        child: Image.asset(
                            'assets/find_roommate.png'), //,width: 150.0, height: 150.0)
                      )
                    ],
                  ),
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () async {
                    logOut();
                  },
                  child: const Text(
                    "Log Out",
                    style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 8.0),
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  void logOut() async {
    try {
      // Accessing AWS authentication repository using Riverpod provider
      final authAWSRepo = ref.read(authAWSRepositoryProvider);
      // Attempting to sign in with email and password
      await authAWSRepo.logOut(ref);
      // Refresh the auth user provider after signing in
      ref.refresh(authUserProvider);
    } on AuthException catch (e) {
      theme.buildToastMessage(e.message);
    }
  }
}
