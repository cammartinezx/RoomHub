import 'dart:convert';

import "package:flutter/material.dart";
import 'package:flutter_frontend/screens/home/user_home.dart';
import "package:flutter_frontend/utils/chip_selection.dart";
import 'package:flutter_frontend/utils/our_theme.dart';
import "package:flutter_frontend/widgets/gradient_button.dart";
import 'package:http/http.dart' as http;
import 'package:flutter_frontend/utils/response_handler.dart';
import 'package:flutter_frontend/config.dart';

import '../../utils/custom_exceptions.dart';

class TagForm extends StatefulWidget {
  final String userId;
  const TagForm({super.key, required this.userId});

  @override
  State<TagForm> createState() => _TagFormState();
}

class _TagFormState extends State<TagForm> {
  final theme = OurTheme();
  List<String> userTags = [
    "Pet-Friendly 🐾",
    "Loves Outdoors 🌲",
    "Women-Only 🚺",
    "Non-Smoker 🚭",
    "Vegetarian/Vegan 🌱",
    "Early Riser 🌅",
    "Student-Friendly 🎓",
    "Night Owl 🌙",
    "Private 🚪",
    "Working Professional 💼",
    "LGBTQ+ Friendly 🏳️‍🌈",
    "Open to Guests 👥",
    "Eco-Conscious ♻️",
    "Fitness Enthusiast 🏋️",
    "Minimalist 🌿",
    "Creative-Friendly 🎨",
    "Remote Worker Friendly 💻",
    "Quiet 🤫",
    "Health-Conscious 🥗",
    "Tech-Savvy 📱",
    "Homebody 🏠",
    "Likes Cooking 🍲",
    "Kid-Friendly 🧒",
    "Quiet Hours ⏰",
    "Shares Groceries 🛒",
    "Long-Term 📅",
    "Social 👫",
    "Mindful of Utilities 💡",
    "Flexible with Pets 🐕",
    "Organized 🗂️",
    "Clean 🧼",
    "Short-Term Friendly 🗓️",
  ];

  late List<bool> isSelected = List.filled(userTags.length, false);
  late int activeAnnouncement = -1;
  bool disableChips = false;
  TextEditingController _textController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Add listener to the TextField controller
    _textController.addListener(() {
      setState(() {
        disableChips = _textController.text.isNotEmpty;
      });
    });
  }

  // handle chip selection
  void handleChipSelected(List<int> selectedIndices) {
    // update the index of the active announcement.
    setState(() {
      for (int i = 0; i < isSelected.length; i++) {
        isSelected[i] = selectedIndices.contains(i);
      }
    });
  }

  List<String> getSelectedTags() {
    List<String> selectedTags = [];
    for (int i = 0; i < isSelected.length; i++) {
      if (isSelected[i]) {
        selectedTags.add(userTags[i]);
      }
    }
    return selectedTags;
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
              gradient:
                  LinearGradient(colors: [theme.mintgreen, theme.darkblue]),
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
                  '\nDescribe\nYourself',
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
                  topLeft: Radius.circular(25),
                  topRight: Radius.circular(25),
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
                      Padding(
                        padding: const EdgeInsets.only(top: 20, bottom: 5.0),
                        child: Text(
                            "Select up to 5 qualities that best describe you as a roommate!",
                            style: TextStyle(
                              color: theme.darkblue,
                              fontSize: 17.0,
                              fontWeight: FontWeight.bold,
                            )),
                      ),
                      const SizedBox(
                        height: 5.0,
                      ),
                      Padding(
                          padding: const EdgeInsets.only(bottom: 10.0),
                          child: ChipSelection(
                              disableChips: disableChips,
                              onChipSelected: this.handleChipSelected,
                              isSelected: this.isSelected,
                              tags: this.userTags,
                              maxSelections: 5)),

                      const SizedBox(
                        height: 40.0,
                      ),
                      GradientButton(
                          text: 'Save',
                          onTap: () async {
                            List<String> selectedTags = getSelectedTags();
                            print("Selected Tags: $selectedTags");
                            updateTags(widget.userId, selectedTags);
                            Navigator.of(context).pushReplacement(
                              MaterialPageRoute(
                                builder: (context) =>
                                    UserHome(email: widget.userId)
                              ),
                            );
                            
                          }),
                      const SizedBox(height: 50), // Spacer below button
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

  Future<bool> updateTags(String userId, List<String> selectedTags) async {
    try {
      // Construct the request body
      var reqBody = {
        "tags": selectedTags,
      };

      print("Request Body: $reqBody");

      // Make the POST request to the API
      var response = await http.patch(
        Uri.parse("$profile/$userId/update-tags"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(reqBody),
      );
      // Handle the response
      if (response.statusCode == 200) {
        print("Tags updated successfully: ${response.body}");
        return true;
      } else {
        // Handle potential errors based on status code
        print("Error: ${response.statusCode} - ${response.body}");
        throw Exception(
            jsonDecode(response.body)['message'] ?? "Failed to update tags.");
      }
    } catch (e) {
      print("Failed to update tags: $e");
      rethrow;
    }
  }

  void resetChips() {
    _textController.clear();
    isSelected = List.filled(userTags.length, false);
    activeAnnouncement = -1;
  }
}
