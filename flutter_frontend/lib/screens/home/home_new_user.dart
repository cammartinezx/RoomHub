import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/createRoom/create_room.dart';
import 'package:flutter_frontend/screens/findRoommate/find_roommate_main.dart';
import 'package:flutter_frontend/utils/custom_exceptions.dart';
import 'package:flutter_frontend/widgets/header.dart';
import 'package:flutter_frontend/screens/joinRoom/join_room.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:flutter_frontend/widgets/gradient_button.dart';
import 'package:flutter_frontend/widgets/header_profile.dart';
import 'package:flutter_frontend/widgets/our_container.dart';
//import 'package:flutter_frontend/utils/comingsoon.dart';
import 'package:flutter_frontend/screens/login/login.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_frontend/config.dart';

import 'package:flutter_frontend/providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_frontend/aws_auth.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';

class OurHomeNewUser extends ConsumerStatefulWidget {
  final Future<void> Function()? onRefresh;
  final email;
  const OurHomeNewUser(
      {super.key, required this.onRefresh, required this.email});

  @override
  ConsumerState<OurHomeNewUser> createState() => _OurHomeNewUserState();
}

class _OurHomeNewUserState extends ConsumerState<OurHomeNewUser> {
  final theme = OurTheme();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      body: RefreshIndicator(
        onRefresh: widget.onRefresh!,
        child: SingleChildScrollView(
          physics: AlwaysScrollableScrollPhysics(),
          child: Column(
            children: <Widget>[
              const HeaderProfile(),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: OurContainer(
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
                            const Text('If this is your first time in the app',
                                softWrap: true),
                            const SizedBox(height: 10),
                            GradientButton(
                                text: "Continue",
                                onTap: () {
                                  Navigator.of(context).push(MaterialPageRoute(
                                    builder: (context) => const CreateRoom(),
                                  ));
                                })
                          ],
                        ),
                      ),
                      Expanded(
                        flex: 4,
                        child: Image.asset('assets/bed.png'),
                      )
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 10),

              // JOIN ROOM
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: OurContainer(
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
                                  Navigator.of(context).push(MaterialPageRoute(
                                    builder: (context) => const JoinRoom(),
                                  ));
                                })
                          ],
                        ),
                      ),
                      Expanded(
                        flex: 4,
                        child: Image.asset('assets/find_room.png'),
                      )
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 10),

              // FIND ROOMMATES
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: OurContainer(
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
                              onTap: () async {
                                bool hasProf = await hasProfile(widget.email);
                                print(hasProf);
                                if (hasProf) {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (context) => FindRoommateMain(),
                                    ),
                                  );
                                } else {
                                  theme.buildToastMessage(
                                      "Create your profile by clicking the user icon at the top left");
                                }
                              },
                            )
                          ],
                        ),
                      ),
                      Expanded(
                        flex: 4,
                        child: Image.asset('assets/find_roommate.png'),
                      )
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: () async {
                  logOut();
                },
                child: const Text(
                  "Log Out",
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 15.0),
                ),
              )
            ],
          ),
        ),
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
      // ignore: unused_result
      ref.refresh(authUserProvider);
      Navigator.of(context)
          .push(MaterialPageRoute(builder: (context) => const OurLogin()));
    } on AuthException catch (e) {
      theme.buildToastMessage(e.message);
    }
  }

  Future<bool> hasProfile(String userId) async {
    bool hasProfile = false;
    try {
      var response = await http.get(
        Uri.parse("$user/$userId/$findRoomMatePage"),
        headers: {"Content-Type": "application/json"},
      );
      print(response.statusCode);
      print(response.body);
      if (response.statusCode == 200) {
        hasProfile = true;
      }
    } on ProfileException catch (e) {
      print(e.toString());
      return false;
    }
    return hasProfile;
  }
}
