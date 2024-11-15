import 'dart:convert';

import "package:flutter/material.dart";
import 'package:flutter_frontend/screens/home/home.dart';
import 'package:flutter_frontend/screens/userProfile/edit_user_info.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import "package:flutter_frontend/widgets/gradient_button.dart";
import 'package:http/http.dart' as http;
import 'package:flutter_frontend/utils/response_handler.dart';
import 'package:flutter_frontend/config.dart';

import '../../utils/custom_exceptions.dart';

class UserProfilePage extends StatefulWidget {
  final String firstName;
  final String lastName;
  final String gender;
  final String ethnicity;
  final String birthDate;
  final String description;
  final String email;
  final String roomID;

  UserProfilePage({
    required this.email, 
    required this.roomID,
    required this.firstName,
    required this.lastName,
    required this.gender,
    required this.ethnicity,
    required this.birthDate,
    required this.description,
  });
  

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  final theme = OurTheme();

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
                theme.darkblue, // Gradient ending color
              ]),
            ),
          ),
          // Positioned header with back button and title
          Positioned(
            top: 40.0,
            left: 20.0,
            right: 20.0,
            child: Padding(
              padding: EdgeInsets.only(top: 50),
              child: Stack(
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
                  const Center(
                    child: Text(
                      'User Profile',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          fontSize: 30,
                          color: Colors.white,
                          fontWeight: FontWeight.w900),
                    ),
                  ),
                ],
              ),
            ),
          ), 
          Padding(
            padding: const EdgeInsets.only(top: 230.0),
            child:
                Container(
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
                  padding: const EdgeInsets.symmetric(horizontal: 50.0, vertical: 90.0),
                  child: SingleChildScrollView(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildProfileInfo('First Name', widget.firstName),
              
                        _buildProfileInfo('Last Name', widget.lastName),
              
                        _buildProfileInfo('Gender', widget.gender),
              
                        _buildProfileInfo('Ethnicity', widget.ethnicity),
              
                        _buildProfileInfo('Birth Date', widget.birthDate),
              
                        _buildProfileInfo('Description', widget.description),
                        const SizedBox(height: 20.0),
                      //S A V E    B U T T O N
                      GradientButton(
                          text: 'Continue',
                          onTap: () async {
                              Navigator.of(context).pushReplacement(
                                MaterialPageRoute(
                                  builder: (context) => UserInfoForm(email: widget.email, roomID: widget.roomID)
                                ),
                              );
                            
                          }),
                      ],
                    ),
                  ),
                ),
              ),
          ),
        const Align(
          alignment: Alignment.topCenter, // Centers the widget horizontally
          child: Padding(
            padding: EdgeInsets.only(top: 160.0), // Adjust vertical position
            child: CircleAvatar(
              radius: 70, // Adjust size as needed
              backgroundImage: AssetImage("assets/user_profile.png"),
            ),
          ),
        ),    
        ],
      ),
    );
  }

  Widget _buildProfileInfo(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 15,
                color: theme.lightgrey),
          ),
          const SizedBox(height: 6.0), // Small space between title and box
          Container(
            width: double.infinity,
            padding:
                const EdgeInsets.symmetric(vertical: 12.0, horizontal: 20.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20.0),
              border: Border.all(color: theme.lightgrey, width: 1.0),
            ),
            child: Text(
              value,
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: theme.darkblue),
            ),
          ),
        ],
      ),
    );
  }
}
