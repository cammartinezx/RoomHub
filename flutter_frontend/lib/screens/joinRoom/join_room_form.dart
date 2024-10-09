// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:flutter_frontend/widgets/gradient_button.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:flutter_frontend/screens/home/home_new_user.dart';
import 'package:flutter_frontend/providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:flutter_frontend/utils/custom_exceptions.dart';
import 'package:flutter_frontend/utils/response_handler.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_frontend/config.dart';
import 'dart:convert';

class JoinRoomForm extends ConsumerStatefulWidget {
  const JoinRoomForm({super.key});
  @override
  _JoinRoomFormState createState() => _JoinRoomFormState();
}

class _JoinRoomFormState extends ConsumerState<JoinRoomForm> {
  final theme = OurTheme();
  TextEditingController emailController = TextEditingController();
// Variable to store the email
  late String userEmail;

  @override
  void initState() {
    super.initState();
    // Store the email in initState
    userEmail = ref.read(emailProvider);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Stack(
      //thanks for watching
      children: [
        Container(
          height: double.infinity,
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: [
              theme.darkblue,
              theme.mintgreen,
            ]),
          ),
          child: const Padding(
            padding: EdgeInsets.only(top: 85.0, left: 22),
            child: Text(
              'Request to join\n A Room',
              style: TextStyle(
                  fontSize: 30,
                  color: Colors.white,
                  fontWeight: FontWeight.w900),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(top: 200.0),
          child: Container(
            decoration: const BoxDecoration(
              borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(40), topRight: Radius.circular(40)),
              color: Colors.white,
            ),
            height: double.infinity,
            width: double.infinity,
            child: Padding(
              padding: const EdgeInsets.only(left: 18.0, right: 18),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // First Instruction
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        ' 1 ',
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 60,
                          color: theme.mintgreen,
                        ),
                      ),
                      Expanded(
                        // Expands the text to available space
                        child: Text(
                          '\nEnter your roommate\'s email\n\n',
                          softWrap: true,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: theme.darkblue,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(width: 50), // Space between instructions

                  // Second Instruction

                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        ' 2 ',
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 60,
                          color: theme.mintgreen,
                        ),
                      ),
                      Expanded(
                        child: Text(
                          '\nA notification request will be sent to their profile\n\n',
                          softWrap: true,
                          overflow: TextOverflow.visible, // Ensures text wraps
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: theme.darkblue,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(width: 50), // Space between instructions

                  // Third Instruction
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        ' 3 ',
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 60,
                          color: theme.mintgreen,
                        ),
                      ),
                      Expanded(
                        child: Text(
                          '\nOnce they accept, you are in!',
                          softWrap: true,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: theme.darkblue,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 30),

                  TextField(
                    controller: emailController,
                    cursorColor: theme.darkblue,
                    decoration: InputDecoration(
                        prefixIcon: const Icon(
                          Icons.alternate_email,
                          color: Colors.grey,
                        ),
                        label: Text(
                          "Roommate's email",
                          style: TextStyle(color: theme.darkblue),
                        )),
                  ),
                  const SizedBox(
                    height: 50,
                  ),
                  GradientButton(
                      text: 'Send Request',
                      onTap: () async {
                        if (await joinRoomBE()) {
                          theme.buildToastMessage("Request sent");
                          Future.delayed(const Duration(seconds: 1), () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => const OurHomeNewUser(),
                              ),
                            );
                          });
                        }
                      }),
                  const SizedBox(
                    height: 50,
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    ));
  }

  Future<bool> joinRoomBE() async {
    bool createSuccess = false;
    try {
      var regBody = {
        "from": userEmail,
        "to": emailController.text,
        "type": 'join-request',
      };
      var response = await http.post(
        Uri.parse(JoinRoom),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(regBody),
      );
      await handlePost(response, responseType: 'joinRoom');
      print(response.body);
      createSuccess = true;
    } on UserException catch (e) {
      theme.buildToastMessage(e.message);
    }
    return createSuccess;
  }
}
