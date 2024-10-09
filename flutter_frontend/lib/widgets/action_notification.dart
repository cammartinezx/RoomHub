import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_frontend/widgets/action_button.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:flutter_frontend/providers.dart';
import 'package:flutter_frontend/utils/custom_exceptions.dart';
import 'package:flutter_frontend/utils/response_handler.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_frontend/config.dart';
import 'dart:convert';

class ActionNotification extends ConsumerStatefulWidget {
  final String message;
  final String id;
  const ActionNotification(
      {super.key, required this.message, required this.id});

  @override
  ConsumerState<ActionNotification> createState() => _ActionNotificationState();
}

class _ActionNotificationState extends ConsumerState<ActionNotification> {
  final theme = OurTheme();
  late String userEmail;

  @override
  void initState() {
    super.initState();
    // Store the email in initState
    userEmail = ref.read(emailProvider);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.only(bottom: 10.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Expanded(
              flex: 5,
              child: Container(
                height: 100,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text(
                      widget.message,
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 18,
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: <Widget>[
                        Expanded(
                            child: ActionButton(
                                text: "Accept",
                                onTap: () {
                                  addRoommateBE();
                                },
                                color: theme.mintgreen)),
                        const Padding(
                          padding: EdgeInsets.only(right: 10),
                        ),
                        Expanded(
                            child: ActionButton(
                                text: "Reject", color: theme.darkgrey)),
                      ],
                    )
                  ],
                ),
              ),
            ),
          ],
        ));
  }

  //Future<bool>
  void addRoommateBE() async {
    bool createSuccess = false;
    try {
      var regBody = {
        "existing_roommate": "odumahwilliam@gmail.com",//userEmail,
        "new_roommate": "dan@gmail.com",
        "room_nm": "final room",
        "notification_id": widget.id
      };
      var response = await http.post(
        Uri.parse(addRoommate),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(regBody),
      );
      print(response.body);
      print(response.statusCode);
      await handlePost(response, responseType: 'createRoom');
      createSuccess = true;
    } on UserException catch (e) {
      print(e.message);
      theme.buildToastMessage(e.message);
    }
    //return createSuccess;
  }
}
