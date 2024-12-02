import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/home/home.dart';
import 'package:flutter_frontend/screens/home/home_existing_user.dart';
import 'package:flutter_frontend/screens/home/home_new_user.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_frontend/utils/response_handler.dart';

import '../../utils/custom_exceptions.dart';
class UserHome extends ConsumerStatefulWidget {
  final String email;
  const UserHome({super.key, required this.email});

  @override
  ConsumerState<UserHome> createState() => _UserHomeState();
}

class _UserHomeState extends ConsumerState<UserHome> {
  final theme = OurTheme();
  String? roomId;

  @override
  void initState() {
    super.initState();

    roomIdCaller();
  }

  void roomIdCaller() async{
    String? room = await redirectHome();
    setState(() {
      roomId = room;
    });

  }
  Future<String?> redirectHome() async {
    String? roomName;
    try {
      var response = await http.get(
        Uri.parse("${url}user/${widget.email}/get-room"),
        headers: {"Content-Type": "application/json"},
      );
      // Await the response from getResponse
      roomName =
      await getResponse(response, responseType: 'getUserRoom');
    } on UserException catch (e) {
      print(e.toString());
      theme
          .buildToastMessage(e.message); // Display error if an exception occurs
    }
    return roomName;
  }

  // Simulate a data fetch and refresh operation
  Future<void> _refreshData() async {
    String? room = await redirectHome();

    setState(() {
      // Add new items to simulate data change
      roomId = room;
    });
  }

  @override
  @override
  Widget build(BuildContext context) {
    if (roomId == null) {
      return const Scaffold(
        body: Center(
          child: SizedBox(
            width: 40,
            height: 40,
            child: CircularProgressIndicator(),
          ),
        ),
      );
    } else if (roomId == "NA") {
      return OurHomeNewUser(onRefresh: _refreshData); // Assume it doesn't scroll internally
    }else{
      return OurHomeExisting(roomID: roomId!, email: widget.email, onRefresh: _refreshData);
    }

    //       ),
    //     ),
    //   );
    // }
  }
}
