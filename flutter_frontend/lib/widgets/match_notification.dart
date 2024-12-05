import 'package:flutter/material.dart';
import 'package:flutter_frontend/screens/userProfile/profile.dart';
import 'package:flutter_frontend/widgets/action_button.dart';
import 'package:flutter_frontend/utils/our_theme.dart';
import 'package:flutter_frontend/widgets/profile_card.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:flutter_frontend/providers.dart';
import 'package:flutter_frontend/utils/custom_exceptions.dart';
import 'package:flutter_frontend/utils/response_handler.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_frontend/config.dart';
import 'dart:convert';

class MatchNotification extends ConsumerStatefulWidget {
  final String message;
  final String id;
  final String liked_id;
  final Function(String id) onRemove;

  const MatchNotification(
      {super.key,
      required this.message,
      required this.id,
      required this.liked_id,
      required this.onRemove});

  @override
  ConsumerState<MatchNotification> createState() => _ActionNotificationState();
}

class _ActionNotificationState extends ConsumerState<MatchNotification> {
  final theme = OurTheme();
  late String userEmail;
  Profile? liked_profile;

  @override
  void initState() {
    super.initState();
    _fetchLikedProfile();
  }

  Future<void> _fetchLikedProfile() async {
    try {
      Profile? temp = await getProfile(widget.liked_id);

      setState(() {
        liked_profile = temp;
        print(liked_profile);
      }); // Update the state to reflect the fetched profile
    } catch (e) {
      print("Error fetching liked profile: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    userEmail = ref.read(emailProvider);

    return Container(
        padding: const EdgeInsets.only(bottom: 10.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Expanded(
              flex: 5,
              child: SizedBox(
                height: 120,
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
                                text: "View Profile",
                                onTap: () async {
                                  if (liked_profile != null) {
                                    showDialog(
                                      context: context,
                                      builder: (BuildContext context) {
                                        return Dialog(
                                          insetPadding:
                                              const EdgeInsets.all(10),
                                          backgroundColor: Colors.transparent,
                                          child: Stack(
                                            children: [
                                              Positioned(
                                                top: 20,
                                                right: 20,
                                                child: GestureDetector(
                                                  onTap: () {
                                                    Navigator.of(context).pop();
                                                  },
                                                  child: const Icon(
                                                    Icons.close,
                                                    size: 30,
                                                    color: Colors.black,
                                                  ),
                                                ),
                                              ),
                                              Center(
                                                child: ProfileCard(
                                                  profile: liked_profile!,
                                                  gradient: [
                                                    theme.mintgreen,
                                                    theme.darkblue
                                                  ],
                                                ),
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                    );
                                  } else {
                                    // Handle case where profile is not loaded
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text(
                                            "Profile is not yet loaded. Please try again."),
                                      ),
                                    );
                                  }
                                },
                                color: theme.mintgreen)),
                        const Padding(
                          padding: EdgeInsets.only(right: 10),
                        ),
                        Expanded(
                            child: ActionButton(
                          text: "Get Contacts",
                          color: theme.darkgrey,
                          onTap: () {
                            _showContacts(liked_profile?.contactType,
                                liked_profile?.contact);
                          },
                        )),
                      ],
                    ),
                    Divider(
                      color: theme.lightgrey, // Color of the divider
                      thickness: 2, // Thickness of the line
                    ),
                  ],
                ),
              ),
            ),
          ],
        ));
  }

  void _showContacts(String? contactType, String? contact) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Reach out to your potential new roommate'),
          content: Column(
            mainAxisSize: MainAxisSize
                .min, // Ensures the dialog is only as big as the content
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Contact Type: $contactType',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.indigo.shade900,
                ),
              ),
              const SizedBox(height: 8), // Add spacing between the lines
              Text(
                'Contact: $contact',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.indigo.shade700,
                ),
              ),
            ],
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  Future<Profile> getProfile(String userId) async {
    late Profile thisProfile;
    try {
      var response = await http.get(
        Uri.parse("$profile/$userId/$getProfilePth"),
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);

        if (jsonData['profile'] != null) {
          thisProfile = Profile.parseProfile(jsonData['profile']);
        } else {
          throw ProfileException("Profile data not found");
        }
      } else {
        throw ProfileException("Failed to fetch profile: ${response.body}");
      }
    } catch (e) {
      print("Unexpected error: $e");
      throw ProfileException("Error fetching profile");
    }
    return thisProfile;
  }
}
