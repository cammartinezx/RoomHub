import 'package:flutter/material.dart';
import 'package:flutter_frontend/widgets/gradient_button.dart';
import 'package:flutter_frontend/utils/our_theme.dart';

class JoinRoomForm extends StatefulWidget {
  const JoinRoomForm({super.key});
  @override
  _JoinRoomFormState createState() => _JoinRoomFormState();
}

class _JoinRoomFormState extends State<JoinRoomForm> {
  final theme = OurTheme();
  TextEditingController nameController = TextEditingController();
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

                  SizedBox(width: 50), // Space between instructions

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
                    controller: nameController,
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
                      onTap: () {
                        theme.buildToastMessage("Room succesfully created");
                        Future.delayed(const Duration(seconds: 1), () {
                          Navigator.pushNamed(context, '/homeNewPage');
                        });}),
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
}
