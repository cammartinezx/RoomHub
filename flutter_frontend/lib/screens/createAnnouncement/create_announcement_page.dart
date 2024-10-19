import "package:flutter/material.dart";
import 'package:flutter_frontend/utils/our_theme.dart';
import "../header.dart";

class CreateAnnouncement extends StatelessWidget {
  const CreateAnnouncement({super.key});


  @override
  Widget build(BuildContext context) {
    final theme = OurTheme();
    final List<String> announcements = [
      "Forgot my keys, please leave the door unlocked!",
      "Having friends over tonight at 8 PM.",
      "Out of milk, please restock!",
      "Going away for the weekend.",
      "Left my laundry in the machine—please remind me!",
      "Hosting a study session at 6 PM.",
      "Ran out of dish soap—can someone pick some up?"
    ];
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          const Header(),
          Text("Create Announcement",
            style: TextStyle(
              color: theme.darkblue,
              fontSize: 30.0,
              fontWeight: FontWeight.bold,
            ),
          ),
          const Expanded(
              child: Padding(
                padding: EdgeInsets.all(10.0),
                child: Wrap(
                  spacing: 10.0,
                  runSpacing: 8.0,
                  children: [
                    Chip(label: Text("I forgot my keys—can someone let me in?")),
                    Chip(label: Text("Having friends over tonight, just a heads up")),
                    Chip(label: Text("Going to be late, don't stay up")),
                    Chip(label: Text("The Wi-Fi’s down—anyone else having issues?")),
                    Chip(label: Text("I have a package arriving today, could someone grab it?")),
                    Chip(label: Text("Keep it down. Music is too Loud")),
                  ],
                ),
              ),
          ),
          const SizedBox(height: 10.0),
          Container(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Make your own announcement",
                    style: TextStyle(
                      color: theme.darkblue,
                      fontSize: 20.0,
                      fontWeight: FontWeight.bold,)
                ),
              ]
            ),
          ),
          const SizedBox(
            height: 30.0,
          ),
          Padding(
            padding: const EdgeInsets.all(5.0),
            child: TextField(
                cursorColor: Theme.of(context).primaryColorDark,
                decoration: InputDecoration(
                    label: Text(
                      "Your Announcement",
                      style: TextStyle(color: theme.darkgrey),
                    )
                )
            ),
          ),
          const SizedBox(
            height: 30.0,
          ),
         OutlinedButton(onPressed: () {debugPrint("Yolo");}, child:Text("Create Announcement")),
          const SizedBox(
            height: 100.0,
          ),
        ],
      ),
    );
  }
}


// I forgot my keys—can someone let me in?"
// "I'm having friends over tonight, just a heads-up."
// "I’ll be late coming home, don’t wait up!"
// "The Wi-Fi’s down—anyone else having issues?"
// "Left the stove on—could someone check?"
// "Package is arriving today, could someone grab it?"
// "Cleaning day tomorrow—let's remember to tidy up!"