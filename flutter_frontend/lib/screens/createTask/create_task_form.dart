import 'dart:convert';

import "package:flutter/material.dart";
import 'package:flutter_frontend/utils/our_theme.dart';
import "package:flutter_frontend/widgets/gradient_button.dart";
import 'package:http/http.dart' as http;
import 'package:flutter_frontend/utils/response_handler.dart';
import 'package:flutter_frontend/config.dart';

import '../../utils/custom_exceptions.dart';


class TaskForm extends StatefulWidget {
  final String email;
  const TaskForm({super.key, required this.email});

  @override
  State<TaskForm> createState() => _TaskFormState();
}

class _TaskFormState extends State<TaskForm> {
  final theme = OurTheme();
  TextEditingController _taskNameController = TextEditingController();
  String? selectedRoommate;
  final List<String> roomMates= ["danny@gmail.com","dd@gmail.com", "lola@gmail.com"];
  DateTime? selectedDate;
  TextEditingController _dateController = TextEditingController();

  String? _taskNameError; // Error message for name field
  String? _assigneeError; // Error message for email field


  @override
  void initState() {
    super.initState();
    // Add listener to the TextField controller
  }

  // date selection
  Future<void> _selectDate(BuildContext context) async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: selectedDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime(2100),
    );

    if (pickedDate != null && pickedDate != selectedDate) {
      setState(() {
        selectedDate = pickedDate;
        _dateController.text = "${pickedDate.toLocal()}".split(' ')[0]; // Formatting date
      });
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background gradient container
          Container(
            height: double.infinity,
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: [
                theme.mintgreen, // Gradient starting color
                theme.darkblue,  // Gradient ending color
              ]),
            ),
          ),
          // Positioned header with back button and title
          Positioned(
            top: 40.0,
            left: 20.0,
            right: 20.0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Back button to return to the previous screen
                IconButton(
                  icon: const Icon(
                    Icons.arrow_back,
                    color: Colors.white,
                    size: 30,
                  ),
                  onPressed: () {
                    Navigator.of(context).pop(); // Pop the current screen
                  },
                ),
                // Title text indicating the purpose of the screen
                const Text(
                  '\nCreate \nTask',
                  textAlign: TextAlign.right,
                  style: TextStyle(
                      fontSize: 30,
                      color: Colors.white,
                      fontWeight: FontWeight.w900),
                ),
              ],
            ),
          ),
          // Main content container for instructions and email input
          Padding(
            padding: const EdgeInsets.only(top: 200.0),
            child: Container(
              decoration: const BoxDecoration(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(40),
                  topRight: Radius.circular(40),
                ),
                color: Colors.white, // Background color for the input area
              ),
              height: double.infinity,
              width: double.infinity,
              child: Padding(
                padding: const EdgeInsets.only(left: 18.0, right: 18),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(
                        height: 20.0,
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 30),
                        child: Text("Create/Edit a Task",
                            style: TextStyle(
                              color: theme.darkblue,
                              fontSize: 30.0,
                              fontWeight: FontWeight.bold,)
                        ),
                      ),
                      const SizedBox(
                        height: 20.0,
                      ),
                      TextFormField(
                        controller: _taskNameController,
                        cursorColor: theme.darkblue,
                        decoration: InputDecoration(
                            label: Text(
                              "Task Name",
                              style: TextStyle(color: theme.darkblue),
                            ),
                          errorText: _taskNameError
                        ),
                      ),
                      const SizedBox(
                        height: 20.0,
                      ),
                      DropdownButtonFormField<String>(
                          value: selectedRoommate,
                          icon: const Icon(Icons.arrow_drop_down),
                          decoration: InputDecoration(
                            label: Text(
                              "Choose Roommate",
                              style: TextStyle(color: theme.darkblue),
                            ),
                            errorText: _assigneeError
                          ),
                          items: roomMates.map<DropdownMenuItem<String>>((String value) {
                            return DropdownMenuItem<String>(value: value, child: Text(value));
                          }).toList(),
                          onChanged: (String? newValue) {
                            setState(() {
                              selectedRoommate = newValue;
                            });
                          }
                      ),
                      const SizedBox(
                        height: 20.0,
                      ),
                      TextFormField(
                        controller: _dateController,
                        cursorColor: theme.darkblue,
                        readOnly: true,
                        onTap: () => _selectDate(context), // Show date picker on tap
                        decoration: InputDecoration(
                            prefixIcon: const Icon(Icons.calendar_today),
                            label: Text(
                              "Due date",
                              style: TextStyle(color: theme.darkblue),
                            ),
                        ),
                      ),
                      const SizedBox(
                        height: 40.0,
                      ),
                      GradientButton(text: 'Save Task',
                          onTap: () {save_Task();}),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  bool _validateFields() {
    print(_taskNameController.text);
    print(selectedRoommate);
    setState(() {
      // Check if the name field is empty
      _taskNameError = _taskNameController.text.isEmpty ? 'This field is required' : null;
      // Check if the email field is empty
      _assigneeError = selectedRoommate == null ? 'This field is required' : null;
    });

    // If both fields are valid, you can proceed with your logic
    if (_taskNameError == null && _assigneeError == null) {
      // Proceed with form submission
      print('Form is valid');
      // You can add your submission logic here
      return true;
    }
    else{
      return false;
    }
  }

  void save_Task() {
    try{
      if(_validateFields()){
        debugPrint("Add backend stuff to create a new task");
      }
    }catch(e){
      theme.buildToastMessage("Select a preset message or make a custom announcement!!");
    }

  }

  bool isValidAnnouncement(String msg) {
    return msg.isNotEmpty; // Returns true if msg is not empty, false otherwise
  }

  void sendAnnouncementRequest(String msg) async{
    try {
      debugPrint(widget.email);
      var reqBody = {
        "from": widget.email, // User's email (sender)
        "message": msg, // Roommate's email (recipient)
        "type": 'announcement', // Request type
      };
      var response = await http.post(
        Uri.parse(sendAnnouncement),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(reqBody), // Encode the request body as JSON
      );
      await handlePost(response, responseType: 'sendAnnouncement');
      theme.buildToastMessage("Announcement sent successfully");
    } on NotificationException catch(e) {
      theme.buildToastMessage(e.message);
    }
  }

}


// I forgot my keys—can someone let me in?"
// "I'm having friends over tonight, just a heads-up."
// "I’ll be late coming home, don’t wait up!"
// "The Wi-Fi’s down—anyone else having issues?"
// "Left the stove on—could someone check?"
// "Package is arriving today, could someone grab it?"
// "Cleaning day tomorrow—let's remember to tidy up!"