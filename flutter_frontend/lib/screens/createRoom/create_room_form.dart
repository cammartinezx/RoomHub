// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:flutter_frontend/widgets/gradient_button.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:flutter_frontend/screens/home/home.dart';
import 'package:flutter_frontend/providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:flutter_frontend/utils/custom_exceptions.dart';
import 'package:flutter_frontend/utils/response_handler.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_frontend/config.dart';
import 'dart:convert';

class CreateRoomForm extends ConsumerStatefulWidget {
  const CreateRoomForm({super.key});
  @override
  _CreateRoomFormState createState() => _CreateRoomFormState();
}

class _CreateRoomFormState extends ConsumerState<CreateRoomForm> {
  final theme = OurTheme();
  TextEditingController nameController = TextEditingController();
  // Variable to store the email
  late String userEmail;

  @override
  void initState() {
    super.initState();
    // Store the email in initState
  }

  @override
  Widget build(BuildContext context) {
    userEmail = ref.read(emailProvider);
    print(userEmail);
    return Scaffold(
        body: Stack(
      //thanks for watching
      children: [
        Container(
          height: double.infinity,
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: [
              theme.mintgreen,
              theme.darkblue,
            ]),
          ),
        ),
        Positioned(
          top: 40.0,
          left: 20.0,
          right: 20.0,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Back button
              IconButton(
                icon: Icon(
                  Icons.arrow_back,
                  color: Colors.white,
                  size: 30,
                ),
                onPressed: () {
                  Navigator.of(context).pop(); // Go back to previous screen
                },
              ),
              // Title on the right
              const Text(
                '\nCreating your\n Room',
                textAlign: TextAlign.right,
                style: TextStyle(
                    fontSize: 30,
                    color: Colors.white,
                    fontWeight: FontWeight.w900),
              ),
            ],
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
                  Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '1 ', // Number 1
                          style: TextStyle(
                            fontWeight: FontWeight.w900,
                            fontSize: 60,
                            color:
                                theme.mintgreen, // Green color for the number
                          ),
                        ),
                        Text(
                          '\nAssign a name to your room\n\n',
                          softWrap: true, // Instruction text
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                            color: theme.darkblue, // Blue color for the text
                          ),
                        ),
                      ]),

                  const SizedBox(width: 50),

                  Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '2 ', // Number 1
                          style: TextStyle(
                            fontWeight: FontWeight.w900,
                            fontSize: 60,
                            color:
                                theme.mintgreen, // Green color for the number
                          ),
                        ),
                        Text(
                          '\nTell your roommates to join\n\n',
                          softWrap: true, // Instruction text
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                            color: theme.darkblue, // Blue color for the text
                          ),
                        ),
                      ]),

                  const SizedBox(width: 50), // Space between instructions

                  // Third instruction
                  Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '3 ', // Number 1
                          style: TextStyle(
                            fontWeight: FontWeight.w900,
                            fontSize: 60,
                            color:
                                theme.mintgreen, // Green color for the number
                          ),
                        ),
                        Text(
                          '\nAccept their request',
                          softWrap: true, // Instruction text
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                            color: theme.darkblue, // Blue color for the text
                          ),
                        ),
                      ]),

                  const SizedBox(height: 30),

                  TextField(
                    controller: nameController,
                    cursorColor: theme.darkblue,
                    decoration: InputDecoration(
                        prefixIcon: const Icon(
                          Icons.house_outlined,
                          color: Colors.grey,
                        ),
                        label: Text(
                          ' Name',
                          style: TextStyle(color: theme.darkblue),
                        )),
                  ),
                  const SizedBox(
                    height: 50,
                  ),
                  GradientButton(
                      text: 'Create Room',
                      onTap: () async {
                        if (await createRoomBE()) {
                          theme.buildToastMessage("Room succesfully created");
                          Future.delayed(const Duration(seconds: 1), () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) =>
                                    OurHome(roomID: nameController.text),
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

  Future<bool> createRoomBE() async {
    bool createSuccess = false;
    try {
      var regBody = {"rm": nameController.text, "id": userEmail};
      var response = await http.post(
        Uri.parse(createRoom),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(regBody),
      );
      print(createRoom);
      print(regBody);
      print(response);

      await handlePost(response, responseType: 'createRoom');
      createSuccess = true;
    } on RoomException catch (e) {
      print(e.message);
      theme.buildToastMessage(e.message);
    }
    return createSuccess;
  }
}
